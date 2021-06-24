const express = require('express');
const { Model } = require('mongoose');
const {store, Todo} = require("./model");
const app = express();
const cors = require('cors');

const fs = require('fs')



app.use(cors());

app.use(express.static('static'));

app.use(express.json({}));

app.use((req, res, next)=>{
    console.log("Time:", Date.now(),
     " - Method:", req.method, 
     "-Path", req.originalUrl,
      "-Body: ", req.body);
    next();
})

app.get('/todo',(req, res)=>{
    res.setHeader("Content-Type","application/json");
    let findQuery = {}
    if (req.query.name !== null && req.query.name !== undefined){
        findQuery.name = req.query.name;
    }
    
    console.log("Getting todos");
    Todo.find(findQuery, function(err,todos) {
        if(err){
            console.log(`there was an error listing todos`,err);
            res.status(500).json({
                message: `unable to list todos`, error: err 
            });
            return;
        }
        res.status(200).json(todos);
    });
});

app.get('/todo/download',(req, res)=>{
    res.setHeader("Content-Type","application/json");
    let findQuery = {}
    if (req.query.name !== null && req.query.name !== undefined){
        findQuery.name = req.query.name;
    }
    
    console.log("Getting todos");
    Todo.find(findQuery, function(err,todos) {
        if(err){
            console.log(`there was an error listing todos`,err);
            res.status(500).json({
                message: `unable to list todos`, error: err 
            });
            return;
        }
        
        const content = JSON.stringify(todos);
        fs.writeFile('todos.txt', content, err => {
            if (err) {
              console.error(err)
              return
            }
            res.download('todos.txt');
          })
    });
});

app.get('/todo/:id',(req, res)=>{
    res.setHeader("Content-Type","application/json");
    console.log("Getting todo with id:", req.params.id);
    Todo.findById(req.params.id,(err, todo)=>{
        if(err){
            console.log(`there was an error finding a todo with id ${req.params.id}`, err
            );
            res.status(500).send(
                JSON.stringify({
                message: `unable to find todo with id ${req.params.id}`,
                error: err,
            }));
            return;
        } else if(todo===null){
            res.status(404).send(JSON.stringify({
                error: "Unable to find todo",
            }))
            return;
        }
    res.status(200).json(todo);
    });
});
let nextID = 0;

app.post('/todo',(req,res)=>{
    res.setHeader("Content-Type","application/json");
    console.log("To do created with body:",req.body);
    creatingTodo = {
        name: req.body.name || "Todo"+" "+(nextID++),
        description:req.body.description || "NA",
        done: req.body.done || false,
        deadline:req.body.deadline || new Date(),
    };
    Todo.create(creatingTodo,(err,todo) => {
        if (err){
            console.log(`unable to create todo`)
            res.status(500).json({
                message: "Unable to create todo",
                error: err,
            });
            return;
        }
        res.status(201).json(todo)
    });
});

app.delete('/todo/:id',(req,res)=>{
    res.setHeader("Content-Type","application/json");
    console.log("Deleted Something");
    Todo.findByIdAndDelete(req.params.id, function(err,todo){
        if(err){
            console.log(`Could not find and delete ${req.params.id}`, err
            );
            res.status(500).send(
                JSON.stringify({
                message: `unable to find todo with id ${req.params.id}`,
                error: err,
            }));
                return;
        }else if(todo===null){
            console.log("Could not Find todo to delete");
            res.status(404).send(JSON.stringify({
                error: "Unable to find todo",
            }))
            return;
        }
    res.status(200).json(delete Todo);
});
});

app.patch('/todo/:id', function (req,res){
    res.setHeader("Content-Type","application/json");
    console.log("Updated", req.params.id , "with body", req.body);
    //similar to create
    let updateTodo = {};
    if(req.body.name !== null && req.body.name !== undefined){
        updateTodo.name = req.body.name;
   }
   if(req.body.description !==null && req.body.description !==undefined){
       updateTodo.description = req.body.description;
   }
   if(req.body.done !==null && req.body.done !==undefined){
       updateTodo.done = req.body.done;
   }
   if(req.body.deadline !==null && req.body.deadline !== undefined){
       updateTodo.deadline = req.body.deadline;
   }
   console.log(updateTodo);
   Todo.updateOne({_id: req.params.id}, {$set: updateTodo}, function(err, updateOneResponse){
        //what do you do once it's done?
        if(err){
            console.log(`Could not find and update ${req.params.id}`, err
            );
            res.status(500).send(JSON.stringify({
                message: `unable to find todo with id ${req.params.id}`,
                error: err,
                }))
            return;
        }
                else if(updateOneResponse.n===0){
                    res.status(404).send(JSON.stringify({
                    error: "Unable to update",
           }))
                return;
    };
    res.status(200).json(updateOneResponse);
    //findByIdAndUpdate you could use...
});
});

app.put('/todo/:id',(req,res)=>{
    res.setHeader("Content-Type","application/json");
    console.log("Replacing", req.params.id ,"with body", req.body);
    let updateTodo = {
        name: req.body.name || "",
        description:req.body.description || "",
        done: req.body.done || false,
        deadline:req.body.deadline || new Date(),
    }
    Todo.updateOne(
        {_id: req.params.id},
        {$set:updateTodo},
        function(err,updateOneResponse){
            if(err){
                console.log("Could not update todo");
                res.status(500).send(JSON.stringify({
                    message: `unable to find todo with id ${req.params.id}`,
                    error: err,
                }))
                    return;
                }
                else if(updateOneResponse.n===0){
                    res.status(404).send(JSON.stringify({
                        error: "Unable to Update entire Todo",
               }))
                    return;
                }
               res.status(200).json(updateOneResponse);
                
            }
        
    )
});







module.exports = app;