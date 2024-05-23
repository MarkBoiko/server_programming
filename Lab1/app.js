const fs = require('fs');
const { promisify } = require('util');
const zlib = require('zlib');

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);
const rename = promisify(fs.rename);
const stat = promisify(fs.stat);

const filesDir = './files/';
const archiveDir = './archives/';

// Create a file
async function CreateFileFunc() {
		const filePath = `${filesDir}fresh.txt`;
		try {
				await stat(filePath);
				console.log('CREATE operation failed');
		} catch {
				await writeFile(filePath, 'Свіжий і бадьорий');
		}
}

// Copy files
async function CopyFilesFunc() {
		const source = filesDir;
		const destination = './files_copy';
		try {
				await stat(destination);
				console.log('COPY operation failed');
		} catch {
				await fs.cp(source, destination, { recursive: true }, (err) => {
						if (err) {
								console.log('COPY operation failed');
						}
				});
		}
}

// Rename a file
async function RenameFileFunc() {
		const oldPath = `${filesDir}wrongFilename.txt`;
		const newPath = `${filesDir}properFilename.md`;
		try {
				await stat(newPath);
				console.log('RENAME operation failed');
		} catch {
				try {
						await rename(oldPath, newPath);
				} catch {
						console.log('RENAME operation failed');
				}
		}
}

// Delete a file
async function DeleteFileFunc() {
		const filePath = `${filesDir}fileToRemove.txt`;
		try {
				await unlink(filePath);
		} catch {
				console.log('DELETE operation failed');
		}
}

// List files
async function ListFilesFunc() {
		try {
				const files = await readdir(filesDir);
				files.forEach(file => console.log(file));
		} catch {
				console.log('LIST operation failed');
		}
}

// Read a file
async function ReadFileFunc() {
		const filePath = `${filesDir}fileToRead.txt`;
		try {
				const content = await readFile(filePath, 'utf8');
				console.log(content);
		} catch {
				console.log('READ operation failed');
		}
}

// Stream read a file
function ReadStreamFunc() {
		const filePath = `${filesDir}fileToRead.txt`;
		const readStream = fs.createReadStream(filePath);
		readStream.on('data', chunk => console.log(chunk.toString()));
		readStream.on('error', () => console.log('READ STREAM operation failed'));
}

// Stream write to a file
function WriteStreamFunc(data) {
		const filePath = `${filesDir}fileToWrite.txt`;
		const writeStream = fs.createWriteStream(filePath, { flags: 'wx' });
		writeStream.write(data);
		writeStream.end();
		writeStream.on('error', () => console.log('WRITE STREAM operation failed'));
}

// Compress a file

function CompressFunc() {
		const file = `${filesDir}fileToCompress.txt`;
		const compressedFile = `${archiveDir}archive.gz`;
		
		// Check if the file exists before attempting to read it
		fs.access(file, fs.constants.F_OK, (err) => {
				if (err) {
						console.log('COMPRESS operation failed');
				} else {
						const gzip = zlib.createGzip();
						const source = fs.createReadStream(file);
						const destination = fs.createWriteStream(compressedFile);
						
						source.pipe(gzip).pipe(destination).on('error', () => {
								console.log('COMPRESS operation failed');
						});
				}
		});
}

// Decompress a file
function DecompressFunc() {
		const compressedFile = `${archiveDir}archive.gz`;
		const decompressedFile = `${filesDir}decompressedFile.txt`;
		
		// Check if the archive exists
		fs.access(compressedFile, fs.constants.F_OK, (err) => {
				if (err) {
						console.log('DECOMPRESS operation failed: Archive file does not exist');
						return;
				}
				
				// Check if the target decompressed file already exists
				fs.access(decompressedFile, fs.constants.F_OK, (err) => {
						if (!err) {
								console.log('DECOMPRESS operation failed: Decompressed file already exists');
								return;
						}
						
						// Proceed with decompression
						const source = fs.createReadStream(compressedFile);
						const destination = fs.createWriteStream(decompressedFile);
						const gunzip = zlib.createGunzip();
						
						source.pipe(gunzip).pipe(destination)
						.on('error', (error) => {
								console.error('DECOMPRESS operation failed:', error.message);
						})
						.on('finish', () => {
								console.log('Decompression completed successfully');
						});
				});
		});
}

// Usage example:
async function runOperations() {
		await CreateFileFunc();
		await CopyFilesFunc();
		await RenameFileFunc();
		await DeleteFileFunc();
		await ListFilesFunc();
		await ReadFileFunc();
		ReadStreamFunc();
		WriteStreamFunc('Hello, World!');
		CompressFunc();
		DecompressFunc();
}

runOperations();
