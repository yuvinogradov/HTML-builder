const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err)
    console.log(err);
  else {
    files.forEach(
      async (file) => {

        const name = path.parse(file.name).name;
        const ext = path.parse(file.name).ext.slice(1);

        if (file.isFile()) {

          try {
            const stats = await fsPromises.stat(path.join(folderPath, file.name));
            console.log(`${name} - ${ext} - ${Math.round(stats.size * 1000 / 1024) / 1000}kb`);
          }
          catch (error) {
            console.log(error);
          }
        }
      }
    );
  }
});
