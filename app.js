//Book class
class Book {
    constructor(title, author, isbn) {
      this.title = title;
      this.author = author;
      this.isbn = isbn;
    }
}

//UI class - handle UI tasks
class UI {
    static displayBooks() {

        const books = Store.getBooks();

        books.forEach(book => UI.addBookToList(book))
    }

    static addBookToList(book) {
        const list = document.getElementById('book-list');
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row)
    }

    static  showAlert(msg, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(msg));

        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');

        container.insertBefore(div, form);

        //Remove after 2 sec;
        setTimeout(() => document.querySelector('.alert').remove(), 2000);
    }

    static clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }

    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }
}

//Store class - handles storage (local storage)
class Store {
    static getBooks() {
        let books;

        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books))
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1)
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

//Event display book
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event add a book
document.getElementById('book-form').addEventListener('submit', e => {
    //Prevent default value
    e.preventDefault();
    //Get form values
    const title = document.querySelector("#title").value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //Validation
    if (title === '' || author === '' || isbn === '') {
       UI.showAlert('Please fill in all fields', 'danger')
    } else {
        // Instantiate book
        const book = new Book(title, author, isbn);

        //Add book to UI
        // console.log(book);
        UI.addBookToList(book);

        //Show success msg
        UI.showAlert('Book added', 'success')

        //Add book to local storage
        Store.addBook(book);

        //Clear fields
        UI.clearFields();
    }
})


//Event remove a book

document.querySelector('#book-list').addEventListener('click', e => {
    //Remove book from UI
    UI.deleteBook(e.target);
    //Show alert msg
    UI.showAlert('Book Removed!', 'success')
    //Remove book from local storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
})