const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const zlib = require('zlib');

// Шлях до папки з даними
const dataDir = path.join(__dirname, 'data');

// Функція для читання файлів
const readFile = (filePath, res, contentType, isDownload = false) => {
		fs.readFile(filePath, (err, data) => {
				if (err) {
						res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
						res.end('<h1>Сторінку не знайдено</h1>');
				} else {
						const headers = { 'Content-Type': `${contentType}; charset=utf-8` };
						if (isDownload) {
								headers['Content-Disposition'] = `attachment; filename="${path.basename(filePath)}"`;
						}
						res.writeHead(200, headers);
						res.end(data);
				}
		});
};

// Створення сервера
const server = http.createServer((req, res) => {
		if (req.url === '/') {
				res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
				res.end('<h1>Сервер на Node.js [Прізвище Ім’я По-батькові]</h1>');
		} else if (req.url === '/about') {
				res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
				res.end('<h1>Про нас</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>');
		} else if (req.url === '/getdata') {
				const data = {
						date: new Date().toISOString(),
						user: os.userInfo().username
				};
				res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
				res.end(JSON.stringify(data));
		} else if (req.url === '/myfile') {
				readFile(path.join(dataDir, 'file1.txt'), res, 'text/plain');
		} else if (req.url === '/mydownload') {
				readFile(path.join(dataDir, 'file2.txt'), res, 'text/plain', true);
		} else if (req.url === '/myarchive') {
				const archivePath = path.join(dataDir, 'file1.txt.gz');
				fs.access(archivePath, fs.constants.F_OK, (err) => {
						if (err) {
								const inputFilePath = path.join(dataDir, 'file1.txt');
								const outputFilePath = archivePath;
								const gzip = zlib.createGzip();
								const input = fs.createReadStream(inputFilePath);
								const output = fs.createWriteStream(outputFilePath);
								
								input.pipe(gzip).pipe(output).on('finish', () => {
										readFile(outputFilePath, res, 'application/gzip', true);
								});
						} else {
								readFile(archivePath, res, 'application/gzip', true);
						}
				});
		} else {
				res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
				res.end('<h1>Сторінку не знайдено</h1>');
		}
});

// Запуск сервера
server.listen(3000, () => {
		console.log('Сервер працює за адресою http://localhost:3000');
});
