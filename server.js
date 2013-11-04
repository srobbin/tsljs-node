var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

//CORS middleware
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
}
 
app.configure(function () {
  app.use(allowCrossDomain);
  app.use(express.bodyParser());
});

/* Site */
app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});
app.post('/', function (req, res) {
  io.sockets.emit('message', { message: req.body.message });
  res.end(req.body.message);
});

/* Socket */
io.sockets.on('connection', function (socket) {
});

var port = process.env.PORT || 5000;
server.listen(port, function() {
  console.log("Listening on " + port);
});

