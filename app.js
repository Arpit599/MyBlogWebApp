var bodyParser=require("body-parser"),
expressSanitizer=require("express-sanitizer"),
mongoose=require("mongoose"),
methodOverride=require("method-override"),
express=require("express"),
app=express();

//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//MONGOOSE/MODEL CONFIG
var blogSchema=new mongoose.Schema({
  title:String,
  image:String,
  body:String,
  created:{type:Date, default:Date.now}
});

var Blog=mongoose.model("Blog", blogSchema);
//
// Blog.create({
//   title:"Test blog",
//   image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQXNVjcbInae030KAgwdSlOBx7ZupPOJcY9nJjfQGsEHHSP-0e7",
//   body:"This is my dream and i will make it true one day for sure!"
// });

//RESTFUL ROUTES
app.get("/",function(req,res){
  res.redirect("/blogs");
});

//TO show every blogs posted
app.get("/blogs",function(req,res){
  Blog.find({},function(err,blogs){
    if(err)
    console.log("Oops aapke lag gaye");
    else {
      res.render("index",{blogs:  blogs});
    }
  });
});

//TO render the new blog page
app.get("/blogs/new",function(req,res){
  res.render("new");
});

//CREATE ROUTE
app.post("/blogs",function(req,res){
  req.body.blog.body=req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog,function(err,newBlog){
      if(err)
      console.log(err);
      else
      res.redirect("/blogs");
    });
  });

  //Route to show more about Post
  app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
      if(err)
      res.redirect("/blogs");
      else
      res.render("show",{blog:foundBlog});
    });
  });

//EDIT ROUTE
  app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
      if(err)
      res.redirect("/blogs");
      else
      res.render("edit",{blog:foundBlog});
    });
  });

  //UPDATE ROUTE
  app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,UpdatedBlog){
      if(err)
      res.redirect("/blogs");
      else
      res.redirect("/blogs/"+req.params.id);
    });
  });

//DELETE Route
app.delete("/blogs/:id",function(req,res){
  Blog.findByIdAndRemove(req.params.id,function(err){
    if(err)
    res.redirect("/blogs");
    else
    res.redirect("/blogs");
  });
});

//This is server
  app.listen(12345,function(){
    console.log("Server is running");
  });
