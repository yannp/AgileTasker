var io = require('socket.io').listen(1337);
var redis = require("redis"),
    redisClient = redis.createClient();

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
  //console.trace();
});

// TODO: switch to MONGO DB
// Storage nomenclature:
// ID:full -> String (full project in JSON)
// ID:title -> String (project title)
// ID:piles -> List (of pile_id)
// ID:pile:ID:title -> String (pile title)
// ID:pile:ID:tasks -> List (of task_id)
// ID:pile:ID:task:ID:title -> String (task title), may add later: created_at, trashed_at

var clientSockets = new Array;
var revClientSockets = new Array;
io.sockets.on('connection', function (socket) {
  socket.on('message', function (data) {
    // DELETE PROJECT
    // CREATE PILE "rId: 1, pId: 158b2421c0e2e2, title: "toto"[, pile: 42]
    // MOVE PILE "rId: 1, pId: 158b2421c0e2e2, old: 2, new :4[, pile: 42]
    // DELETE PILE
    // CREATE TASK
    // MOVE TASK
    // RENAME TASK
    // DELETE TASK
    var obj = JSON.parse(data);
    console.log("received json="+data)
    registerClient(socket, obj.p);
    switch (obj.x) {
    case '1': // GET PROJECT
      //redisClient.GET(obj.p+':full', function (err, reply) {
        respondClient(socket, obj.r, null);
        //if (err == null) {
          socket.send('{"x":"'+obj.x+'","p":"'+obj.p+'","t":"Place holder project", "piles":[{"id":"23aef45b", "t":"First pile", "tasks":[{"id":"56bcf67c", "t":"Here is a first task", "c":"01-01-2011"}, \
                      {"id":"32423cbd", "t":"Here is a second task", "c":"02-02-2011"}, \
                      {"id":"985bca34", "t":"Here is a third task", "c":"03-03-2011"}]\
                      }, \
                      {"id":"442ddfe", "t":"Second pile", "tasks":[{"id":"456bbe", "t":"Simply put, you can use backslash character to ignore end of line in JavaScript strings.", "c":"01-01-2011"}, \
                      {"id":"3453454", "t":"backslash escape cannot be used before a line break to continue a string.", "c":"02-02-2011"}, \
                      {"id":"9088df", "t":"I am so proud to have found an error in that book", "c":"03-03-2011"}]\
                    }], \
          "trash": {"id":"78aef12a", "tasks": [{"id":"56bcf67c", "t":"deleted task1", "c":"01-01-2011", "done":"06-06-2011"}, \
                     {"id":"32423cbd", "t":"deleted task2", "c":"02-02-2011", "done":"06-06-2011"}, \
                     {"id":"985bca34", "t":"deleted task3", "c":"03-03-2011", "del":"06-06-2011"}]\
                    }\
                      }');
        //}
      //});
      break;
    case '2': // RENAME PROJECT (+CREATE PROJECT) (=RENAME PILE)
      redisClient.SET(obj.p+':title', obj.t); // TODO voir comment réagit cette fonction lorsque redis est injoignable
      respondClient(socket, obj.r, null);
      delete obj.r;
      broadcastMessage(clientSockets[obj.p], JSON.stringify(obj));
      break;
    default:
      console.log("Unknown command:"+obj.x);
    }
    
  });
  
  socket.on('disconnect', function (socket) {
    unregisterClient(socket);
  });
});

function registerClient(socket, projectId){
  if (clientSockets[projectId] === undefined) {
    clientSockets[projectId] = new Array;
  }
  var i = clientSockets[projectId].indexOf(socket);
  if (i == -1) { // if it's not in clientSockets it can't be in revClientSockets either
    clientSockets[projectId][clientSockets.length] = socket;
    revClientSockets['a'+socket] = projectId; // we force the socket to be a string with +'a'
  }
}

function unregisterClient(socket){
  var s = 'a'+socket; // we force the socket to be a string with +'a'
  if (revClientSockets[s] === undefined) {
    return; // it happens when a client connects, doesn't send requests, then disconnect
  }
  var projectId = revClientSockets[s];
  delete revClientSockets[s];
  var i = clientSockets[projectId].indexOf(socket);
  clientSockets[projectId].splice(i, 1);
}

function respondClient(socket, rId, redisError){
  var status = '"s":"ok"';
  if (redisError != null) {
    status = '"s":"ko"';
  }
  socket.send('{"r":"'+rId+'",'+status+'}');
}

function broadcastMessage(sockets, query){
  var i = sockets.length;
  while (i--) {
    sockets[i].send(query);
  }
}
