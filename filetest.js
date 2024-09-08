//fs.writeFile for non-blocking, asynchronous file writes, 
//and fs.writeFileSync when synchronous, 
//blocking file writes are acceptable or necessary.


fs.writeFile('example.txt', 'Hello, world!', (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('File written successfully!');
    }
  });


  const fs = require('fs');

fs.writeFile('message.txt', 'Hello Node.js', 'utf8', (err) => {
  if (err) throw err;
  console.log('File has been saved!');
});

//writefilesync is non blocking code, writefile function is blocking code 
const fs = require('fs');

try {
  fs.writeFileSync('message.txt', 'Hello Node.js', 'utf8');
  console.log('File has been saved!');
} catch (err) {
  console.error('Error:', err);
}
