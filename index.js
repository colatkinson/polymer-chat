var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
/*var a = moment().utc();
var b = moment().utc(a);
//console.log(a, b.format("h:m A [on] MMM Do"));
console.log(a.format("h:m A [on] MMM Do"));
console.log(b.format("h:m A [on] MMM Do"));*/

var port = (process.env.PORT || 3000);

var router = express.Router();

router.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
  //res.sendFile(__dirname + '/build.html');
});

router.use('/bower_components',  express.static(__dirname + '/bower_components'));
//router.use(express.static(__dirname + '/'));
router.use(express.static(__dirname + '/public'));

names = {};

io.on('connection', function(socket){
  console.log('a user connected');
  //console.log(Object.keys(names).length + " online");

  socket.on("set name", function(name) {
    console.log("Name: " + name);
    names[socket.id] = name;
    console.log(Object.keys(names).length + " online");
    io.emit('connections', Object.keys(names).map(function (key) {return names[key]}));
    socket.on('chat message', function(msg){
        //console.log('message: ' + msg);
        //console.log(this.id);
        io.emit('chat message', {from: name, from_id: this.id, txt: msg, time: moment.utc()});
        //console.log(moment.utc());
    });
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
    delete names[socket.id];
    console.log(Object.keys(names).length + " online");
    io.emit('connections', Object.keys(names).map(function (key) {return names[key]}));
  });
});

app.use('/', router);

http.listen(port, function(){
  console.log('listening on *:'+port);
});
