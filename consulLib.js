var Q       = require('q');
var request = require('request');

var os = require('os');

var util    = require('util');
var fromCallback = function (fn) {
  var deferred = Q.defer();
  fn(function (err, data) {
    if (err) {
      deferred.reject(err);
    }
    else {
      deferred.resolve(data);
    }
  });
  return deferred.promise;
};

var consulAddr = 'consul';
var consulPort = 38500;
var consul = require('consul')({ host: consulAddr, 
                                 port: consulPort,
                                 promisify: fromCallback });
                                 
function registerService() {
    var nodeName = os.hostname();
    var serviceName = 'cf-show-nodejs';
    var servicePort = 3000;
    var ip = require('ip');
    var ip = ip.address();
    var consulAclToken = "";
    
    var nodeServiceDef = {
        "Node": nodeName,
        "Address": ip,
        "Service": {
          "Service": serviceName,
          "Address": ip,
          "TaggedAddresses": {
            "wan": ip
          },
          "Port": servicePort
        },
        "Check": {
          "Node": nodeName,
          "CheckID": "service:" + serviceName,
          "Name": "Dummy Check",
          "Notes": "",
          "Status": "passing",
          "ServiceID": serviceName
        },
        "WriteRequest": {
          "Token": consulAclToken
        }  
      };
    
     Q.nfcall(request.put, {headers: {'content-type': 'application/json'},
                               url:    util.format('http://%s:%s/v1/catalog/register', consulAddr, consulPort),
                              body:    JSON.stringify(nodeServiceDef)})
     .then(function(consulResponse){
                       if (consulResponse[1] !== 'true' ) {
                         console.log("Node has been registered in Consul: ip = " + ip + " , nodeName = " + nodeName);
                         return Q.resolve("Node has been registered in Consul"); 
                       }
                       else
                         return Q.reject(consulResponse[1] || 'empty consul response');
                      })
     .catch(function(error) {
              console.log("NODE REGISTER ERROR: " + error.toString() + " ip = " + ip + " , nodeName = " + nodeName + " Retry after 2s ...");
              return Q.delay(2000)
                      .then(function() { return registerService()});                    
           });
}

function putKv(k, v) {
      consul.kv.set({ key: k, value: v})
     
     .then(function(){ console.log(util.format("Consul kv.set SUCCESS: %s = %s ", k , v));
                       return Q.resolve("Consul kv.set SUCCESS");
                      })
     .catch(function(error) {
              console.log(util.format("Consul kv.set ERROR: %s : %s = %s ", error.toString(), k , v));
              return Q.resolve();
           }); 
}

module.exports.putKv = putKv;
module.exports.registerService = registerService;
