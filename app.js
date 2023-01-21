const express = require("express");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/blogDB');
}

main().catch(err => console.log(err));

const postSchema = new mongoose.Schema({
	title: String,
  content: String
});

const Post = new mongoose.model("Post", postSchema);

app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    if(!err) {
      res.render("home", {
        posts: posts
      });
    }
  });
});

app.get("/about", function(req, res){
  res.render("about");
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });
 
  post.save(function(err) {
    if(!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post) {
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
