const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const destinationFolderPath = path.join(__dirname, 'project-dist');
const assetsDestinationPath = path.join(destinationFolderPath, 'assets');
const stylesFileDestinationPath = path.join(destinationFolderPath, 'style.css');
const htmlFileDestinationPath = path.join(destinationFolderPath, 'index.html');
const componentsOriginPath = path.join(__dirname, 'components');
const assetsOriginPath = path.join(__dirname, 'assets');
const stylesOriginPath = path.join(__dirname, 'styles');
const templateHtmlOriginPath = path.join(__dirname, 'template.html');

async function createFolder(folderPath) {
  fsPromises.mkdir(folderPath, { recursive: true });
}

async function writeDataToFile(filePath, data) {
  return await fsPromises.writeFile(filePath, data);
}

async function mergeFiles(originFolderPath, resultFilePath) {
  const dataArr = [];
  const filesNames = await fsPromises.readdir(originFolderPath, { withFileTypes: true });

  for (let file of filesNames) {
    const currentFilePath = path.join(originFolderPath, file.name);
    const ext = path.extname(currentFilePath);

    if (ext === '.css') {
      const currentFileContent = await fsPromises.readFile(currentFilePath, 'utf8');
      dataArr.push(`${currentFileContent}\n`);
    }
  }
  writeDataToFile(resultFilePath, dataArr.join('\n'));
}

async function copyDir(originPath, destinationPath) {
  const removePromises = [];

  await fsPromises.rm(destinationPath, { force: true, recursive: true });


  Promise.all(removePromises)
    .then(() => {
      return fsPromises.mkdir(destinationPath, { recursive: true });
    })
    .then(() => {
      const copyFilePromises = [];
      fs.readdir(originPath, { withFileTypes: true }, (err, files) => {
        files.forEach(
          file => {
            const originFilePath = path.join(originPath, file.name);
            const destinationFilePath = path.join(destinationPath, file.name);

            if (file.isDirectory()) {
              copyDir(originFilePath, destinationFilePath);
            } else {
              copyFilePromises.push(fsPromises.copyFile(originFilePath, destinationFilePath));
            }
          }
        );
        return Promise.all(copyFilePromises);
      }
      );

    })
    .catch(error => console.log(error));
}

async function fillTemplateWithComponents(originPath, destinationFilePath) {
  let templateString = await fsPromises.readFile(templateHtmlOriginPath, 'utf-8');
  const filesArray = await fsPromises.readdir(originPath, { withFileTypes: true });

  for (let file of filesArray) {
    const currentFileContent = await fsPromises.readFile(path.join(originPath, file.name), 'utf-8');
    const fileName = file.name.split('.')[0];
    const regExp = new RegExp(`{{${fileName}}}`, 'g');
    templateString = templateString.replace(regExp, currentFileContent);
  }

  writeDataToFile(destinationFilePath, templateString);
}

async function build() {
  createFolder(destinationFolderPath);
  mergeFiles(stylesOriginPath, stylesFileDestinationPath);
  copyDir(assetsOriginPath, assetsDestinationPath);
  fillTemplateWithComponents(componentsOriginPath, htmlFileDestinationPath);
}


build();