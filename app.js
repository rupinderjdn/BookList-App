// Book class : represents a book
// every time we submit the book it's gonna instantitate an object
class Book {
    constructor(title, author, price) {
        this.title = title;
        this.author = author;
        this.price = price;
    }
}

// UI Class : Handle UI Tasks
// Anything change in the user interface like it's get created or deleted
class UI {
    // we don't have to instantiate the UI class so let's make all the methods static
    static displayBooks() {
        const books = Store.getBooks();
        books.forEach((book) => (UI.addBookToList(book)));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        // we grab the list from the DOM
        const row = document.createElement('tr');
        // we created a new element for it
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.price} only</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>`

        list.appendChild(row);
        // appended our row to the child
    }
    static deleteBooks(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }
    static clearFields() {
        document.querySelector('#title').value = "";
        document.querySelector('#author').value = "";
        document.querySelector('#price').value = "";
    }
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // Make vanish after three seconds
        setTimeout(()=>document.querySelector('.alert').remove(), 3000)
    }
}

// Store Class : handles storage
// in this case it's brower storage so it doesn't go away untill you clear it
class Store{
    static getBooks(){
        // local storage stores in key value pair
        let books;
        if(localStorage.getItem('books') === null){
            books=[];
        }
        else{
            books = JSON.parse(localStorage.getItem('books'));
            // this will be stored as a string so what we need to do is parse it through JSON

        }
        return books;
    }
    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books',JSON.stringify(books));
    }
    static removeBooks(title){
        const books = Store.getBooks();
        books.forEach((book,index)=>{
            // console.log(book.title);
            if(book.title === title){
                // console.log(price);
                books.splice(index,1);
            }
        });

        localStorage.setItem('books',JSON.stringify(books));
    }
}


// Events : Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks())

// Event : Add book
document.querySelector('#book-form').addEventListener('submit', (e) => {

    // Prevent the actual Submit
    e.preventDefault();

    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const price = document.querySelector('#price').value;

    //Validation
    if (title === '' || author === '' || price === '') {
        UI.showAlert('Please fill in all fields','danger')
    }
    else {
        //Instantiate Book
        const book = new Book(title, author, price);

        console.log(book);

        // Add Book to UI
        UI.addBookToList(book); // -> book will get added through this but if we reload then the bookk will dissapear because we haven't persisted it a local storage

        // Add books to local storage
        Store.addBook(book);

        UI.showAlert('Book added succesfully','success');

        // Clear fields
        UI.clearFields();
    }    
});
// Event  : Remove a book
document.querySelector('#book-list').addEventListener('click', (e) => {
    console.log(e.target);
    //Remoce from UI
    UI.deleteBooks(e.target);

    //Remove from Store
    Store.removeBooks(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent);

    //Alert
    UI.showAlert('Book removed','success')
});