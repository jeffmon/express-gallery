const MongoClient = require("mongodb").MongoClient
const mongoURL = "mongodb://localhost:27017/photoMeta";
var photoMeta;

MongoClient.connect(mongoURL, (err, db) => {
  console.log("Connected correctly to server");
  photoMeta = db.collection("photoMeta");
});

module.exports = {
  photoMeta: () => photoMeta
}
