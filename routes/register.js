const express=require("express");
const router=express.Router();
const db=require("../utility/database");



router.get("/register",(req,res)=>{
    const sql="select * from Roles";
    db.query(sql,(err,results)=>{
        if(err) throw err;
        res.render("register", {roles:results});
    });

});

const bcrypt = require("bcryptjs");
router.post("/register",async(req,res)=>{
    const {Name, Surname, Email, Password, Phone, RoleId}=req.body;
    const hashedPassword = await bcrypt.hash(Password, 10);
    const sql=`insert into Users (Name, Surname, Email, Password, Phone, RoleId) values(?,?,?,?,?,?)`;
    db.query(sql, [Name, Surname, Email, hashedPassword, Phone, RoleId],(err,results)=>{
        if(err) throw err;
        res.redirect("/login");
    });
});


module.exports=router;