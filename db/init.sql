DROP DATABASE IF EXISTS blogposts;
CREATE DATABASE blogposts;

\c blogposts;

CREATE TABLE posts (
  ID SERIAL PRIMARY KEY,
  Title VARCHAR,
  Type VARCHAR,
  Body VARCHAR,
  Images TEXT,
  Tags VARCHAR,
  Category VARCHAR,
  Date VARCHAR,
  Author VARCHAR,
  Email VARCHAR,
  Scheduled INT
);

INSERT INTO posts (Title, Type, Body, Images, Tags, Category, Date, Author, Email, Scheduled)
  VALUES('Title', 'Type', 'Body', 'Images', 'Tags', 'Category', 'Current Date', 'Author', 'Email', 0);
