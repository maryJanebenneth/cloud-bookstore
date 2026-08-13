# 📚 Cloud Bookstore

A full-stack bookstore application built with **Node.js, Express.js, PostgreSQL, HTML, CSS, and JavaScript**, with the PostgreSQL database hosted on **Amazon RDS**.

The project demonstrates how a frontend application communicates with a RESTful backend API, which connects to a cloud-hosted relational database. It includes book and author management, customer orders, stock validation, transaction processing, and a responsive bookstore interface.

---

## 📌 Project Overview

The Cloud Bookstore consists of three main components:

- **Frontend** – A web interface built with HTML, CSS, and JavaScript.
- **Backend** – A RESTful API built with Node.js and Express.js.
- **Database** – PostgreSQL hosted on Amazon RDS.

The frontend communicates with the backend using HTTP requests through the JavaScript Fetch API. The backend processes requests and performs SQL operations against the PostgreSQL database.

---

## 🏗️ Architecture

```text
                    ┌───────────────────┐
                    │      Browser      │
                    │                   │
                    │ HTML / CSS / JS   │
                    └─────────┬─────────┘
                              │
                         HTTP Requests
                              │
                              ▼
                    ┌───────────────────┐
                    │   Express Server  │
                    │     Node.js       │
                    │                   │
                    │    REST API       │
                    └─────────┬─────────┘
                              │
                         SQL Queries
                              │
                              ▼
                    ┌───────────────────┐
                    │     AWS RDS       │
                    │   PostgreSQL 15   │
                    │                   │
                    │    Bookstore DB   │
                    └───────────────────┘
```

---

## ✨ Features

### Frontend

- Modern bookstore interface
- Homepage
- Books catalogue
- Dynamic book listing
- Book cover images
- Author information
- Genre information
- Book pricing
- Stock availability
- Publication date
- Backend API integration

### Backend

- RESTful API
- Author management
- Book management
- Genre-based filtering
- Customer management
- Order processing
- Order details
- Stock validation
- Automatic stock reduction
- Automatic order total calculation
- Database transactions
- Rollback on failed orders
- SQL JOIN queries
- Error handling
- CORS support

### Database

- PostgreSQL relational database
- Primary keys
- Foreign keys
- Unique constraints
- Data validation
- Relationships between tables
- SQL JOIN operations
- Transaction management

### Cloud

- Amazon RDS PostgreSQL
- AWS VPC
- AWS Security Groups
- Cloud-hosted relational database

---

# 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Frontend structure |
| CSS3 | Frontend styling |
| JavaScript | Frontend functionality |
| Fetch API | Frontend/API communication |
| Node.js | Backend runtime |
| Express.js | REST API framework |
| PostgreSQL | Relational database |
| `pg` | PostgreSQL connection |
| dotenv | Environment variable management |
| CORS | Cross-origin requests |
| AWS RDS | Cloud database hosting |
| Git | Version control |
| GitHub | Source code management |

---

# 📁 Project Structure

```text
bookstore-api/
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   └── app.js
│   │
│   ├── index.html
│   └── books.html
│
├── db.js
├── index.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

# 🗄️ Database Schema

The application uses five PostgreSQL tables.

## Authors

```text
authors
├── id (PK)
├── name
├── bio
└── created_at
```

## Books

```text
books
├── id (PK)
├── title
├── author_id (FK → authors)
├── genre
├── price
├── stock
├── published_date
└── created_at
```

## Customers

```text
customers
├── id (PK)
├── name
├── email (UNIQUE)
└── created_at
```

## Orders

```text
orders
├── id (PK)
├── customer_id (FK → customers)
├── order_date
└── total
```

## Order Items

```text
order_items
├── id (PK)
├── order_id (FK → orders)
├── book_id (FK → books)
├── quantity
└── price
```

---

# 🔗 Database Relationships

```text
Authors
   │
   │ 1 : Many
   ▼
Books
   │
   │ 1 : Many
   ▼
Order Items
   │
   │ Many : 1
   ▼
Orders
   │
   │ Many : 1
   ▼
