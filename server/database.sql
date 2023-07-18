create database eemporium;

CREATE TABLE ads (
    ad_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price NUMERIC NOT NULL,
    location VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    venue_category VARCHAR(255),
    ad_desc TEXT,
    images TEXT[],
    ad_date DATE
);

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  gender VARCHAR(10),
  city VARCHAR(100),
  phone VARCHAR(20),
  is_blocked boolean
);

CREATE TABLE favourites (
  favourite_id SERIAL PRIMARY KEY,
  user_id INT,
  ad_id INT,
  FOREIGN KEY (ad_id) REFERENCES ads (ad_id)
);

CREATE TABLE reviews (
  review_id SERIAL PRIMARY KEY,
  rating INT,
  review_text TEXT,
  ad_id INT,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE complaints (
  complain_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  ad_id INT NOT NULL,
  ad_name VARCHAR(255) NOT NULL,
  complain_text TEXT NOT NULL
);

CREATE TABLE bookings (
  booking_id SERIAL PRIMARY KEY,
  booking_dates date[],
  ad_id INTEGER
);

CREATE TABLE contact (
  contact_id SERIAL PRIMARY KEY,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL
);


