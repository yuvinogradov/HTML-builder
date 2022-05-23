const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const folderPath = path.join(__dirname, 'files-copy');
const folderPath2 = path.join(__dirname, 'files-copy2');


const removeFiles = async function main() {
  console.log('trying to remove files');

  fs.readdir(folderPath, (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(
        async (file) => {

          try {
            await fsPromises.unlink(path.join(folderPath, file));
            console.log(file);
          }
          catch (error) {
            console.log(error);
          }

        }
      );
    }
  });
};

const removeDir = async function main() {
  console.log('trying to remove dir');
  try {
    fsPromises.rmdir(folderPath);
    // console.log('Folder Deleted!');
  } catch (err) {
    console.error(err);
  }
};

const removeFilesFromDir = () => {
  const files = fs.readdir(folderPath);

  files.forEach(file => {
    console.log(file);

    try {
      fs.unlinkSync(path.join(folderPath, file));
      //file removed
      console.log(file, 'removed');

    } catch (err) {
      console.error(err);
    }
  }
  );



};

function dataDeleter() {
  return Promise.all(
    ['confirmed', 'deaths', 'recovered', 'dailyReport'].map(
      file =>
        new Promise((res, rej) => {
          try {
            fs.unlink(`./data/${file}.csv`, err => {
              if (err) throw err;
              console.log(`${file}.csv was deleted`);
            });
            if (file === 'dailyReport') {
              res();
              return;
            }
            fs.unlink(`./data/${file}.json`, err => {
              if (err) throw err;
              console.log(`${file}.json was deleted`);
              res();
            });
          } catch (err) {
            console.error(err);
            rej(err);
          }
        })
    )
  );
}


//removeFilesFromDir();
removeFiles();
removeDir();
fsPromises.mkdir(folderPath2).then(function () {
  console.log('Directory created successfully');
}).catch(function () {
  console.log('failed to create directory');
});