const API_URL = "http://localhost:3000";


// Online book covers
const bookImages = {
    "1984": "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg",
    "Beloved": "https://covers.openlibrary.org/b/isbn/9781400033416-L.jpg",
    "Norwegian Wood": "https://covers.openlibrary.org/b/isbn/9780375704024-L.jpg"
};


// =========================
// GET BOOKS
// =========================

async function getBooks() {

    const booksContainer =
        document.getElementById("books-container");

    try {

        const response =
            await fetch(`${API_URL}/books`);

        if (!response.ok) {
            throw new Error("Failed to fetch books");
        }

        const books =
            await response.json();

        displayBooks(books);

    } catch (error) {

        console.error(error);

        booksContainer.innerHTML = `
            <p class="error">
                Unable to load books.
                Please make sure the backend server is running.
            </p>
        `;
    }
}


// =========================
// DISPLAY BOOKS
// =========================

function displayBooks(books) {

    const booksContainer =
        document.getElementById("books-container");

    if (books.length === 0) {

        booksContainer.innerHTML = `
            <p>No books available.</p>
        `;

        return;
    }

    booksContainer.innerHTML = "";


    books.forEach(book => {

        const bookCard =
            document.createElement("div");

        bookCard.className = "book-card";


        const image =
            bookImages[book.title];


        bookCard.innerHTML = `

            <div class="book-image">

                <img
                    src="${image}"
                    alt="${book.title} book cover"
                >

            </div>


            <div class="book-info">

                <h2>${book.title}</h2>

                <p>
                    <strong>Author:</strong>
                    ${book.author_name || "Unknown"}
                </p>

                <p>
                    <strong>Genre:</strong>
                    ${book.genre || "Not specified"}
                </p>

                <p>
                    <strong>Price:</strong>
                    ₦${Number(book.price).toLocaleString()}
                </p>

                <p>
                    <strong>Stock:</strong>
                    ${book.stock}
                </p>

                <p>
                    <strong>Published:</strong>
                    ${
                        book.published_date
                            ? new Date(book.published_date)
                                .toLocaleDateString()
                            : "Not specified"
                    }
                </p>

                <button
                    class="order-button"
                    onclick="orderBook(${book.id}, '${book.title}', ${book.stock})"
                >
                    Order Book
                </button>

            </div>
        `;


        booksContainer.appendChild(bookCard);

    });
}


// =========================
// ORDER BOOK
// =========================

async function orderBook(bookId, bookTitle, stock) {

    // Check stock
    if (stock <= 0) {

        alert("Sorry, this book is out of stock.");

        return;
    }


    // Ask for customer ID
    const customerId =
        prompt("Enter your Customer ID:");

    if (!customerId) {
        return;
    }


    // Ask for quantity
    const quantity =
        prompt(`How many copies of "${bookTitle}" would you like?`);


    if (!quantity) {
        return;
    }


    const quantityNumber =
        Number(quantity);


    // Validate quantity
    if (
        !Number.isInteger(quantityNumber) ||
        quantityNumber <= 0
    ) {

        alert("Please enter a valid quantity.");

        return;
    }


    if (quantityNumber > stock) {

        alert(`Only ${stock} copies are available.`);

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/orders`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    customer_id: Number(customerId),

                    items: [
                        {
                            book_id: bookId,
                            quantity: quantityNumber
                        }
                    ]

                })
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error || "Unable to place order"
            );
        }


        alert(
            `Order successful! 🎉\n\n` +
            `Book: ${bookTitle}\n` +
            `Quantity: ${quantityNumber}\n` +
            `Order ID: ${data.order_id}\n` +
            `Total: ₦${Number(data.total).toLocaleString()}`
        );


        // Refresh books so stock updates
        getBooks();


    } catch (error) {

        console.error(error);

        alert(
            `Order failed: ${error.message}`
        );
    }
}


// =========================
// LOAD BOOKS
// =========================

if (
    document.getElementById("books-container")
) {

    getBooks();

}