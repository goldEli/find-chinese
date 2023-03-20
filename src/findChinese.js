import chalk from "chalk";
import {
  checkCodeHasChinese,
  getAllFilesByDir,
  getFileType,
  readFile,
} from "./utils";
const compiler = require("@vue/compiler-sfc");

const findChinese = (options) => {
  const { ignoreDirs = '' } = options;
  const rootDir = process.cwd();
  console.log(chalk.gray(`脚本运行的路径:${rootDir}`));

  getAllFilesByDir(
    {
      dirPath: rootDir,
      fileExtension: [".js", ".vue", ".ts", ".tsx", ".jsx"],
      ignoreDirs: ["node_modules"].concat(ignoreDirs.split('|')),
    },
    async (filePath) => {
      const code = await readFile(filePath);
      const fileType = getFileType(filePath);
      if (["ts", "js", "tsx", "jsx"].includes(fileType)) {
        handleTsAndJs(code, filePath);
        return;
      }
      if (["vue"].includes(fileType)) {
        handleVue(code, filePath);
        return;
      }
    }
  );
};

function handleTsAndJs(code, fileName) {
  checkCodeHasChinese(code, fileName);
}

function handleVue(code, fileName) {
  const parsed = compiler.parse(code);

  const compileTemplate = compiler.compileTemplate({
    source: parsed.descriptor.template.content,
  });
  checkCodeHasChinese(compileTemplate.code, fileName);
  if (parsed.descriptor && parsed.descriptor.scriptSetup) {
    const content = parsed.descriptor.scriptSetup.content;
    let compileredScript = compiler.compileScript(parsed.descriptor, {
      source: content,
    });
    checkCodeHasChinese(compileredScript.content, fileName);
  }
}

export default findChinese;
