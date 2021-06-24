const server = require("./server");
const persist = require("./connect");
const portNumber = process.argv[2] || process.env.PORT || 8080;

persist.onConnect(()=>{
    server.listen(portNumber, ()=>{
    console.log(`Running Server on Port ${portNumber}`);
});

});
persist.connect();

