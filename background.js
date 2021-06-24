//import your Todo model here
const model = require("./model");

let counter = 0;
function myCountingProcess(){
    console.log(`ran ${counter} times`);
    counter++
}

function myCleanUpProcess() {
    console.log("run clean up")
    let date = new Date();
    date.setDate(date.getDate()-1);
    console.log("deleting any todos before", date);
    model.Todo.deleteMany(
        { done: true, deadline : {$gt : date} },
        (err, deleteResult)=> {
            console.log(`deleted ${deleteResult.deletedCount} todos`)
        }
    )
}

    //use your todo model here


module.exports = {
    myCountingProcess,
    myCleanUpProcess,
};