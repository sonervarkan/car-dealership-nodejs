const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "xxxxxxx",   
  api_key: "xxxxxxxx",
  api_secret: "xxxxxxxxxxxx"
});

module.exports = cloudinary;
