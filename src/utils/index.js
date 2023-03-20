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
  normal: (msg) => {
    console.log("%s", chalk.gray(msg));
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
      if (isFile && !ignoreDirs.includes(fileName)) {
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
  // log.normal(`正在检测：${fileName}`);
  // console.log(code);
  // console.log(code);
  const ast = codeToAst(code);
  // console.log(ast);
  await handleAst(ast);
  log.suc(`👉️ 文件包含中文：${fileName}`);
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
          const ast = codeToAst(node.value.cooked);
          // 过滤 jsx 中出现的注释
          if (ast.comments.length > 0) {
            return;
          }
          resolve(true);
        }
      },
      JSXText({ node }) {
        if (node && isChinese(node.value)) {
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
    // sourceType: "script",
    // other babel config
    presets: [],
    plugins: [
      //   "vue",
      // ref: https://github.com/babel/babel/issues/14871
      ["typescript"],
      // "jsx", // enable jsx
      // "classProperties",
      // "dynamicImport",
      // "optionalChaining",
      // "decorators-legacy",
      // "asyncDoExpressions ",
      // "asyncGenerators",

      "jsx", // enable jsx
      "classProperties",
      "dynamicImport",
      "optionalChaining",
      "decorators-legacy",
    ],
  });
  return ast;
}