Customers
```

### Relationships

- An author can have multiple books.
- A book belongs to an author.
- A customer can have multiple orders.
- An order belongs to a customer.
- An order can contain multiple order items.
- An order item references a book.

---

# 🚀 Getting Started

## Prerequisites

Before running the project, make sure you have:

- Node.js v18 or later
- npm
- Git
- PostgreSQL / `psql`
- An AWS account
- An AWS RDS PostgreSQL database
- Visual Studio Code

---

# 1. Clone the Repository

Clone the repository from GitHub:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Move into the project directory:

```bash
cd bookstore-api
```

---

# 2. Install Dependencies

Install the project dependencies:

```bash
npm install
```

The main dependencies used by the application are:

```bash
npm install express pg dotenv cors
```

For development with automatic server restart:

```bash
npm install --save-dev nodemon
```

---

# 3. Configure AWS RDS

The application uses PostgreSQL hosted on Amazon RDS.

From the AWS Management Console:

```text
AWS Console
    ↓
RDS
    ↓
Databases
    ↓
Create Database
```

Select:

- PostgreSQL
- PostgreSQL 15 or a compatible version
- Appropriate database instance size
- VPC
- Security Group
- Database username
- Database password

For development purposes, the database can be configured for public accessibility.

> **Security Note:** Publicly accessible databases are not recommended for production. Production databases should use private networking and restricted security group rules.

After the database becomes available, copy the RDS endpoint.

Example:

```text
bookstore-db.xxxxxxxxx.us-east-1.rds.amazonaws.com
```

---

# 4. Connect to PostgreSQL

Using `psql`, connect to the RDS instance:

```bash
psql -h your-rds-endpoint.amazonaws.com -U postgres -d postgres -p 5432
```

Enter your database password when prompted.

After connecting, create the bookstore database:

```sql
CREATE DATABASE bookstore;
```

Connect to the database:

```sql
\c bookstore
```

---

# 5. Create the Database Tables

## Authors

```sql
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Books

```sql
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author_id INT REFERENCES authors(id) ON DELETE SET NULL,
    genre VARCHAR(100),
    price NUMERIC(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    published_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Customers

```sql
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Orders

```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(id) ON DELETE CASCADE,
    order_date TIMESTAMP DEFAULT NOW(),
    total NUMERIC(10, 2) DEFAULT 0
);
```

## Order Items

```sql
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    book_id INT REFERENCES books(id) ON DELETE SET NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price NUMERIC(10, 2) NOT NULL
);
```

---

# 6. Insert Sample Data

## Authors

```sql
INSERT INTO authors (name, bio) VALUES
('George Orwell', 'English novelist and essayist'),
('Toni Morrison', 'American novelist and Nobel Prize winner'),
('Haruki Murakami', 'Japanese contemporary fiction writer');
```

## Books

```sql
INSERT INTO books
(title, author_id, genre, price, stock, published_date)
VALUES
('1984', 1, 'Dystopian', 12.99, 50, '1949-06-08'),
('Beloved', 2, 'Historical Fiction', 14.99, 30, '1987-09-02'),
('Norwegian Wood', 3, 'Literary Fiction', 11.99, 40, '1987-09-04');
```

## Customers

```sql
INSERT INTO customers (name, email) VALUES
('Alice Johnson', 'alice@example.com'),
('Bob Smith', 'bob@example.com');
```

---

# 7. Verify the Database

View the available tables:

```sql
\dt
```

Expected tables:

```text
authors
books
customers
orders
order_items
```

View the records:

```sql
SELECT * FROM authors;
SELECT * FROM books;
SELECT * FROM customers;
SELECT * FROM orders;
SELECT * FROM order_items;
```

---

# 8. Test SQL Queries

### Find books by genre

```sql
SELECT title, price
FROM books
WHERE genre = 'Dystopian';
```

### Find books with low stock

```sql
SELECT title, stock
FROM books
WHERE stock < 10;
```

### Display books with their authors

```sql
SELECT
    b.title,
    a.name AS author,
    b.genre,
    b.price
FROM books b
JOIN authors a
ON b.author_id = a.id;
```

---

# 9. Configure Environment Variables

Create a `.env` file in the root of the backend project:

```text
.env
```

Add:

