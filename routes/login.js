const express=require("express");
const router=express.Router();
const db=require("../utility/database");

router.get("/login",(req,res)=>{
    res.render("login");
});

const bcrypt = require("bcryptjs");
router.post("/login", (req,res)=>{
    const {Name, Surname, Password} = req.body;
    
    const sql = "SELECT * FROM Users WHERE Name=? AND Surname=?";
    db.query(sql, [Name, Surname], async (err, results)=>{
        if(err) throw err;

        if(results.length === 0){
             return res.render("login", { error: "Kullanıcı bulunamadı" });
        }

        const user = results[0];

        const match = await bcrypt.compare(Password, user.Password);
        if(!match){
            return res.render("login", { error: "Şifre yanlış" });
        }

        
    
      req.session.user = {
        id: user.Id,
        firstname: user.Name,
        lastname: user.Surname,
        roleId: user.RoleId
      };
        
        res.redirect("/");
    });
});



module.exports=router;