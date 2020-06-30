CREATE TABLE slides(
	id VARCHAR PRIMARY KEY,
	title VARCHAR,
	image_path VARCHAR UNIQUE,
	is_kodak BOOLEAN DEFAULT TRUE,
	aircraft_immatriculation VARCHAR,
	publish_date TIMESTAMP,
	description VARCHAR,
	price FLOAT NOT NULL,
	stock INTEGER DEFAULT 1,
	category_id VARCHAR,
	subcategory_id VARCHAR,
	sales_price FLOAT,
	on_sale BOOLEAN DEFAULT FALSE,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP
);

CREATE TABLE categories(
	id VARCHAR PRIMARY KEY,
	title VARCHAR UNIQUE NOT NULL,
	is_subcategory BOOLEAN DEFAULT FALSE,
	parent_category_id VARCHAR
);

CREATE TABLE comments(
	id VARCHAR PRIMARY KEY,
	author_id VARCHAR NOT NULL,
	slide_id  INTEGER NOT NULL,
	rating FLOAT,
	date TIMESTAMP NOT NULL,
	content VARCHAR NOT NULL
);

CREATE TABLE deleted_comments(
	id VARCHAR PRIMARY KEY,
	author_id VARCHAR NOT NULL,
	slide_id  INTEGER NOT NULL,
	rating FLOAT,
	date TIMESTAMP NOT NULL,
	content VARCHAR NOT NULL,
	deleted_at TIMESTAMP NOT NULL
);

CREATE TABLE users(
	id VARCHAR PRIMARY KEY,
	first_name VARCHAR NOT NULL,
	last_name VARCHAR NOT NULL,
	email VARCHAR UNIQUE NOT NULL,
	password VARCHAR NOT NULL,
	street_address VARCHAR NOT NULL,
	post_code VARCHAR NOT NULL,
	city VARCHAR NOT NULL,
	country VARCHAR NOT NULL,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP,
	is_admin BOOLEAN DEFAULT FALSE,
	email_verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE deleted_users(
	id VARCHAR PRIMARY KEY,
	first_name VARCHAR NOT NULL,
	last_name VARCHAR NOT NULL,
	email VARCHAR UNIQUE NOT NULL,
	street_address VARCHAR NOT NULL,
	post_code VARCHAR NOT NULL,
	city VARCHAR NOT NULL,
	country VARCHAR NOT NULL,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP,
	deleted_at TIMESTAMP NOT NULL
);

CREATE TABLE contacts(
	email VARCHAR PRIMARY KEY,
	emails_enabled BOOLEAN DEFAULT TRUE
);

CREATE TABLE orders(

);

CREATE TABLE auctions(

);