```env
DB_HOST=your-rds-endpoint.amazonaws.com
DB_PORT=5432
DB_USER=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=bookstore
PORT=3000
```

Replace the values with your actual RDS credentials.

### Important

Never commit `.env` to GitHub.

Add the following to `.gitignore`:

```text
node_modules/
.env
```

---

# 10. Configure the Database Connection

The backend uses the `pg` package to connect to PostgreSQL.

Example `db.js`:

```javascript
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

module.exports = pool;
```

---

# 11. Start the Backend

Start the backend server:

```bash
npm start
```

For development:

```bash
npm run dev
```

The server should run on:

```text
http://localhost:3000
```

Expected output:

```text
Server running on port 3000
```

---

# 12. Test the Backend API

## Get All Authors

```http
GET /authors
```

```bash
curl http://localhost:3000/authors
```

---

## Get All Books

```http
GET /books
```

```bash
curl http://localhost:3000/books
```

Example response:

```json
[
    {
        "id": 1,
        "title": "1984",
        "author_id": 1,
        "genre": "Dystopian",
        "price": "12.99",
        "stock": 50,
        "published_date": "1949-06-08",
        "author_name": "George Orwell"
    }
]
```

---

## Filter Books by Genre

```http
GET /books?genre=Dystopian
```

```bash
curl "http://localhost:3000/books?genre=Dystopian"
```

---

# 13. Create a New Book

```http
POST /books
```

Example:

```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Kafka on the Shore",
    "author_id": 3,
    "genre": "Literary Fiction",
    "price": 13.99,
    "stock": 25,
    "published_date": "2002-09-12"
  }'
```

---

# 14. Place an Order

```http
POST /orders
```

Example:

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "items": [
      {
        "book_id": 1,
        "quantity": 2
      },
      {
        "book_id": 3,
        "quantity": 1
      }
    ]
  }'
```

Example response:

```json
{
    "order_id": 1,
    "total": 37.97
}
```

---

# 15. Get Order Details

```http
GET /orders/:id
```

Example:

```bash
curl http://localhost:3000/orders/1
```

Example response:

```json
{
    "id": 1,
    "customer_id": 1,
    "customer_name": "Alice Johnson",
    "email": "alice@example.com",
    "order_date": "2026-03-09T12:00:00.000Z",
    "total": 37.97,
    "items": [
        {
            "book_id": 1,
            "title": "1984",
            "quantity": 2,
            "price": 12.99
        },
        {
            "book_id": 3,
            "title": "Norwegian Wood",
            "quantity": 1,
            "price": 11.99
        }
    ]
}
```

---

# 16. Order Processing

When a customer places an order, the backend performs the following operations:

```text
Place Order
     │
     ▼
Create Order
     │
     ▼
Check Book
     │
     ▼
Validate Stock
     │
     ▼
Calculate Price
     │
     ▼
Create Order Item
     │
     ▼
Reduce Stock
     │
     ▼
Calculate Total
     │
     ▼
Update Order
     │
     ▼
COMMIT
```

If any operation fails:

```text
Error
  │
  ▼
ROLLBACK
  │
  ▼
No incomplete order is saved
```

This ensures that order processing remains consistent.

---

# 17. Frontend Setup

The frontend is located inside:

```text
frontend/
```

The structure is:

```text
frontend/
│
├── index.html
├── books.html
│
├── css/
│   └── style.css
│
└── js/
    └── app.js
```

The frontend uses JavaScript to retrieve book information from the backend.

---

# 18. Connect the Frontend to the API

The frontend uses the Fetch API.

Example:

```javascript
const API_URL = "http://localhost:3000";

async function getBooks() {
    const response = await fetch(`${API_URL}/books`);
    const books = await response.json();

    displayBooks(books);
}
```

The data returned by the backend is then displayed dynamically on the books page.

---

# 19. Frontend Data Flow

```text
User
 │
 ▼
Frontend
 │
 ▼
JavaScript Fetch API
 │
 ▼
Express REST API
 │
 ▼
PostgreSQL
 │
 ▼
AWS RDS
 │
 ▼
Database Result
 │
 ▼
Express API
 │
 ▼
