const server = require("./server");
const persist = require("./connect");
const background=require("./background")
const portNumber = process.argv[2] || process.env.PORT || 8080;

persist.onConnect(()=>{
    server.listen(portNumber, ()=>{
    console.log(`Running Server on Port ${portNumber}`);
});

});
persist.connect();

//start our background process

setInterval(()=>{
    background.myCountingProcess();
}, 10000);



setInterval(()=>{
    background.myCleanUpProcess();
}, 10000);


