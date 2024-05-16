import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const filePathDB = 'blogpostdb.json';


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  fs.readFile(filePathDB, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const blogpostdb = JSON.parse(data);
    res.render("index.ejs", blogpostdb);
  });

});

app.get("/edit", (req, res) => {
  res.render("edit.ejs")
});

app.post("/edit", (req, res) => {
  fs.readFile(filePathDB, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const jsonObject = JSON.parse(data);
    const newData = { "title": req.body.title, "body": req.body.body, "img": req.body.img_url };
    jsonObject["blog"].push(newData);
    const jsonString = JSON.stringify(jsonObject, null, 2);
    fs.writeFile(filePathDB, jsonString, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('JSON appended successfully!');
      }
    });
  });
  res.redirect("/")
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.get("/post",(req,res)=>{
  fs.readFile(filePathDB, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const blogpostdb = JSON.parse(data);
    data = blogpostdb["blog"][req.query.index];
    data.index= req.query.index;
    res.render("post.ejs", data);
  });
});


app.get("/editpost", (req, res) => {
  fs.readFile(filePathDB, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const blogpostdb = JSON.parse(data);
    data = blogpostdb["blog"][req.query.index];
    data.index= req.query.index;
    res.render("editpost.ejs", data);
  });
});

app.post("/editpost",(req,res)=>{
  const formData = { "title": req.body.title, "body": req.body.body, "img": req.body.img_url };

  fs.readFile(filePathDB, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const jsonObject = JSON.parse(data);
    jsonObject["blog"][req.query.index]= formData; 
    const jsonString = JSON.stringify(jsonObject, null, 2);
    fs.writeFile(filePathDB, jsonString, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('JSON appended successfully!');
      }
    });
  });
  res.redirect("/")
});

app.get("/delete/:index",(req,res)=>{
  fs.readFile(filePathDB, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const jsonObject = JSON.parse(data);
    jsonObject["blog"].splice(req.params.index,1);
    console.log(jsonObject);
    const jsonString = JSON.stringify(jsonObject, null, 2);
    fs.writeFile(filePathDB, jsonString, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('JSON appended successfully!');
      }
    });
  });
  res.redirect("/")
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
