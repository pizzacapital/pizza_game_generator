require("dotenv").config();

const fs = require("fs");

if (!fs.existsSync("./output")){
    fs.mkdirSync("./output");
}

if (!fs.existsSync("./output/data")){
    fs.mkdirSync("./output/data");
}

if (!fs.existsSync("./output/img")){
    fs.mkdirSync("./output/img");
}

const Monitor = require('./modules/Monitor');
Monitor.runMonitor()
