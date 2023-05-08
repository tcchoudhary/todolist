const mongoose= require("mongoose");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(express.static('public'));
app.set(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/TodoDB").then(()=>{
    console.log("mongoose connected successfully")
}).catch((error)=>{
    console.log(error.message);
});


//schema point

const todoSchema = new mongoose.Schema({
    name:String,
});

const parentlistSchema = new mongoose.Schema({
    name:String,
    items: [todo],
});


const PList = mongoose.model("parentlist", parentlistSchema);

const todo =new mongoose.model("todolist",todoSchema );


       const data1 = new todo({
            name:"Your new list is ready",
        });
       const data2 = new todo({
            name:"Fill input box and add to list to save your work item",
        });


     

const alldata=[data1,data2];





app.get('/', (req,res)=>{
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let today  = new Date();
     let day = today.toLocaleDateString("hi-IN", options);
    //  console.log(today);

    
    todo.find({},(err,l)=>{
        if (l.length===0) {
            todo.insertMany(alldata,(err)=>{
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Successfully saved items to DB");
                }
            });
            res.redirect('/')
        }else{
            res.render('home', {kindofday:"mainlist", add_item:l});
        }
      })
})



app.get('/:userlist', (req,res)=>{
    const userlist = req.params.userlist;

    PList.find({name:userlist}, (err,found)=>{
        if(!err){
            if(!found){
             const parentlist = new PList({
                name:userlist,
                items:alldata,
             });
             parentlist.save();
             res.redirect('/'+userlist)
            }else{
                res.render('home', {kindofday:found.name, add_item:found.items});

            }
        }
    })
})





app.post('/', (req,res)=>{
 let newlist =req.body.list;
 const tod = new todo({
    name:newlist,
});
tod.save();
res.redirect("/");
});




app.post("/delete",(req,res)=>{
  const check=req.body.checkbox;
  todo.findByIdAndRemove(check,(err)=>{
      if(!err)
      {
          console.log("Successfully deleted");
          res.redirect("/");
      }
  })
});

app.listen(80, ()=>{
    console.log("server is successfully connected");
});


