-- @block

CREATE TABLE tester(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    location VARCHAR(255),
    bio TEXT,
    taxBracket INT
);

