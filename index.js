require('dotenv').config()
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const route = require("./routes");

app.use(express.json());
app.use("/api/v1", route);

app.listen(port, () => console.log("App is running on port", port));
