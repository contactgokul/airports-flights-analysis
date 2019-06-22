-- Create a database Schema
DROP DATABASE IF EXISTS FLIGHTS_PROJECT;
CREATE DATABASE FLIGHTS_PROJECT;

USE FLIGHTS_PROJECT;
-- Create a table to store airlines data
DROP TABLE IF EXISTS FLIGHTS_STATS;
CREATE TABLE FLIGHTS_STATS (
	`AIRLINE` VARCHAR(2) CHARACTER SET utf8,
    `AIRPORT1` VARCHAR(50) CHARACTER SET utf8,
    `AIRPORT2` VARCHAR(50) CHARACTER SET utf8,
	`CNT` INT
);

select * from FLIGHTS_STATS;