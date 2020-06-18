CREATE TABLE slides(
	id VARCHAR NOT NULL PRIMARY KEY,
	title VARCHAR,
	image_path VARCHAR UNIQUE,
	origin_date TIMESTAMP,
	description VARCHAR,
	price FLOAT NOT NULL,
	stock INTEGER DEFAULT 1,
	category_id VARCHAR,
	subcategory_id VARCHAR
	sales_price FLOAT,
	on_sale BOOLEAN DEFAULT FALSE,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP
);

CREATE TABLE categories(
	id VARCHAR NOT NULL PRIMARY KEY,
	title VARCHAR UNIQUE NOT NULL,
	is_subcategory BOOLEAN DEFAULT FALSE,
	parent_category VARCHAR
);

CREATE TABLE comments(
	id VARCHAR NOT NULL PRIMARY KEY,
	username VARCHAR NOT NULL,
	slide_id  INTEGER NOT NULL,
	rating FLOAT,
	publish_date TIMESTAMP NOT NULL,
	content VARCHAR NOT NULL
);

CREATE TABLE deleted_comments(
	id VARCHAR NOT NULL PRIMARY KEY,
	username VARCHAR NOT NULL,
	slide_id  INTEGER NOT NULL,
	rating FLOAT,
	publish_date TIMESTAMP NOT NULL,
	content VARCHAR NOT NULL,
	deleted_at TIMESTAMP NOT NULL
);

CREATE TABLE users(
	id VARCHAR NOT NULL PRIMARY KEY,
	username VARCHAR UNIQUE NOT NULL,
	first_name VARCHAR NOT NULL,
	last_name VARCHAR NOT NULL,
	email VARCHAR UNIQUE NOT NULL,
	street_address VARCHAR NOT NULL,
	post_code VARCHAR NOT NULL,
	city VARCHAR NOT NULL,
	country VARCHAR NOT NULL,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP,
	paypal_email VARCHAR UNIQUE,
	is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE deleted_users(
	id VARCHAR NOT NULL PRIMARY KEY,
	username VARCHAR UNIQUE NOT NULL,
	first_name VARCHAR NOT NULL,
	last_name VARCHAR NOT NULL,
	email VARCHAR UNIQUE NOT NULL,
	street_address VARCHAR NOT NULL,
	post_code VARCHAR NOT NULL,
	city VARCHAR NOT NULL,
	country VARCHAR NOT NULL,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP,
	paypal_email VARCHAR UNIQUE,
	deleted_at TIMESTAMP NOT NULL
);

CREATE TABLE orders(

);
