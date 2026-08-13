const express = require('express');
const pool = require('./db');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Middleware
app.use(express.json());
app.use(cors());


// ==================== AUTHORS ====================

// Get all authors
app.get('/authors', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM authors ORDER BY id'
        );

        res.json(result.rows);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});


// Create an author
app.post('/authors', async (req, res) => {
    const { name, bio } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO authors (name, bio) VALUES ($1, $2) RETURNING *',
            [name, bio]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});


// ==================== BOOKS ====================

// Get all books
app.get('/books', async (req, res) => {
    const { genre } = req.query;

    try {

        let query = `
            SELECT 
                b.*,
                a.name AS author_name
            FROM books b
            LEFT JOIN authors a
            ON b.author_id = a.id
        `;

        const params = [];

        // Optional genre filter
        if (genre) {
            query += ' WHERE b.genre = $1';
            params.push(genre);
        }

        query += ' ORDER BY b.id';

        const result = await pool.query(query, params);

        res.json(result.rows);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});


// Create a book
app.post('/books', async (req, res) => {

    const {
        title,
        author_id,
        genre,
        price,
        stock,
        published_date
    } = req.body;

    try {

        const result = await pool.query(
            `
            INSERT INTO books
            (title, author_id, genre, price, stock, published_date)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `,
            [
                title,
                author_id,
                genre,
                price,
                stock,
                published_date
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });
    }
});


// ==================== ORDERS ====================

// Place an order
app.post('/orders', async (req, res) => {

    const {
        customer_id,
        items
    } = req.body;

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        // Create the order
        const orderResult = await client.query(
            'INSERT INTO orders (customer_id) VALUES ($1) RETURNING *',
            [customer_id]
        );

        const order = orderResult.rows[0];

        let total = 0;

        // Process order items
        for (const item of items) {

            // Get book price and stock
            const bookResult = await client.query(
                'SELECT price, stock FROM books WHERE id = $1',
                [item.book_id]
            );

            const book = bookResult.rows[0];

            if (!book) {
                throw new Error(
                    `Book ${item.book_id} not found`
                );
            }

            if (book.stock < item.quantity) {
                throw new Error(
                    `Insufficient stock for book ${item.book_id}`
                );
            }

            const itemTotal =
                Number(book.price) * item.quantity;

            total += itemTotal;

            // Add order item
            await client.query(
                `
                INSERT INTO order_items
                (order_id, book_id, quantity, price)
                VALUES ($1, $2, $3, $4)
                `,
                [
                    order.id,
                    item.book_id,
                    item.quantity,
                    book.price
                ]
            );

            // Reduce stock
            await client.query(
                'UPDATE books SET stock = stock - $1 WHERE id = $2',
                [
                    item.quantity,
                    item.book_id
                ]
            );
        }

        // Update order total
        await client.query(
            'UPDATE orders SET total = $1 WHERE id = $2',
            [
                total,
                order.id
            ]
        );

        await client.query('COMMIT');

        res.status(201).json({
            order_id: order.id,
            total: total
        });

    } catch (err) {

        await client.query('ROLLBACK');

        res.status(400).json({
            error: err.message
        });

    } finally {

        client.release();
    }
});


// ==================== GET ORDER ====================

// Get order details
app.get('/orders/:id', async (req, res) => {

    try {

        const orderResult = await pool.query(
            `
            SELECT 
                o.*,
                c.name AS customer_name,
                c.email
            FROM orders o
            JOIN customers c
            ON o.customer_id = c.id
            WHERE o.id = $1
            `,
            [req.params.id]
        );

        if (orderResult.rows.length === 0) {

            return res.status(404).json({
                error: 'Order not found'
            });
        }

        const itemsResult = await pool.query(
            `
            SELECT 
                oi.*,
                b.title
            FROM order_items oi
            JOIN books b
            ON oi.book_id = b.id
            WHERE oi.order_id = $1
            `,
            [req.params.id]
        );

        res.json({
            ...orderResult.rows[0],
            items: itemsResult.rows
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });
    }
});


// ==================== START SERVER ====================

app.listen(process.env.PORT, () => {

    console.log(
        `Server running on port ${process.env.PORT}`
    );

});