DROP DATABASE IF EXISTS usof;

CREATE DATABASE usof;

-- CREATE USER 'mhrynenko'@'localhost' IDENTIFIED BY 'securepass';

GRANT ALL PRIVILEGES ON usof. * TO 'mhrynenko'@'localhost';

FLUSH PRIVILEGES;

USE usof;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    profile_picture VARCHAR(255) NOT NULL,
    rating INT NOT NULL DEFAULT 0,
    role ENUM('admin','user') NOT NULL DEFAULT 'user',
    token VARCHAR(255),
    confirmedEmail BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    publish_date DATETIME NOT NULL,
    status ENUM('active','inactive') NOT NULL DEFAULT 'active',
    content VARCHAR(255) NOT NULL, 
    files VARCHAR(255) DEFAULT NULL, 
    categories VARCHAR(255),

    FOREIGN KEY (author) REFERENCES users (login) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) 
);

CREATE TABLE IF NOT EXISTS posts_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT,
    author VARCHAR(255) NOT NULL,
    publish_date DATETIME NOT NULL,
    content VARCHAR(255) NOT NULL,
    files VARCHAR(255) DEFAULT NULL, 

    FOREIGN KEY (author) REFERENCES users (login) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author VARCHAR(255) NOT NULL,
    publish_date DATETIME NOT NULL,
    post_id INT,
    comment_id INT,
    type INT NOT NULL, -- +1 - like, -1 - dislike

    FOREIGN KEY (author) REFERENCES users (login) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments (id) ON DELETE CASCADE
);

