var socket = require('socket.io');

var io = socket.listen(1923);

var users = [];
var messages = [];

var names = [];

io.on('connection', function(client){


    client.on('join', function(name){

        client.join('chat');

        users.push(name);
        names[client.id] = name;

        client.emit('users', users);
        client.emit('messages', messages);
        client.emit('joined', true);
        client.broadcast.emit('adduser', name);
    });


    client.on('send', function(message){

        var data = {
            name: names[client.id],
            message: message
        };

        if(messages.length > 10){
            messages.splice(0, 10);
        }

        messages.push(data);

        io.emit('onmessage', data);

    });


    client.on('disconnect', function(){

        var name = names[client.id];


        delete names[client.id];

        var index = users.indexOf(name);

        if(index!=-1){
            delete users[index];
        }
		users = users.filter(Boolean)

        io.emit('users', users);

    });


});
