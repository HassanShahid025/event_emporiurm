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
  phone VARCHAR(20)
);


