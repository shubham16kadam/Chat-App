var app = require('express')();
var http = require('http');
var io = require('socket.io').listen(app.listen(8080));
var id = 0;
var client = [];
var unique = require('array-unique');
app.get('/', function(req, res){
	res.sendFile(__dirname + '/login.html');
});

app.get('/index.html/:id', function(req, res){
	res.sendFile(__dirname + '/index.html');
	id = req.params.id
});

io.on('connection', function(socket){
	var set;
	if(id != 0){
		client.push(id);
		unique(client);
		console.log(client);
		socket.join(id);
		io.emit("broadcast", client);
	}

	socket.on('disconnect', () => {
		client = client.filter(u  => u !== id);
		console.log('disconnected : ' + id);
		io.emit("broadcast", client);
		console.log(client);
	});

	socket.on('chat', function(msg, toWhom, from){		
		console.log('msg : ' + msg + ' from ' + from + ' to ' + toWhom);
		var data = from + " : " + msg
		io.sockets.in(toWhom).emit(2, data, from);
	});
	
});
