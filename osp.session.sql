-- @block

CREATE DATABASE superkuber;

USE superkuber;

CREATE TABLE tester(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    location VARCHAR(255),
    bio TEXT,
    taxBracket INT
);

CREATE TABLE alerts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    category VARCHAR(255) NOT NULL,
    node_id VARCHAR(255),
    node_name VARCHAR(255),
    log TEXT UNIQUE,
    read VARCHAR(255) DEFAULT 'unread'
);

CREATE TABLE cluster (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    uid VARCHAR(255) NOT NULL UNIQUE,
    created_at VARCHAR(255) NOT NULL,
    data JSON NOT NULL 
);

CREATE TABLE clusters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data JSON NOT NULL 
);

-- ALTER TABLE alerts OWNER TO mmadmin