CREATE DATABASE IF NOT EXISTS ecommerce;

USE ecommerce;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL
);

INSERT INTO products (name, price, stock) VALUES
('Laptop', 55000.00, 10),
('Smartphone', 25000.00, 20),
('Headphones', 3000.00, 30),
('Keyboard', 1500.00, 15);
