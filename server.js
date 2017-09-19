var express = require('express');
var app = express();
var fs = require('fs');

var server = app.listen(9000, function () {

   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})

var io = require('socket.io').listen(server);

app.use(express.static('public'));

var items = [];
var deleted_items = [];

//GET request for homepage
app.get('/', function (req, res) {
   console.log("Got a GET request for the homepage");
   res.sendFile(__dirname + '/index.html');
})

io.sockets.on('connection', function(socket) {

  fs.readFile('/Users/paula/whytodo/test', "utf8" , (err, data) => {
    if (err) {
      throw err;
    }
    console.log(data);
    if (data != "") {
      items = data.split(",");
    }
    console.log("readfile data" , items)
  });
  
  socket.emit('list_todo_items', items );

  socket.on('add_item', function(data) {

    console.log("socket.io add_item" , data)

    items.push(data);

    console.log("items: " , items)

    fs.writeFile("/Users/paula/whytodo/test", items, function(err) {
      if(err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    }); 

    //socket.emit('list_todo_items', data );
  })

  socket.on('delete_item', function(data) {
    items.splice(items.indexOf(data),1);
    fs.writeFile("/Users/paula/whytodo/test", items, function(err) {
      if(err) {
        return console.log(err);
      }
    });

    deleted_items.push(data);

    fs.writeFile("/Users/paula/whytodo/deleted_items", deleted_items, function(err) {
      if(err) {
        return console.log(err);
      }
      console.log("The file deleted_items was saved!");
    }); 

    console.log("deleted item: " , data)
    console.log("items after delete: " , items)
    console.log("deleted items: " , deleted_items)
  })

  socket.on('edit_item' , function(data1, data2) {
    var i = items.indexOf(data1);
    items.splice(i,1);
    items.splice(i,0,data2);
    fs.writeFile("/Users/paula/whytodo/test", items, function(err) {
      if(err) {
        return console.log(err);
      }
    });
    console.log("edited item: " , (data1 + " -> " + data2))
    console.log("items after edit: " , items)
  })


/*
  socket.on('disconnect', function() {
    
    ---tähän enkä jotain--- 

    var channel = socket.channel;
    socket.leave(socket.channel);
    //delete nicknames[socket.nickname];

    var index = 0;
    for(i = 0; i < channels.length; i++) {
      if(channels[i].name == channel) {
        for(j = 0; j < channels[i].users.length; j++) {
          if (channels[i].users[j] == socket.nickname)
            channels[i].users.splice(j,1);
        }
        index = i;
      }
    }
    io.sockets.in(channel).emit('userlist', channels[index].users);
    io.sockets.in(channel).emit('leave_msg_chat', socket.nickname);
  })
*/
})