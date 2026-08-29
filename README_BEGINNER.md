# FreshMart Supermarket — Beginner Setup

## 1. What this project contains

Frontend:
- React
- Vite
- React Router
- Axios

Backend:
- Java 17
- Spring Boot 3.4.3
- Spring Web
- Spring Data JPA
- Spring Security + BCrypt
- MySQL

Roles:
1. CUSTOMER
   - Can register using any new email.
   - Can login.
   - Can browse products.

2. SELLER
   - Recommended account:
     Email: seller@supermarket.com
     Password: Seller@123
   - Can add, edit and delete own products.

3. ADMIN
   - Recommended account:
     Email: admin@supermarket.com
     Password: Admin@123
   - Can view customers.
   - Can delete customer accounts.
   - Can view sellers.
   - Can delete seller accounts.
   - Can view admins.
   - Can add another admin.

## 2. Software required

Install:
- Java JDK 17
- Maven
- Node.js LTS
- MySQL Server
- MySQL Workbench
- VS Code or IntelliJ IDEA

Check:

java -version
mvn -version
node -v
npm -v

## 3. Create MySQL database

Open MySQL Workbench and run:

CREATE DATABASE supermarket_db;

USE supermarket_db;

Do NOT manually create users/products tables.
Spring Boot + JPA creates them automatically.

## 4. Configure MySQL password

Open:

backend/src/main/resources/application.properties

Change:

spring.datasource.password=YOUR_MYSQL_PASSWORD

For example:

spring.datasource.password=Root@123

Use your actual MySQL root password.

## 5. Start backend

Open PowerShell:

cd path\to\supermarket-fullstack\backend

Run:

mvn spring-boot:run

Successful output should contain something similar to:

Tomcat started on port 8080

Backend URL:

http://localhost:8080

## 6. Start frontend

Open another PowerShell:

cd path\to\supermarket-fullstack\frontend

Run:

npm install

Then:

npm run dev

Open:

http://localhost:5173

## 7. Test customer

Go to:

http://localhost:5173/register

Create:

Name: Dharani
Email: dharani@gmail.com
Password: Dharani@123

Then login.

The database will contain this customer in the users table.

## 8. Test seller

Login with:

seller@supermarket.com
Seller@123

Go to Seller Panel.

Add a product:
- Name: Apple
- Category: Fruits
- Price: 120
- Stock: 50
- Image URL: optional

Go back to Home.
The product will appear.

## 9. Test admin

Login with:

admin@supermarket.com
Admin@123

Go to Admin Panel.

You will see:
- Customers
- Sellers
- Admins
- Add New Admin

You can delete customer and seller users.

You can add another admin.

## 10. See data in MySQL Workbench

Run:

USE supermarket_db;

SHOW TABLES;

SELECT * FROM users;

SELECT * FROM products;

The users table stores:
- id
- name
- email
- encrypted password
- role

The products table stores:
- id
- name
- category
- price
- stock
- image_url
- seller_id

## 11. Important architecture for viva

React
  |
  | HTTP / REST API
  v
Spring Boot Controller
  |
  v
Repository / JPA
  |
  v
MySQL

Example:

React Login Page
      |
      | POST /api/auth/login
      v
AuthController.java
      |
      v
UserRepository.java
      |
      v
MySQL users table

Admin delete flow:

React Admin Dashboard
      |
      | DELETE /api/admin/users/5
      v
AdminController.java
      |
      v
UserRepository.delete()
      |
      v
MySQL users table

Seller product flow:

React Seller Dashboard
      |
      | POST /api/seller/products
      v
ProductController.java
      |
      v
ProductRepository.java
      |
      v
MySQL products table

## 12. Important beginner note about authentication

This project is a college/demo MVP.
Passwords are stored in MySQL using BCrypt hashing.

The frontend stores the logged-in user's basic information in localStorage.
For a production application, use proper Spring Security authentication with JWT/session security and enforce authorization on the backend rather than relying on frontend role checks.

## 13. Common errors

### Error: Access denied for user 'root'

Your MySQL password in application.properties is wrong.

### Error: Communications link failure

Make sure MySQL Server is running.

### Error: Port 8080 already in use

Stop the other Spring Boot application or change:

server.port=8081

If you change backend port, also change frontend src/api.js.

### Error: npm is not recognized

Install Node.js LTS and restart VS Code/PowerShell.

### Error: mvn is not recognized

Install Maven and add Maven bin to PATH, then restart VS Code.

### Error: Cannot connect to database

Check:
- MySQL is running
- database supermarket_db exists
- username is correct
- password is correct
- port is 3306

## 14. Recommended next features

After this MVP works, add:
- Product search
- Category filter
- Shopping cart
- Customer orders
- Order history
- Seller order management
- Admin product management
- Product image upload
- Payment gateway
- JWT authentication
- Spring Security role authorization
- Dashboard charts
- Responsive mobile UI
