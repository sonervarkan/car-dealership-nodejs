const mysql=require("mysql2");
const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"1234",
    database:"oto_galery_nodejs"
});



module.exports=db;