JavaScript
 │
 ▼
Frontend
 │
 ▼
User
```

---

# 20. Run the Frontend

Make sure the backend is running first:

```bash
npm start
```

Then open the `frontend` folder in Visual Studio Code.

Using the **Live Server** extension, open:

```text
frontend/index.html
```

or:

```text
frontend/books.html
```

The frontend will communicate with:

```text
http://localhost:3000
```

---

# 🧪 Testing

The application can be tested using:

- Browser
- cURL
- Postman
- Visual Studio Code
- PostgreSQL `psql`

### Test Backend

```bash
curl http://localhost:3000/books
```

### Test Authors

```bash
curl http://localhost:3000/authors
```

### Test Frontend

Open the frontend using Live Server and confirm that books are loaded from the backend.

---

# 🔐 Security Considerations

The application uses environment variables to prevent database credentials from being hard-coded.

Sensitive information should never be committed to GitHub.

The following should remain private:

```text
.env
Database password
AWS credentials
Private keys
```

For production environments, additional security should be implemented:

- HTTPS
- Authentication
- Authorization
- Input validation
- Rate limiting
- Restricted RDS access
- Private database networking
- AWS Secrets Manager or another secure secrets solution

---

# ☁️ AWS Infrastructure

The project uses Amazon RDS for PostgreSQL database hosting.

Main AWS components:

### Amazon RDS

Managed PostgreSQL database used to store bookstore data.

### VPC

Provides the networking environment for the RDS instance.

### Security Groups

Control network access to the PostgreSQL database.

### PostgreSQL

The database uses port:

```text
5432
```

The application connects to the RDS endpoint using the credentials stored in `.env`.

---

# 🐛 Troubleshooting

## Database Does Not Exist

If you receive:

```text
database "bookstore" does not exist
```

Create the database:

```sql
CREATE DATABASE bookstore;
```

Then connect:

```sql
\c bookstore
```

---

## Connection Timeout

If `psql` returns a connection timeout, check:

- RDS instance status
- RDS endpoint
- Security Group rules
- Port `5432`
- Public accessibility
- Network configuration
- Database credentials

---

## CORS Error

Install CORS:

```bash
npm install cors
```

Then add to the Express server:

```javascript
const cors = require("cors");

app.use(cors());
```

Restart the backend after making the change.

---

## Frontend Cannot Load Books

Check the following:

1. Backend server is running.
2. RDS database is available.
3. `/books` endpoint works.
4. API URL in `app.js` is correct.
5. CORS is enabled.
6. Browser console contains no JavaScript errors.

Test the API directly:

```bash
curl http://localhost:3000/books
```

---

# 📈 Future Improvements

Possible future improvements include:

- User authentication
- Customer registration
- Shopping cart
- Search functionality
- Advanced book filtering
- Checkout interface
- Order history
- Admin dashboard
- Book management interface
- Author management interface
- Book reviews
- Book ratings
- Payment integration
- Pagination
- API authentication
- Cloud deployment
- HTTPS
- Automated testing
- CI/CD pipeline

---

# 🎓 Learning Outcomes

This project provided practical experience with:

- REST API development
- Node.js
- Express.js
- PostgreSQL
- SQL
- Relational database design
- Database relationships
- Primary keys
- Foreign keys
- SQL JOIN queries
- Database transactions
- CRUD operations
- JavaScript
- HTML
- CSS
- Fetch API
- API testing
- Git and GitHub
- AWS RDS
- AWS networking
- Security Groups
- Cloud database management

---

# 📌 Conclusion

The Cloud Bookstore demonstrates the integration of a web frontend, RESTful backend API, relational database, and cloud infrastructure into a complete full-stack application.

The frontend communicates with the Express.js API, while the API handles business logic and communicates with PostgreSQL hosted on Amazon RDS.

The project demonstrates practical implementation of **full-stack development, REST APIs, relational databases, transaction processing, and cloud computing using AWS**.

---

# 📄 License

This project is licensed under the MIT License.

---

# 👩🏽‍💻 Author

**MaryJane Benneth**

Computer Science Student | Cloud Computing Enthusiast

Built as a practical full-stack and cloud computing project.  