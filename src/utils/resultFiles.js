const files = [];

const resultFiles = {};

resultFiles.addFile = (file) => {
    files.push(file);
};

resultFiles.getAll = (file) => {
  return files;
};

export default resultFiles;
