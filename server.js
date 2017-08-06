const express = require("express");
const PORT = process.env.PORT || 3000;
const db = require("./models");
const Picture = db.Picture;
const app = express();
const bp = require("body-parser");
app.use(bp.urlencoded());
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");

app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride(function(req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: ".hbs"
});

const server = app.listen(PORT, () => {
  db.sequelize.sync();
  console.log(`Server running on port ${PORT}`);
});

const galleryPost = (req) => {
  Picture.create({
      Author: req.body.Author,
      link: req.body.link,
      description: req.body.description
    })
    .then((data) => {
      console.log("Posted!");
    })
    .catch((err) => {
      console.log(err);
    })
}

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

app.get("/", (req, res) => {
  Picture.findAll()
    .then((picture) => {
      res.render("home", {
        pictures: picture
      })
    });
});

app.get("/gallery/new", (req, res) => {
  var errorMessage = null;
  res.render("new", {
    error: errorMessage
  })
})

app.get("/gallery/:id", (req, res) => {
  var pictureData;
  Picture.findAll({
      where: {
        id: req.params.id
      }
    })
    .then((picture) => {
      pictureData = {
        link: picture[0].link,
        Author: picture[0].Author,
        description: picture[0].description
      };
      res.render("picture", pictureData);
      console.log(`Getting ID: ${req.params.id}`);
    })
});

app.post("/gallery", (req, res) => {
  galleryPost(req);
  res.redirect("/");
  res.end();
});

app.delete("/gallery/:id", (req, res) => {
  Picture.destroy({
    where: {
      id: parseInt(req.params.id)
    }
  })
  .then((picture) => {
    console.log(`ID: ${req.params.id} is deleted!`);
  })
  .catch((err) => {
    console.log(err);
  })
  res.end();
})
