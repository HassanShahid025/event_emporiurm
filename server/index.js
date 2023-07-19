//9:35
//node index
//nodemon index
//psql -U postgres

const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");

//middle
app.use(cors());
app.use(express.json());

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
    const { ad_id, user_id } = req.body;
    const newFavourite = await pool.query(
      "INSERT INTO favourites (user_id, ad_id) VALUES($1, $2) RETURNING *",
      [user_id, ad_id]
    );
    res.json(newFavourite.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//add to reviews
app.post("/reviews-add/:ad_id", async (req, res) => {
  try {
    const { ad_id, user_id, rating, review_text, review_date, first_name } =
      req.body;
    const newFavourite = await pool.query(
      "INSERT INTO reviews (ad_id, user_id,rating,review_text,review_date,first_name) VALUES($1, $2, $3, $4, $5,$6) RETURNING *",
      [ad_id, user_id, rating, review_text, review_date, first_name]
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

//add complain
app.post("/complaints-add/:ad_id", async (req, res) => {
  try {
    const { ad_id, user_id, complain_text, ad_name } = req.body;
    const newComplain = await pool.query(
      "INSERT INTO complaints (ad_id, user_id,complain_text, ad_name ) VALUES($1, $2, $3, $4) RETURNING *",
      [ad_id, user_id, complain_text, ad_name]
    );
    res.json(newComplain.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// add bookings
app.post("/booking-add/:ad_id", async (req, res) => {
  try {
    const { ad_id, booking_dates } = req.body;
    const newBooking = await pool.query(
      "INSERT INTO bookings (ad_id, booking_dates) VALUES($1, $2) RETURNING *",
      [ad_id, booking_dates]
    );
    res.json(newBooking.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//add contact message
app.post("/contact", async (req, res) => {
  try {
    const { user_name, user_email, subject, message } = req.body;
    const newEmail = await pool.query(
      "INSERT INTO contact (user_name, user_email, subject, message) VALUES($1, $2, $3, $4) RETURNING *",
      [user_name, user_email, subject, message]
    );
    res.json(newEmail.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//get all ads
app.get("/ads", async (req, res) => {
  try {
    const allAds = await pool.query("select * from ads");
    res.json(allAds.rows);
  } catch (error) {
    console.log(error.message);
  }
});

//get an ad
app.get("/ads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await pool.query(
      
   " SELECT ads.*, users.phone FROM ads INNER JOIN users ON CAST(ads.user_id AS INTEGER) = users.user_id WHERE ads.ad_id = $1;"
  , [id]
    );
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
app.get("/favourites-ads/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const favourite = await pool.query(
      `
      SELECT favourites.favourite_id,ads.city, ads.ad_id, ads.name, ads.category, ads.price, ads.images
      FROM favourites
      JOIN ads ON favourites.ad_id = ads.ad_id
      WHERE favourites.user_id = $1
      `,
      [user_id]
    );
    res.json(favourite.rows);
  } catch (error) {
    console.log(error.message);
  }
});

//getAllUser
app.get("/users", async (req, res) => {
  try {
    const allUsers = await pool.query("select * from users");
    res.json(allUsers.rows);
  } catch (error) {
    console.log(error.message);
  }
});

//getUser
app.get("/users-login/:email", async (req, res) => {
  try {
    const { email  } = req.params;
    const user = await pool.query("select * from users where email = $1", [
      email,
    ]);
    res.json(user.rows);
  } catch (error) {
    console.log(error.message);
  }
});

//get reviews
app.get("/reviews/:ad_id", async (req, res) => {
  try {
    const { ad_id } = req.params;
    const user = await pool.query("select * from reviews where ad_id = $1", [
      ad_id,
    ]);
    res.json(user.rows);
  } catch (error) {
    console.log(error.message);
  }
});

//get total users for admin home
app.get("/admin-users-count", async (req, res) => {
  try {
    const user = await pool.query("SELECT COUNT(*) AS user_count FROM users");
    res.json(user.rows[0].user_count);
  } catch (error) {
    console.log(error.message);
  }
});
//get total ads for admin home
app.get("/admin-ads-count", async (req, res) => {
  try {
    const ads = await pool.query("SELECT COUNT(*) AS ads_count FROM ads");
    res.json(ads.rows[0].ads_count);
  } catch (error) {
    console.log(error.message);
  }
});
//get total complaints for admin home
app.get("/admin-complaints-count", async (req, res) => {
  try {
    const complaints = await pool.query(
      "SELECT COUNT(*) AS complaints_count FROM complaints"
    );
    res.json(complaints.rows[0].complaints_count);
  } catch (error) {
    console.log(error.message);
  }
});

//get complaints
app.get("/admin-complaints", async (req, res) => {
  try {
    const allComplaints = await pool.query("select * from complaints");
    res.json(allComplaints.rows);
  } catch (error) {
    console.log(error.message);
  }
});

// get an ad bookings
app.get("/bookings/:ad_id", async (req, res) => {
  try {
    const { ad_id } = req.params;
    const booking = await pool.query(
      "SELECT * FROM bookings WHERE ad_id = $1",
      [ad_id]
    );
    res.json(booking.rows[0]);
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

// update user to block it
app.put("/user-block/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const blockUser = await pool.query(
      "UPDATE users SET is_blocked = true WHERE user_id = $1",
      [id]
    );
    res.json("user was blocked");
  } catch (error) {
    console.log(error.message);
  }
});

// update user to unblock it
app.put("/user-unblock/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const unblockUser = await pool.query(
      "UPDATE users SET is_blocked = false WHERE user_id = $1",
      [id]
    );
    res.json("user was unblocked");
  } catch (error) {
    console.log(error.message);
  }
});

//update bookings
app.put("/bookings-update/:ad_id", async (req, res) => {
  try {
    const { ad_id } = req.params;
    const { booking_dates } = req.body;

    const updateBooking = await pool.query(
      "UPDATE bookings SET booking_dates = $1 WHERE ad_id = $2",
      [booking_dates, ad_id]
    );
    res.json("Booking was updated");
  } catch (error) {
    console.log(error.message);
  }
});

//update user
app.put("/user-update/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { first_name, last_name, phone, city, email, gender } = req.body;

    const updateUser = await pool.query(
      "UPDATE users SET first_name = $1, last_name = $2, phone = $3, city = $4, email = $5, gender = $6 WHERE user_id = $7",
      [first_name, last_name, phone, city, email, gender, user_id]
    );
    res.json("User was updated");
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

//remove from favourite
app.delete("/favourites-remove/:favourite_id", async (req, res) => {
  try {
    const { favourite_id } = req.params;
    const deleteFav = await pool.query(
      "delete from favourites where favourite_id = $1",
      [favourite_id]
    );
    res.json("ad was deleted");
  } catch (error) {
    console.log(message);
  }
});

//remove from favourite
app.delete("/favourites-remove-ad/:ad_id", async (req, res) => {
  try {
    const { ad_id } = req.params;
    const deleteFav = await pool.query(
      "delete from favourites where ad_id = $1",
      [ad_id]
    );
    res.json("ad was deleted");
  } catch (error) {
    console.log(message);
  }
});

// delete complain
app.delete("/complain-delete/:complain_id", async (req, res) => {
  try {
    const { complain_id } = req.params;
    const deleteComplain = await pool.query(
      "delete from complaints where complain_id = $1",
      [complain_id]
    );
    res.json("complain was deleted");
  } catch (error) {
    console.log(message);
  }
});

app.listen(3000, () => {
  console.log("server started");
});
