require('dotenv').config()
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const route = require("./routes");

app.use(express.json());

app.get("/", (req, res)=>{
    res.status(200).json({
        status : "Laptop app is running good",
        time : new Date().toLocaleString()
    })
})

app.use("/api/v1", route);

app.listen(port, () => console.log("App is running on port", port));
