import chalk from "chalk";
import ora from "ora";
import fs from "fs";
import path from "path";
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

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
  const { dirPath, fileExtension, ignoreDirs } = options;
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
      if (isDir && !ignoreDirs.includes(fileName)) {
        getAllFilesByDir(
          {
            dirPath: filePath,
            fileExtension,
            ignoreDirs,
          },
          callback
        );
      }
    });
  });
}

export async function checkCodeHasChinese(code, fileName) {
  const ast = codeToAst(code);
  await handleAst(ast);
  console.log(`以下文件包含中文：${fileName}`);
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

/**
 * 遍历语法树，将中文替换成变量
 * @param {*} ast
 */
function handleAst(ast) {
  return new Promise((resolve, reject) => {
    // 遍历语法树
    traverse(ast, {
      StringLiteral({ node }) {
        if (node && isChinese(node.value)) {
          resolve(true);
        }
      },
      TemplateElement({ node }) {
        if (
          node &&
          node.value &&
          node.value.cooked &&
          isChinese(node.value.cooked)
        ) {
          resolve(true);
        }
      },
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

function isChinese(str) {
  var filter = /[\u4E00-\u9FA5\uF900-\uFA2D]{1,}/;
  if (filter.test(str)) {
    return true;
  } else {
    return false;
  }
}

/**
 * 代码字符串转成语法树
 * @param {*} code
 */
function codeToAst(code) {
  const ast = parser.parse(code, {
    sourceType: "module", // 识别ES Module
    plugins: [
      "jsx", // enable jsx
      //   "vue",
      "typescript",
      "classProperties",
    ],
  });
  return ast;
}
