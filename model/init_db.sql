DROP DATABASE if exists travelette;
CREATE DATABASE travelette;
USE travelette;

--
-- Drop Tables
--

SET foreign_key_checks = 0;
DROP TABLE if exists categories;
DROP TABLE if exists users;
DROP TABLE if exists trip_user_relationship;
DROP TABLE if exists trips;
DROP TABLE if exists transactions;

--
-- Create Tables
--

CREATE TABLE categories(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(40) NOT NULL
);
CREATE TABLE users(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `firstname` VARCHAR(255) NOT NULL,
    `lastname` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL
);
CREATE TABLE trip_user_relationship(
    `trip_id` INT UNSIGNED NOT NULL,
    `user_id` INT UNSIGNED NOT NULL
);
ALTER TABLE
    `trip_user_relationship` ADD INDEX `trip_user_relationship_trip_id_index`(`trip_id`);
ALTER TABLE
    `trip_user_relationship` ADD INDEX `trip_user_relationship_user_id_index`(`user_id`);
CREATE TABLE trips(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `destination` VARCHAR(255) NOT NULL,
    `trip_description` VARCHAR(255) NULL
);
CREATE TABLE transactions(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `date` DATE NOT NULL,
    `category_id` INT UNSIGNED NOT NULL,
    `merchant` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `amount` DECIMAL(6,2) NOT NULL,
    `currency` VARCHAR(255) NOT NULL,
    `user_id` INT UNSIGNED NOT NULL,
    `trip_id` INT UNSIGNED NOT NULL
);
ALTER TABLE
    `transactions` ADD CONSTRAINT `transactions_trip_id_foreign` FOREIGN KEY(`trip_id`) REFERENCES `trips`(`id`);
ALTER TABLE
    `transactions` ADD CONSTRAINT `transactions_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `users`(`id`);
ALTER TABLE
    `trips` ADD CONSTRAINT `trips_id_foreign` FOREIGN KEY(`id`) REFERENCES `trip_user_relationship`(`trip_id`);
ALTER TABLE
    `trip_user_relationship` ADD CONSTRAINT `trip_user_relationship_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `users`(`id`);
ALTER TABLE
    `transactions` ADD CONSTRAINT `transactions_category_id_foreign` FOREIGN KEY(`category_id`) REFERENCES `categories`(`id`);


INSERT INTO `categories` (name)
VALUES
    ("food"), ("transport"), ("accomodation"), ("groceries"), ("shopping"), ("gifts"), ("personal care"), ("activities"), ("other");

INSERT INTO `trips` (destination) VALUES ("Barcelona");
INSERT INTO `transactions` (date, merchant, description, amount, currency, category_id, user_id, trip_id)
VALUES
    ("2023-06-01", "Vueling", "LGW - BCN flights", 600, "GBP", 2, 2, 1),
    ("2023-08-07", "TMB", "5-day public transport ticket", 152.80, "EUR", 2, 1, 1),
    ("2023-06-03", "NH Hotels", "2 Double-Rooms", 1041, "EUR", 3, 3, 1),
    ("2023-07-01", "Sagrada Familia", "Sagrada Familia Tickets", 100, "EUR", 8, 4, 1),
    ("2023-08-07", "LGW Airport", "Breakfast Service", 35.60, "GBP", 1, 1, 1),
    ("2023-08-07", "Mercadona", "Mercadona Bill", 263.75, "EUR", 4, 4, 1),
    ("2023-08-11", "Souvenirs de Barcelona", "Souvenirs", 23.96, "EUR", 6, 3, 1),
    ("2023-08-10", "Paella Barcelona", "Paella Barcelona Bill", 68.48, "EUR", 1, 1, 1),
    ("2023-08-09", "Tapas Barcelona", "Tapas Barcelona Bill", 42.20, "EUR", 1, 4, 1),
    ("2023-08-09", "Sangria Lifestyle", "Sangria Lifestyle Bill", 21.75, "EUR", 1, 2, 1);
INSERT INTO `trip_user_relationship` (trip_id, user_id)
VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (1, 4);

--
-- Register (via the front-end) four users to be able to see the trip calculations feature.
-- These are four examples you can use:
--
-- Filling the following blanks--firstname, lastname, username, and password
-- 1: Alexandra, Green, alexandragreen, alexandragreen
-- 2: Rafael, Marino, rafaelmarino, rafaelmarino
-- 3: Sofia, Rabl, sofiarabl, sofiarabl
-- 4: Chris, Velotti, chrisvelotti, chrisvelotti
--