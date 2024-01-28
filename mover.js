// Se instala node js
//Despues se instala https://photostructure.github.io/exiftool-vendored.js/
//Se inicia el proyecto con npm run start 


const ExifTool = require("exiftool-vendored").ExifTool;
const exiftool = new ExifTool({ taskTimeoutMillis: 5000 });
const fs = require("fs");
const path = require("path");

const months = {
  1: "Enero",
  2: "Febrero",
  3: "Marzo",
  4: "Abril",
  5: "Mayo",
  6: "Junio",
  7: "Julio",
  8: "Agosto",
  9: "Septiembre",
  10: "Octubre",
  11: "Noviembre",
  12: "Diciembre",
};

function remplazaSlash(inputString) {
  return inputString.replace(/\\/g, "/");
}

function procesarImagenes(sourceDir, destDir) {
  fs.readdir(sourceDir, function (err, files) {
    if (err) {
      console.error("Error al leer la carpeta fuente:", err);
      return;
    }
    console.log(files);
    // Procesa cada archivo
    files.forEach(async function (file) {
      // Obtiene la ruta completa del archivo de origen
      const sourcePath = path.join(sourceDir, file);

      // Obtiene la información del archivo
      const stats = fs.statSync(sourcePath);

      // Si el archivo es un directorio, ignóralo
      if (stats.isDirectory()) {
        console.log(`"${file}" es un directorio. Ignorando...`);
        return;
      }

      exiftool
        .read(sourceDir + "\\" + file)
        .then((tags /*: Tags */) => {
          //Movera los videos a las carpetas
          console.log(tags.FileType);

          if (tags.CreationDate !== undefined) {
            console.log("Es video");

            const year = tags.CreationDate.year;
            const yearStr = year.toString();
            const month = tags.CreationDate.month;
            const monthName = months[month];
            MoveFile(destDir, yearStr, sourcePath, monthName, file);
          } else {
            if (tags.FileType !== "MOV") {
              // console.log(tags)
              console.log(tags.DateTimeOriginal);
              if (tags.DateTimeOriginal == undefined) {
                //Usa fecha de creacion
                console.log("Es imagen pero usará fecha de creación");

                const year = tags.FileCreateDate.year;
                const yearStr = year.toString();
                const month = tags.FileCreateDate.month;
                const monthName = months[month];
                MoveFile(destDir, yearStr, sourcePath, monthName, file);
              } else {
                //Usa fecha de Captura
                console.log("Es imagen usará fecha de Captura");
                // console.log(tags.DateTimeOriginal) //ok
                const year = tags.DateTimeOriginal.year;
                const yearStr = year.toString();
                const month = tags.DateTimeOriginal.month;
                const monthName = months[month];
                MoveFile(destDir, yearStr, sourcePath, monthName, file);
              }
            }
          }
        })
        .catch((err) => console.error("Something terrible happened: ", err));
    });
  });
  function MoveFile(destDir, yearStr, sourcePath, monthName, file) {
    // Crea la ruta completa de la carpeta de destino
    const destYearDir = path.join(destDir, yearStr);
    const destMonthDir = path.join(destYearDir, monthName);
    const destPath = path.join(destMonthDir, file);

    // Crea la carpeta de destino si no existe
    if (!fs.existsSync(destYearDir)) {
      fs.mkdirSync(destYearDir);
    }
    if (!fs.existsSync(destMonthDir)) {
      fs.mkdirSync(destMonthDir);
    }

    // Mueve el archivo a la carpeta de destino
    fs.renameSync(sourcePath, destPath);
    console.log(`El archivo "${file}" se movió a "${destPath}".`);
  }
}

module.exports = {
  remplazaSlash,
  procesarImagenes,
};
