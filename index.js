var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var router = express.Router();

router.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

router.use('/bower_components',  express.static(__dirname + '/bower_components'));
//router.use(express.static(__dirname + '/'));
router.use(express.static(__dirname + '/public'));

names = {};

io.on('connection', function(socket){
  console.log('a user connected');
  console.log(socket.id);

  socket.on("set name", function(name) {
    console.log("Name: " + name);
    names[socket.id] = name;
    io.emit('connections', Object.keys(names).map(function (key) {return names[key]}));
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message', {from: name, txt: msg});
    });
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
    delete names[socket.id];
    io.emit('connections', Object.keys(names).map(function (key) {return names[key]}));
  });
});

app.use('/', router);

http.listen(3000, function(){
  console.log('listening on *:3000');
});