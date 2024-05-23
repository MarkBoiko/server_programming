const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const booksFilePath = path.join(__dirname, 'books.json');

app.use(express.json());

// Обслуговування статичних файлів (для обробки файлів, таких як index.html)
app.use(express.static(path.join(__dirname)));

// Маршрут для повернення index.html
app.get('/', (req, res) => {
		res.sendFile(path.join(__dirname, 'index.html'));
});

// Читання всіх книг
app.get('/books', (req, res) => {
		fs.readFile(booksFilePath, (err, data) => {
				if (err) {
						res.status(500).send('Помилка читання файлу');
				} else {
						res.send(JSON.parse(data));
				}
		});
});

// Читання книги за ID
app.get('/books/:id', (req, res) => {
		const bookId = parseInt(req.params.id);
		fs.readFile(booksFilePath, (err, data) => {
				if (err) {
						res.status(500).send('Помилка читання файлу');
				} else {
						const books = JSON.parse(data);
						const book = books.find(b => b.id === bookId);
						if (book) {
								res.send(book);
						} else {
								res.status(404).send('Книга не знайдена');
						}
				}
		});
});

// Створення нової книги
app.post('/books', (req, res) => {
		const newBook = req.body;
		fs.readFile(booksFilePath, (err, data) => {
				if (err) {
						res.status(500).send('Помилка читання файлу');
				} else {
						const books = JSON.parse(data);
						newBook.id = books.length ? books[books.length - 1].id + 1 : 1;
						books.push(newBook);
						fs.writeFile(booksFilePath, JSON.stringify(books, null, 2), (err) => {
								if (err) {
										res.status(500).send('Помилка запису файлу');
								} else {
										res.status(201).send(newBook);
								}
						});
				}
		});
});

// Оновлення книги за ID
app.put('/books/:id', (req, res) => {
		const bookId = parseInt(req.params.id);
		const updatedBook = req.body;
		fs.readFile(booksFilePath, (err, data) => {
				if (err) {
						res.status(500).send('Помилка читання файлу');
				} else {
						let books = JSON.parse(data);
						const bookIndex = books.findIndex(b => b.id === bookId);
						if (bookIndex !== -1) {
								books[bookIndex] = { ...books[bookIndex], ...updatedBook };
								fs.writeFile(booksFilePath, JSON.stringify(books, null, 2), (err) => {
										if (err) {
												res.status(500).send('Помилка запису файлу');
										} else {
												res.send(books[bookIndex]);
										}
								});
						} else {
								res.status(404).send('Книга не знайдена');
						}
				}
		});
});

// Видалення книги за ID
app.delete('/books/:id', (req, res) => {
		const bookId = parseInt(req.params.id);
		fs.readFile(booksFilePath, (err, data) => {
				if (err) {
						res.status(500).send('Помилка читання файлу');
				} else {
						let books = JSON.parse(data);
						const bookIndex = books.findIndex(b => b.id === bookId);
						if (bookIndex !== -1) {
								books.splice(bookIndex, 1);
								fs.writeFile(booksFilePath, JSON.stringify(books, null, 2), (err) => {
										if (err) {
												res.status(500).send('Помилка запису файлу');
										} else {
												res.sendStatus(204);
										}
								});
						} else {
								res.status(404).send('Книга не знайдена');
						}
				}
		});
});

// Запуск сервера
app.listen(port, () => {
		console.log(`Сервер працює за адресою http://localhost:${port}`);
});
