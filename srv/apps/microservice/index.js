var simplebus = require('simplebus');
var bus = simplebus.createClient(3001);
var RedisSMQ = require("rsmq");
q = new RedisSMQ( {host: "127.0.0.1", port: 6379, ns: "rsmq"} );
console.log("connected to queue")

bus.start(function(){

  console.log("connected to bus")

  bus.subscribe({event:"myevent"}, function(data) {
    console.dir(data);
  });

  bus.post({ event: "myevent", data:new Date() });

})

q.createQueue({qname:"myqueue"}, function (err, resp) {
  if (resp===1) {
      console.log("queue created")
   }
})

q.sendMessage({qname:"myqueue", message:"Hello World"}, function (err, resp) {
    if (resp) {
        console.log("Message sent. ID:", resp);
    }
})


q.receiveMessage({qname:"myqueue"}, function (err, resp) {
    if (resp.id != undefined) {
        console.log("Message received.", resp)  
    }
    else {
        console.log("No messages for me...")
    }
})

