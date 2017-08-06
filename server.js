const express = require("express");
const PORT = process.env.PORT || 3000;
const db = require("./models");
const app = express();
const bp = require("body-parser");
app.use(bp.urlencoded());

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
