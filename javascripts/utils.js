var socket;

function getURLParameter(name){
  return unescape((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]);
}

function generateUid(){
	return (((1+Math.random())*0x1000000)|0).toString(16)+(((1+Math.random())*0x1000000)|0).toString(16);
}

function setUid(){
	url_uid = getURLParameter("uid");
	if (url_uid == 'null') {
		url_uid = generateUid();
	}
}

function request(action, kind, uid){
	return '{"action":"'+action+'", "kind":"'+kind+'", "uid":"'+uid+'"}';
}

function sendToServer(str){
  if socket == null{
	  socket = new io.Socket('127.0.0.1', {port: 1337});
  }
  socket.send(str);
}

socket.on('connect', function(){
	
});

socket.on('disconnect', function(){
  alert('disconnect');
  socket.connect();// tries to reconnect
});
