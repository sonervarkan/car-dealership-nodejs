const express=require("express");
const router=express.Router();
const db=require("../utility/database");
const path = require("path");

/*
// Uploading multimedia to coding folder
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/img"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });
*/

// Uploading multimedia to cloudinary.com
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utility/cloudinary");


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "cars",           // Bulutta hangi klasöre kaydedilecek
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 800, crop: "limit" }]
  }
});

const upload = multer({ storage: storage });


router.get("/add-car",(req,res)=>{
    const user=req.session.user;
     
    if (!user) {
        return res.redirect("/login");
    }
    res.render("add-car");
});

router.post("/add-car", upload.array("images", 4), (req, res) => {
  const user = req.session.user;
  if (!user) return res.redirect("/login");

  const userId = user.id;
  const { Brand, Model, Year, Price, Fuel_type, Gear_type, Mileage, Color, Description, Location } = req.body;
  const isApproved = 1;


  const sqlCar = `
    INSERT INTO Cars (Brand, Model, Year, Price, Fuel_type, Gear_type, Mileage, Color, Description, Location, UserId, Is_approved)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sqlCar, [Brand, Model, Year, Price, Fuel_type, Gear_type, Mileage, Color, Description, Location, userId, isApproved],
    (err, result) => {
      if (err) throw err;

      const carId = result.insertId; // Eklenen aracın ID'si

 
      if (req.files && req.files.length > 0) {
        const imageSql = `INSERT INTO Images (CarId, Image_url) VALUES ?`;
        const imageValues = req.files.map(file => [carId, file.path]); 

        db.query(imageSql, [imageValues], (err2) => {
          if (err2) throw err2;

         
          const roleSql = `UPDATE Users SET RoleId = 3 WHERE Id = ?`;
          db.query(roleSql, [userId], (err3) => {
            if (err3) throw err3;

            
            req.session.user.roleId = 3;

      
            res.redirect("/");
          });
        });
      } else {
        res.send("Resim yüklenmedi.");
      }
    });
});






module.exports=router;
