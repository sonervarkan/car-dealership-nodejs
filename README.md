# Auto Gallery Node.js – Car Listing & Filtering Platform

A complete Node.js + Express + MySQL + Cloudinary web application that allows users to:
```
✔ Register / login
✔ Upload cars with images to Cloudinary
✔ Filter cars by brand, model, fuel, gear, price, year
✔ Use advanced multi-step smart filtering (Brand → Model → Gear → Fuel → Year)
✔ View cars in a slider
✔ Manage cars added by authenticated sellers
```
Built with Express, Pug, MySQL2, Cloudinary, Multer, Sessions.

## Features
### User System

User registration with hashed passwords (bcryptjs)

Login / logout using express-session

### Role system:

RoleId = 3 → Seller (automatically assigned after adding first car)

### Car Management

Add car with up to 4 images

Images are uploaded and stored on Cloudinary

Each car belongs to a user

Approved cars (Is_approved = 1) appear on homepage slider

### Smart Filter System (AJAX)

Interactive filter menu:

Brand

Model (loaded dynamically)

Gear Type

Fuel Type

Year

## Homepage

Slider showing images from Cars + Images table

Filter form

Smart Filter menu

Display of user's own cars (if logged in as seller)

## Routing Overview
```
Route	Description
/	Home page with slider & filter
/login	User login
/register	User registration
/add-car	Add new car (auth required)
/filter	Filter search results
/get-brands	AJAX: Get distinct brands
/models/:brand	AJAX: Get models by brand
/logout	Destroy session
```
## Folder Structure
```
project/
│ app.js
│ package.json
├── routes/
│   ├── add-car.js
│   ├── login.js
│   ├── register.js
│   ├── logout.js
│
├── utility/
│   ├── database.js
│   └── cloudinary.js
│
├── public/
│   ├── css/
│   │   ├── main.css
│   │   ├── navbar.css
│   │   ├── form.css
│   │   ├── filter.css
│   │   └── smart-filter.css
│   ├── scripts/
│   │   └── smart-filter.js
│   └── logo/
│
├── views/
│   ├── home.pug
│   ├── add-car.pug
│   ├── login.pug
│   ├── register.pug
│   └── filter.pug
```

## Installation & Setup
1️⃣ Clone the Project
git clone https://github.com/yourrepo/oto-galery-nodejs.git
cd oto-galery-nodejs

2️⃣ Install Dependencies
npm install

3️⃣ Configure MySQL

Create a database:

CREATE DATABASE oto_galery_nodejs;


Update credentials inside:

### utility/database.js

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "oto_galery_nodejs"
});

4️⃣ Configure Cloudinary

### utility/cloudinary.js

cloudinary.config({
  cloud_name: "xxxxxxx",
  api_key: "xxxxxxxx",
  api_secret: "xxxxxxxxxxxx"
});

5️⃣ Start the App
npm start


App runs on:

http://localhost:3000

## Image Upload Logic

Uses Multer + Cloudinary Storage

Max 4 images

Images stored under Cloudinary folder: cars/

Path saved inside MySQL Images table

Example config:

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "cars",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 800, crop: "limit" }]
  }
});

## Technologies Used
```
Category	Technology
Backend	Node.js, Express
Database	MySQL2
Authentication	express-session, bcryptjs
Template Engine	Pug
File Upload	Multer + Cloudinary
Frontend	HTML, CSS, JS, AJAX
Middleware	Custom Auth Middleware
```
## Contact

Feel free to contribute or report issues.

Developer: Soner
Email: sonervarkan@outlook.com

## License

This project currently has no license.

