var express = require('express');
// var bodyParser = require('body-parser');

var consulLib = require('./consulLib.js');

var app = express();
var router  = express.Router();


//app.use(bodyParser.json());
app.use('/', router);

function getHtContent() {
  
  var isoDate = new Date().toISOString().replace(/T|Z/g, " ");
  consulLib.putKv('lastRequestDate', isoDate);
  return isoDate;
}

consulLib.registerService();

router.get('/', function(req, res) {
  
  var htHeader = '<HTML>' + 
                   '<HEAD><STYLE> ' +
                       'body{ background-color: lightblue; padding-top: 150px; text-align: center; font: 50px monospace; }' +
                   '</STYLE></HEAD>' + 
                   '<BODY>';   
  var htContent = getHtContent(); 
  var htFooter = '</BODY></HTML>';
  
  res.send( htHeader + 
                '<div>' + htContent +  ' on server</div>' +
                '<div><script>document.write(new Date().toISOString().replace(/T|Z/g, " ") + " on client");</script></div>' +
            htFooter).end();
});

router.get('/plain', function(req, res) {
   res.send( getHtContent() ).end();
});

app.listen(3000);

