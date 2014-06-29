//Setup web server and socket
var twitter = require('twitter'),
    express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

//Setup twitter stream api
var twit = new twitter({
  consumer_key: 'JceXz7EqUnhfYmQWcTdssZ1Pw',
  consumer_secret: 'Uu8op6TFBAg7Lv0gDEcMn4K6wqgzg4Y4fZhPdUePE9oVRPkViM',
  access_token_key: '21738909-XguXAbLLMARsiBFaDR3DmJNNMfX2BwJ8DSbGCL1aG',
  access_token_secret: 'OrlJfOiEAIQrLraXbLvcpf2eq2LMaz0exTdheEVl7eDY4'
}),
stream = null;

//Use the default port (for beanstalk) or default to 8081 locally
server.listen(process.env.PORT || 8081);

//Setup rotuing for app
app.use(express.static(__dirname + '/public'));

//Create web sockets connection.
io.sockets.on('connection', function (socket) {

  socket.on("start tweets", function() {

    if(stream === null) {
      //Connect to twitter stream passing in filter for entire world.

//twit.stream('statuses/filter', { track: ['food','poisoning'] }, 
//	function(stream) { stream.on('data', 
//		function (data) { console.log(data.text); }); });

      twit.stream('statuses/filter', {
//location of the world
		'locations':'-180,-90,180,90'
//location of the usa
//		'locations':'-124.848974, 24.39630,-66.885444, 49.384358'
		}, function(stream) {
          stream.on('data', function(data) {
              // Does the JSON result have coordinates

var s1 = "food poisoning";
var s2 = "ecoli";
var s3 = "salmonella";
var s4 = "ate something bad";
var s5 = "stomach";
var s6 = "belly hurts";
var s7 = "foodtech";
var s8 = "bad food";
var s9 = "restaurant inspection";
var s10 = "food safety";
var s11 = "inspection grade";
var s12 = "unsafe food";
if (data.text) {
	if ((data.text.indexOf(s1) > -1) || 
	(data.text.indexOf(s2) > -1) || 
	(data.text.indexOf(s3) > -1) ||  
	(data.text.indexOf(s4) > -1) ||  
	(data.text.indexOf(s5) > -1) ||
	(data.text.indexOf(s6) > -1) ||  
	(data.text.indexOf(s7) > -1) ||  
	(data.text.indexOf(s8) > -1) ||  
	(data.text.indexOf(s9) > -1) ||  
	(data.text.indexOf(s10) > -1) ||  
	(data.text.indexOf(s11) > -1) ||  
	(data.text.indexOf(s12) > -1)) {

              if (data.coordinates){
                if (data.coordinates !== null){


	console.log(data.coordinates.coordinates[0] + ',' +data.coordinates.coordinates[1]+ ' ' + data.text );


                  //If so then build up some nice json and send out to web sockets
                  var outputPoint = {"lat": data.coordinates.coordinates[0],"lng": data.coordinates.coordinates[1]};

                  socket.broadcast.emit("twitter-stream", outputPoint);

                  //Send out to web sockets channel.
                  socket.emit('twitter-stream', outputPoint);
                }
                else if(data.place){
                  if(data.place.bounding_box === 'Polygon'){
                    // Calculate the center of the bounding box for the tweet
                    var coord, _i, _len;
                    var centerLat = 0;
                    var centerLng = 0;

                    for (_i = 0, _len = coords.length; _i < _len; _i++) {
                      coord = coords[_i];
                      centerLat += coord[0];
                      centerLng += coord[1];
                    }
                    centerLat = centerLat / coords.length;
                    centerLng = centerLng / coords.length;

                    // Build json object and broadcast it
                    var outputPoint = {"lat": centerLat,"lng": centerLng};
                    socket.broadcast.emit("twitter-stream", outputPoint);
                  }
                }
              }
	}
}

              stream.on('limit', function(limitMessage) {
                return console.log(limitMessage);
              });

              stream.on('warning', function(warning) {
                return console.log(warning);
              });

              stream.on('disconnect', function(disconnectMessage) {
                return console.log(disconnectMessage);
              });
          });
      });
    }
  });

    // Emits signal to the client telling them that the
    // they are connected and can start receiving Tweets
    socket.emit("connected");
});

