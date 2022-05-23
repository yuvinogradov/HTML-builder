const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const destinationPath = path.join(__dirname, 'files-copy');
const originPath = path.join(__dirname, 'files');

async function copyDir(originPath, destinationPath) {
  const removePromises = [];

  fs.readdir(destinationPath, (err, files) => {
    if (files) {
      files.forEach(
        file => {
          removePromises.push(fsPromises.unlink(path.join(destinationPath, file)));
        }
      );
    }
  }
  );


  Promise.all(removePromises)
    .then(() => {
      // console.log('all files deleted');
      return fsPromises.mkdir(destinationPath, { recursive: true });
    })
    // .then(() => {
    //   console.log('folder created');
    // })
    .then(() => {
      const copyFilePromises = [];
      fs.readdir(originPath, (err, files) => {
        files.forEach(
          file => {
            const originFilePath = path.join(originPath, file);
            const destinationFilePath = path.join(destinationPath, file);

            copyFilePromises.push(fsPromises.copyFile(originFilePath, destinationFilePath));
          }
        );
        return Promise.all(copyFilePromises);
      }
      );

    })
    .then(console.log('done'))
    .catch(error => console.log(error));
}

copyDir(originPath, destinationPath);

