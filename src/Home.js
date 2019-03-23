import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import BookShelf from './components/BookShelf'
import {getAll, update} from './BooksAPI'


export default class Home extends Component {
	constructor(props){
		super(props)
		this.state = {
			books: []
		}
	}

	componentDidMount(){
		this.fetchBooks()
	}

	filterBooks(shelf){
		return this.state.books.filter((book) => book.shelf === shelf)
	}
  
	fetchBooks(){
		getAll().then((book) => {
			this.setState({books: book})
		})
	}

	updateBook(book, bookShelf){
		let books = this.state.books;
		books.forEach((oldBook, ind) => {
			if (oldBook.id === book.id){
				books[ind].shelf = bookShelf;
			}
		})
		this.setState({books: books});
	}
  
	updateHandler(book, bookShelf){
		this.updateBook(book, bookShelf)
		update(book, bookShelf).then(() => console.log('Book Updated!'));
	}


	render() {
		return (
			<div className="list-books">
				<div className="list-books-title">
					<h1>MyReads</h1>
				</div>

				<div className="list-books-content">
					<div>
						<BookShelf caption="Currently Reading" books={this.filterBooks('currentlyReading')}
							handler={this.updateHandler.bind(this)}/>
						<BookShelf caption="Want to Read" books={this.filterBooks('wantToRead')}
							handler={this.updateHandler.bind(this)}/>
						<BookShelf caption="Read" books={this.filterBooks('read')}
							handler={this.updateHandler.bind(this)}/>
					</div>
				</div>

				<div className="open-search">
					<Link to='/search'>Add a book</Link>
				</div>
			</div>
		)
	}
}
