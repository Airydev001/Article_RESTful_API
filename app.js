const express=require('express');
const mongoose = require('mongoose');
const bodyParser=require('body-parser');
const ejs = require("ejs");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("Public"));
mongoose.connect ("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});

const articleSchema = {
    title:String,
    content:String
}

const Article = mongoose.model('Article',articleSchema);


//This is express routing chaining
app.route('/articles')
.get((req,res)=>{
    Article.find({},(err,foundIt)=>{
        if(!err){
            res.send(foundIt);
        } else {
            res.send(err);
        }
    });
})
.post((req,res)=>{
   
    const newArticle = new Article ({
     title:req.body.title,
     content:req.body.content
    })
    //We can pass callback function into save method that's is gpood to watch documentary
    newArticle.save((err)=>{
     if(!err){
         res.send("It's was sucessfully set up")
     } else{
         res.send(err)
     }    
    });
 })
.delete((req,res)=>{
    Article.deleteMany((err)=>{
        if(!err){
            res.send("Successfully deleted");
        } else {
            res.send(err);
        }
    });
});
////////////////////////////////////Request target a specific article ////////////////
app.route('/articles/:title')
.get((req,res)=>{
  Article.findOne({title:req.params.title},(err,foundArticle)=>{
    if(foundArticle){
        res.send(foundArticle);
    } else {
        res.send("No article matching that title was found")
    }
  })
})
.put((req,res)=>{
    Article.replaceOne(
        {title:req.params.title},
        {title:req.body.title,
         content:req.body.content
        },
       
        (err)=>{
        if(!err){
            res.send("Successfully Updated Article");
        }
    })
})
.patch((req,res)=>{
    Article.updateOne({title:req.params.title},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Sucessfully Updated Article")
            } else {
                res.send(err)
            }
        }
        )
})
.delete((req,res)=>{
    Article.deleteOne({title:req.params.title},(err)=>{
     if(!err){
        res.send("Sucessfully Deleted Article")
     } else{
        res.send(err)
     }
    })
});

/** *
app.get('/articles',(req,res)=>{
    Article.find({},(err,foundIt)=>{
        if(!err){
            res.send(foundIt);
        } else {
            res.send(err);
        }
    })
})


app.post('/articles',(req,res)=>{
   
   const newArticle = new Article ({
    title:req.body.title,
    content:req.body.content
   })
   //We can pass callback function into save method that's is gpood to watch documentary
   newArticle.save((err)=>{
    if(!err){
        res.send("It's was sucessfully set up")
    } else{
        res.send(err)
    }    
   });
})
//Delete pattern in our REST API

app.delete('/articles',(req,res)=>{
    Article.deleteMany((err)=>{
        if(!err){
            res.send("Successfully deleted");
        } else {
            res.send(err);
        }
    })
})*/
app.listen(3100,()=>{
    console.log("Server is up and running")
})