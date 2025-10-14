const express = require("express");
const router = express.Router();


router.get("/", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.log("Session sonlandırma hatası:", err);
        return res.send("Çıkış yapılırken bir hata oluştu.");
      } else {
        res.clearCookie("connect.sid"); 
        return res.redirect("/");  
      }
    });
  } else {
    res.redirect("/");
  }
});

module.exports = router;
