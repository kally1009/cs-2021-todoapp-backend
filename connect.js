const mongoose = require("mongoose");
const db = mongoose.connection;

function connect() {
    let connectionString = "mongodb+srv://todo_2021:T0d0App@cluster0.5j58h.mongodb.net/todo_2021?retryWrites=true&w=majority";
    console.log("Connect to db.....");
    mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .catch((err) => {
        console.log("There was an error connecting to mongo", err);
    });
    }

function onConnect(callback){
    db.once("open", callback);
}

module.exports = {
    connect,
    onConnect,
};
    