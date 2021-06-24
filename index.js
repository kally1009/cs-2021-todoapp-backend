const server = require("./server");
const persist = require("./connect");
const portNumber = process.argv[2] || 8080;

persist.onConnect(()=>{
    server.listen(portNumber, ()=>{
    console.log(`Running Server on Port ${portNumber}`);
});

});
persist.connect();

