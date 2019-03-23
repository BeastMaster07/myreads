import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import Book from './components/Book'
import { search, getAll, update } from './BooksAPI'


export default class Search extends Component {
	constructor(props) {
		super(props)
		this.state = {
			books: [],
          	allBooks: [],
          	reqCount: 0,
			maxRequest: 0
		}
	}

	componentDidMount() {
		getAll().then((data) => {
			this.setState({ allBooks: data })
		})
	}

	setSearchState(books, currentRequest){
		if (currentRequest < this.state.maxRequest){
			return;
		}
		this.setState({books: books, maxRequest: currentRequest})
	}

	changeInput(e){
		const flag = e.target.value.trim();
		this.find(flag);
	}
  
  	fetchBook(findBook){
		let books = this.state.allBooks;
		for (let book in books){
			if (books[book].id === findBook.id){
				return books[book];
			}
		}
		return findBook;
	}
  
  	find(term){
		let currentRequest = this.state.reqCount + 1;
		this.setState({reqCount: currentRequest})
	
		if (!term){
			this.setSearchState([], currentRequest)
			return;
		}
		search(term).then((books) => {
			this.setSearchState(books, currentRequest)
		}).catch (() => {
			this.setSearchState([], currentRequest)
		})
	}

	updateHandler(book, shelf) {
		this.updateBook(book, shelf);
		update(book, shelf);
	}

	updateBook(book, shelf) {
		let books = this.state.allBooks;
		let found = false;
		books.forEach((oldBook, ind) => {
			if (oldBook.id === book.id) {
				books[ind].shelf = shelf;
				found = true;
			}
		})
		if (!found){
			books[book.id] = JSON.parse(JSON.stringify(book));
			books[book.id].shelf = shelf;
		}
		this.setState({ allBooks: books })
	}

	render() {
		let books = this.state.books.map((book) => (
			<Book key={book.id} {...this.fetchBook(book)} handler={this.updateHandler.bind(this)} />
		));
		return (
			<div className="search-books">
				<div className="search-books-bar">
					<Link className="close-search" to='/'>Close</Link>
					<div className="search-books-input-wrapper">
						<input onChange={this.changeInput.bind(this)} type="text" 
							placeholder="Search by title or by Author" />
					</div>
				</div>
				<div className="search-books-results">
					<ol className="books-grid">
						{books}
					</ol>
				</div>
			</div>
		)
	}
}
