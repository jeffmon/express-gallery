const express = require("express");
const PORT = process.env.PORT || 3000;
const db = require("./models");
const Picture = db.Picture;
const User = db.User;
const app = express();
const bp = require("body-parser");
app.use(bp.urlencoded());
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const RedisStore = require("connect-redis")(session);
const CONFIG = require("./config/config.json");
const bcrypt = require("bcrypt");
const saltRounds = 10;

app.use(session({
  store: new RedisStore(),
  secret: CONFIG.SESSION_SECRET,
  cookie: {
    maxage: 600
  }
}));

app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride(function(req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use(express.static("public"));
app.use(session({
  secret: "keyboard cat"
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    // ^ client side username and password
    console.log("client-side-username", username);
    console.log("client-side-username", password);
    User.findOne({
        where: {
          username: username
        }
      })
      .then((user) => {
        bcrypt.compare(password, user.password)
          .then(result => {
            if(result) {
              return done(null, user);
            } else{
              return done(null, false, {
                message: "Incorrect Password"
              })
            }
          })
          .catch(err => {
            console.log(err);
          })
      })
      .catch((err) => {
        console.log("Username not found");
        console.log(err);
        console.log("Incorrect username");
        return done(null, false, {
          message: "Incorrect Username"
        })
      })
  }
))

passport.serializeUser(function(user, done) {
  //^ received from the LocalStrategy succession
  console.log("serializing the user into session");
  done(null, user.id);
  //^ building the object/values/information to store into the session object
});

passport.deserializeUser(function(userId, done) {
  console.log("adding user information into the req object", userId);
  User.findOne({
      where: {
        id: userId
      }
    })
    .then((user) => {
      done(null, {
        id: user.id,
        username: user.username
      });
      //^ store the serialized information into the request object
    })
    .catch((user, err) => {
      done(err, user);
    })
});


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


const loginCreate = (req) => {
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    User.findOrCreate({
      where: { username: req.body.username },
      defaults: { password: hash }
    })
      .spread((user, created) => {
        console.log(user.get({
          plain: true
        }))
        console.log(created);
      })
  })
}




app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

app.post("/login/new", (req, res) => {
  loginCreate(req, res);
  res.redirect("/");
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}), (req, res) => {
  res.redirect("/");
});

app.get("/login", (req, res) => {
  var errorMessage = null;
  res.render("partials/login", {
    error: errorMessage
  })
})

app.get("/", (req, res) => {
  Picture.findAll({
      order: [
        ["createdAt", "DESC"]
      ]
    })
    .then((picture) => {
      res.render("home", {
        pictures: picture,
        user: req.user
      })
    });
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.get("/gallery/new", (req, res) => {
  var errorMessage = null;
  res.render("partials/new", {
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
    })
});

app.post("/gallery", (req, res) => {
  galleryPost(req);
  res.redirect("/");
  res.end();
});

app.route("/gallery/:id")
  .put((req, res) => {
    Picture.update({
        link: req.body.link,
        Author: req.body.Author,
        description: req.body.description
      }, {
        where: {
          id: parseInt(req.params.id)
        }
      })
      .then((picture) => {
        console.log("Updated!");
      })
      .catch((err) => {
        console.log(err);
      })
    res.redirect(`/gallery/${parseInt(req.params.id)}/edit`);
    res.end();
  })
  .delete((req, res) => {
    Picture.destroy({
        where: {
          id: parseInt(req.params.id)
        }
      })
      .then((picture) => {
        console.log(`ID: ${req.params.id} is deleted!`);
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      })
  })

app.get("/gallery/:id/edit", (req, res) => {
  Picture.findById(parseInt(req.params.id))
    .then((picture) => {
      var pictureData;
      pictureData = {
        link: picture.dataValues.link,
        Author: picture.dataValues.Author,
        description: picture.dataValues.description,
        id: parseInt(picture.dataValues.id)
      };
      res.render("edit", pictureData)
    })
    .catch((err) => {
      console.log(err);
    })
})
