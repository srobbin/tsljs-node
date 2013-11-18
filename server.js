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
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs')
});

/* Site */
app.get('/:source.json', function (req, res) {
  res.render("json/" + req.params.source)
});

app.get('/:keyword?', function(req, res) {
  var title = req.params.keyword || "All";
  res.render('index', { title: title, keyword: title.toLowerCase() })
});
app.post('/:keyword?', function (req, res) {
  var body = req.body,
      keyword = req.params.keyword;

  if (keyword) {
    io.sockets.emit(keyword, body);
    body['keyword'] = keyword;
  }

  io.sockets.emit("all", body);
  res.end(JSON.stringify({
    status: 1,
    body: body
  }));
});

/* Socket */
io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

io.sockets.on('connection', function (socket) {
});

var port = process.env.PORT || 5000;
server.listen(port, function() {
  console.log("Listening on " + port);
});

