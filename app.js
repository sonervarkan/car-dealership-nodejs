const express=require("express");
const app=express();
const db=require("./utility/database");
const path = require('path');
const session = require("express-session");
const auth = require("./middlewares/auth");


app.set("view engine","pug");
app.set("views","./views");


app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.urlencoded({extended:false}));


app.use(session({ secret: "secretKey", resave: false, saveUninitialized: false }));

app.use(session({
  secret: "supersecretkey",
  resave: false,
  saveUninitialized: true
}));


app.get("/", (req, res) => {
  const sqlSlider = `SELECT * FROM Cars c JOIN Images i ON c.Id = i.CarId WHERE c.Is_approved = 1`;
  const sqlCars = `SELECT DISTINCT Model FROM Cars WHERE Is_approved = 1`;

  db.query(sqlSlider, (err, resultsSlider) => {
    if (err) throw err;

    db.query(sqlCars, (err2, resultsCars) => {
      if (err2) throw err2;

      const user = req.session.user || null;

      if (user && user.roleId === 3) {
        const myCarsSql = `SELECT c.Id, c.Brand, c.Model, i.Image_url
          FROM Cars c LEFT JOIN Images i ON c.Id = i.CarId WHERE c.UserId = ?`;

        db.query(myCarsSql, [user.id], (err3, resultsMyCars) => {
          if (err3) throw err3;

          res.render("home", {
            images: resultsSlider,
            user: user,
            myCars: resultsMyCars,
            cars: resultsCars
          });
        });
      } else {
        res.render("home", {
          images: resultsSlider,
          user: user,
          myCars: [],
          cars: resultsCars
        });
      }
    });
  });
});


app.get("/filter", (req, res) => {
  const user = req.session.user || null;
  const { Brand, Fuel_type, Gear_type, minPrice, maxPrice, Location, Year } = req.query;

  let sql = `SELECT * FROM Cars c JOIN Images i ON c.Id = i.CarId WHERE c.Is_approved = 1`;
  const params = [];

  if (Brand) { sql += " AND c.Brand LIKE ?"; params.push(`%${Brand}%`); }
  if (Fuel_type) { sql += " AND c.Fuel_type = ?"; params.push(Fuel_type); }
  if (Gear_type) { sql += " AND c.Gear_type = ?"; params.push(Gear_type); }
  if (minPrice) { sql += " AND c.Price >= ?"; params.push(minPrice); }
  if (maxPrice) { sql += " AND c.Price <= ?"; params.push(maxPrice); }
  if (Location) { sql += " AND c.Location LIKE ?"; params.push(`%${Location}%`); }
  if (Year) { sql += " AND c.Year = ?"; params.push(Year); }

  db.query(sql, params, (err, results) => {
    if (err) throw err;

    if (user && user.roleId === 3) {
      const myCarsSql = `SELECT * FROM Cars c LEFT JOIN Images i ON c.Id = i.CarId WHERE c.UserId = ?`;
      db.query(myCarsSql, [user.id], (err2, resultsMyCars) => {
        if (err2) throw err2;
        res.render("filter", { images: results, user, myCars: resultsMyCars });
      });
    } else {
      res.render("filter", { images: results, user, myCars: [] });
    }
  });
});


app.get("/get-brands", (req, res) => {
  db.query("SELECT DISTINCT Brand FROM Cars WHERE Is_approved = 1", (err, results) => {
    if (err) throw err;
    const brands = results.map(r => r.Brand);
    res.json(brands);
  });
});


app.get("/models/:brand", (req, res) => {
  const brand = req.params.brand;

  const sql = `SELECT DISTINCT Model FROM Cars WHERE Brand = ? AND Is_approved = 1`;
  db.query(sql, [brand], (err, results) => {
    if (err) throw err;
    const models = results.map(result => result.Model);
    res.json(models);
  });
});



app.use("/",require("./routes/register"));
app.use("/", require("./routes/login"));
app.use("/", auth, require("./routes/add-car"));
app.use("/logout", require("./routes/logout"));

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});