//9:35
//node index
//nodemon index
//psql -U postgres

const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");
// const passsport = require("passport")
// const flash = require('express-flash')
// const session = require('express-session')

// const initializePassport = require("./passportConfig")

//middle
app.use(cors());
app.use(express.json());
// app.use(
//   session({
//     secret:"secret",

//     resave: false,
//     saveUninitialized: false
//   })
// )
// app.use(passsport.initialize)
// app.use(passsport.session)
// app.use(flash())

//Routes//

//create ad
app.post("/ads", async (req, res) => {
  try {
    const {
      name,
      images,
      price,
      city,
      location,
      category,
      venue_category,
      ad_desc,
      ad_date,
      user_id,
    } = req.body;
    const newAd = await pool.query(
      "INSERT INTO ads (name,images,price,city,location,category,venue_category,ad_desc,ad_date,user_id ) VALUES($1, $2, $3,$4,$5,$6,$7,$8,$9,$10) RETURNING *",
      [
        name,
        images,
        price,
        city,
        location,
        category,
        venue_category,
        ad_desc,
        ad_date,
        user_id,
      ]
    );

    res.json(newAd.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//create user
app.post("/users/register", async (req, res) => {
  try {
    const { first_name, last_name, password, email, city, gender, phone } =
      req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const newUser = await pool.query(
      "INSERT INTO users (first_name,last_name,password,email,city,gender,phone) VALUES($1, $2, $3,$4,$5,$6,$7) RETURNING *",
      [first_name, last_name, hashedPassword, email, city, gender, phone]
    );

    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//add to favourites
app.post("/favourites", async (req, res) => {
  try {
    const { user_id, ad_id } = req.body;
    const newFavourite = await pool.query(
      "INSERT INTO favourites (user_id, ad_id) VALUES($1, $2) RETURNING *",
      [user_id, ad_id]
    );
    res.json(newFavourite.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//check password
app.post("/users-password", async (req, res) => {
  try {
    const { enteredPassword, password } = req.body;
    const isPasswordMatch = await bcrypt.compare(enteredPassword, password);

    if (isPasswordMatch) {
      // Password is correct, send a success response
      res.status(200).json({ message: "Login successful" });
    } else {
      // Password is incorrect, send an error response
      res.status(401).json({ message: "Invalid password" });
    }
  } catch (err) {
    console.error(err.message);
  }
});

//get all ads
app.get("/ads", async (req, res) => {
  try {
    const allTodos = await pool.query("select * from ads");
    res.json(allTodos.rows);
  } catch (error) {
    console.log(error.message);
  }
});

//get an ad
app.get("/ads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await pool.query("select * from ads where ad_id = $1", [id]);
    res.json(ad.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

//get myAds
app.get("/myads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const myAds = await pool.query("select * from ads where user_id = $1", [
      id,
    ]);
    res.json(myAds.rows);
  } catch (error) {
    console.log(error.message);
  }
});

// getFavourite ads
app.get("/myfavourite/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const favourite = await pool.query(
      "select * from favourite where user_id = $1",
      [id]
    );
    res.json(favourite.rows);
  } catch (error) {
    console.log(error.message);
  }
});

//getUser
app.get("/users-login/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await pool.query("select * from users where email = $1", [
      email,
    ]);
    res.json(user.rows);
  } catch (error) {
    console.log(error.message);
  }
});

//update an ad
app.put("/ads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      images,
      price,
      city,
      location,
      category,
      venue_category,
      ad_desc,
      ad_date,
      user_id,
    } = req.body;

    const updateAd = await pool.query(
      "UPDATE ads SET name = $1, images = $2, price = $3, city = $4, location = $5, category = $6, venue_category = $7, ad_desc = $8, ad_date = $9, user_id = $10 WHERE ad_id = $11",
      [
        name,
        images,
        price,
        city,
        location,
        category,
        venue_category,
        ad_desc,
        ad_date,
        user_id,
        id,
      ]
    );
    res.json("ad was updated");
  } catch (error) {
    console.log(error.message);
  }
});

//delete a ad from ads
app.delete("/ads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteAd = await pool.query("delete from ads where ad_id = $1", [id]);
    res.json("ad was deleted");
  } catch (error) {
    console.log(message);
  }
});

app.listen(3000, () => {
  console.log("server started");
});
