const fsPromises = require('fs/promises');;
const path = require('path');
const resultFilePath = path.join(__dirname, 'project-dist', 'bundle.css');
const originFolderPath = path.join(__dirname, 'styles');

// console.log(destinationFilePath);
let allStyles = [];

(async () => {
  const fileArr = await fsPromises.readdir(originFolderPath, { withFileTypes: true });


  // fileArr.forEach(file => {
  for (let file of fileArr) {
    const currentFilePath = path.join(originFolderPath, file.name);
    const extension = path.extname(currentFilePath);

    if (extension === '.css') {

      const fileStyles = await fsPromises.readFile(currentFilePath, 'utf8');
      allStyles.push(`${fileStyles}\n`);
    }


  }

  await fsPromises.writeFile(resultFilePath, allStyles.join(''));
})();
