var http = require('http'),  
    io = require('socket.io'); // for npm, otherwise use require('./path/to/socket.io') 

server = http.createServer();
server.listen(1337, "127.0.0.1");

var socket = io.listen(server);
socket.on('connection', function(client){ 
  client.on('message', function(data){
    console.log('received:'+data);
    switch (data){
      case "get":
        switch (data.kind){
          case "project":
            console.log("received uid:"+data.uid);
            break;
            default: console.log('bad cmd:'+JSON.stringify(data));
        }
    }
  });
  client.on('disconnect', function(){ console.log('client disconnected.'); });
});


if (data.pile !== undefined) { 
  if (data.title !== undefined) { // renaming task
    redisClient.LSET();
  } else { // moving task
    redisClient.LREM();
    redisClient.LPUSH();
  }
} else {
  if (data.title !== undefined) { // renaming project or pile
    if (data.method == "create") {
      redisClient.LPUSH();
    }
    if (data.method == "update") {
      redisClient.LSET();
    }
    if (data.method == "delete") {
      var val = redisClient.LINDEX();
      redisClient.LSET();// into trash
    }
    
    
    
    
      // socket.emit('message');
      
      
    
  } else { // moving pile
    redisClient.LREM();
    redisClient.LPUSH();
  }
}