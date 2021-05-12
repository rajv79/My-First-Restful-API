
  //this is templete for all the app.js project when you have to setup a server

  const express = require("express");
  const bodyParser = require("body-parser");
  const ejs = require("ejs");
  const mongoose = require('mongoose');

  const app = express();
  //this line of code is use for ejs to use
  app.set('view engine','ejs');

//here we are using body parser to pass the request that was put in
  app.use(bodyParser.urlencoded({
    extended:true
  }));
  //this line will allow to add all css,images and jQuery stuff here to make the webiste good
  app.use(express.static("public"));

// In order to setup mongoose Db server and database we write this code with name of database
  mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});

//this line of code will help to set the schema of your model which gives what kind of data they will contain

const articleSchema = new mongoose.Schema({
  title:{
    type:String,
    required:[true ,"plese insert the name"]
  },

  content:{
    type:String,
    required:[true,"please insert the content"]
  }
});

  //this line of code means that you made model in mongoose with const Food
    const Article = mongoose.model("Article",articleSchema);



    app.get("/articles",function(req,res){
        //This method is to find the data from mongodb database
      Article.find(function(err,foundarticle){
        console.log(foundarticle);
        //this wll send the data to client
        res.send(foundarticle);
      })
    })

    //this is the post fucntion  code which will come from the form enter by the user

    app.post("/articles",function(req,res){
    console.log(  req.body.title);
    console.log(  req.body.content);

          //The line from 57-68 is code which will help to save data in database by haveing post request
          const newArticle = new Article({
            title:req.body.title,
            content:req.body.content
          });
          newArticle.save(function(err){
            if(!err){
              res.send("Succesfully added a new article");
            }else{
              res.send(err);
            }
          });


    });

    //this line of code is use to delete the article from the data base

    app.delete("/articles",function(req,res){

      //the below code is used to delete all elemet
      Article.deleteMany(function(err){
        if(!err){
          res.send("All articles are deleted");
        }else{
          res.send(err);
        }
      })

    })


    //another way to write all the app.get/post/delet/posy and Requests Targeting all articles

    app.route("/articles/:articleTitle")
    .get(function(req,res){
      //to get a specific data from the database
      Article.findOne({title:req.params.articleTitle},function(err,foundarticle){
        if(foundarticle){
          res.send(foundarticle)
        }else{
          res.send("No articles was found in the database")
        }
      });
    })

    //the put method is like a update method a data from database which means it will directly update everthing
    .put(function(req,res){
      Article.update(
        {title:req.params.articlesTitle},
        {title:req.body.title,content:req.body.content},
        function(err){
          if(!err){
            res.send("succesfully added the content of the article");

          }else{
            res.send(err);
          }
        }
      );

    })

    //this line of code is PATCH code which is used to update sepecific data in database

    .patch(function(req,res){
      Article.update(
        {title:req.params.articleTitle},
        {$set:req.body},
        function(err){
          if(!err){
            res.send("succesfully update article")
          }else{
            res.send("err");
          }
        }
      );
    });















//this line of code is writen to listen your server on the port 3000
app.listen(3000,function(){
  console.log("Server started on port 3000");
})
