const data = require("./data.json");

const storageData = JSON.stringify(data);
sessionStorage.setItem("recipes", storageData);
