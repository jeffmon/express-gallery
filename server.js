const express = require("express");
const PORT = process.env.PORT || 3000;
const db = require("./models");
const Picture = db.Picture;
const app = express();
const bp = require("body-parser");
app.use(bp.urlencoded());
const exphbs = require("express-handlebars");

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



app.get("/gallery/:id", (req, res) => {
  var pictureLink;
  var pictureAuthor;
  var pictureDesc;
  var pictureData;
  Picture.findAll({
      where: {
        id: req.params.id
      }
    })
    .then((picture) => {
      pictureLink = picture[0].link;
      pictureAuthor = picture[0].Author;
      pictureDesc = picture[0].description;
      pictureData = {
        link: pictureLink,
        Author: pictureAuthor,
        description: pictureDesc
      };
      res.render("picture", pictureData);
      console.log(`Getting ID: ${req.params.id}`);
    })
});

app.post("/gallery", (req, res) => {
  galleryPost(req);
  res.end();
});
