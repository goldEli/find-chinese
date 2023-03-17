import chalk from "chalk";
import ora from "ora";
import fs from "fs";
import path from "path";

export const log = {
  warn: (msg) => {
    console.log("%s", chalk.yellow(msg));
  },
  error: (msg) => {
    console.log("%s", chalk.red(msg));
  },
  suc: (msg) => {
    console.log("%s", chalk.green(msg));
  },
};

export const createLoading = (msg) => {
  const spinner = ora(msg).start();
  return spinner;
};

/**
 * 文件遍历方法
 * @param dirPath 需要遍历的文件路径
 */
export async function getAllFilesByDir(options, callback) {
  const { dirPath, fileExtension } = options;
  fs.readdirSync(dirPath).forEach((fileName) => {
    const filePath = path.join(dirPath, fileName);
    fs.stat(filePath, function (error, stats) {
      if (error) {
        console.error(error);
        return;
      }
      const isFile = stats.isFile();
      const isDir = stats.isDirectory();
      if (isFile) {
        if (fileExtension.some((item) => filePath.endsWith(item))) {
          callback(filePath);
        }
      }
      if (isDir) {
        getAllFilesByDir(
          {
            dirPath: filePath,
            fileExtension,
          },
          callback
        );
      }
    });
  });
}

async function checkCodeHasChinese(code, filename) {
  const ast = codeToAst(code);
  const res = await handleAst(ast);
  if (res) {
    // console.log(JSON.stringify(ast));
    console.log("此文件存在中文", filename);
  }
}

export function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      resolve(data);
    });
  });
}

export function getFileType(fileName) {
  if (fileName.endsWith(".ts")) {
    return "ts";
  }
  if (fileName.endsWith(".vue")) {
    return "vue";
  }
  if (fileName.endsWith(".js")) {
    return "js";
  }
  if (fileName.endsWith(".tsx")) {
    return "tsx";
  }
  console.log(chalk.red(`${fileName},文件类型不支持`));
  return "unknown";
}
