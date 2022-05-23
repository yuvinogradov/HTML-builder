const fs = require('fs');
const path = require('path');
const output = fs.createWriteStream(path.join(__dirname, 'destination.txt'));
const { stdin, stdout } = process;


stdin.on('data', chunk => {
  const myBuffer = Buffer.from(chunk, 'utf-8');

  if (myBuffer.toString().trim() === 'exit') {
    process.exit(0);
  }
  output.write(chunk);
});

function handle() {
  process.exit(0);
}

process.on('SIGINT', handle);
process.on('exit', () => stdout.write('Удачи в изучении Node.js!'));
stdout.write('Вводите текст. Для выхода наберите в новой строке exit или нажмите Ctrl+C\n');

