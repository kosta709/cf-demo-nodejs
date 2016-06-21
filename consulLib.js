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
                               url:    util.format('http://%s:38500/v1/catalog/register', consulAddr),
                              body:    JSON.stringify(nodeServiceDef)})
     
     .then(function(){ var defer = Q.defer(); 
                       defer.resolve("Node has been registered in Consul");
                       return Q.defer().promise;
                      })
     .catch(function(error) {
              console.log("NODE REGISTER ERROR: " + error.toString());
           })
     .done(function(){console.log("Completed register-node: ip = " + ip + " , nodeName = " + nodeName);});       
}

function putKv(k, v) {
      consul.kv.set({ key: k, value: v})
     
     .then(function(){ var defer = Q.defer(); 
                       console.log(util.format("Consul kv.set: %s = %s ", k , v));
                       return Q.resolve("Consul kv.set SUCCESS");

                      })
     .catch(function(error) {
              console.log("Consul kv.set ERROR: " + error.toString());
           })
     .done(function(){console.log("Completed Consul kv.set: k = " + k + " , nodeName = " + v);});   
  
}

module.exports.putKv = putKv;
module.exports.registerService = registerService;
