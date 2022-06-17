-- For SQLITE
CREATE TABLE "cards" (
	"card_id"	INTEGER UNIQUE,
	"set_id"	INTEGER,
	"card_order"	INTEGER,
	PRIMARY KEY("card_id" AUTOINCREMENT)
)

CREATE TABLE "cells" (
	"cell_id"	INTEGER UNIQUE,
	"card_id"	INTEGER,
	"side_id"	INTEGER,
	"info"	TEXT,
	PRIMARY KEY("cell_id" AUTOINCREMENT)
)

CREATE TABLE "sets" (
	"set_id"	INTEGER UNIQUE,
	"name"	TEXT,
	"description"	TEXT,
	"user_id"	INTEGER,
	"public"	INTEGER,
	PRIMARY KEY("set_id" AUTOINCREMENT)
)

CREATE TABLE "sides" (
	"side_id"	INTEGER UNIQUE,
	"set_id"	INTEGER,
	"name"	TEXT,
	"side_order"	INTEGER,
	PRIMARY KEY("side_id" AUTOINCREMENT)
)

CREATE TABLE "users" (
	"id"	INTEGER UNIQUE,
	"name"	TEXT,
	"email"	TEXT UNIQUE,
	"password"	TEXT,
	"avatar"	TEXT,
	"bio"	TEXT,
	"created_on"	TEXT,
	"last_login"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
)