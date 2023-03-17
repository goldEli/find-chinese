import chalk from "chalk";
import { getAllFilesByDir, readFile } from "./utils";

const findChinese = (options) => {
  const rootDir = process.cwd();
  console.log(chalk.gray(`脚本运行的路径:${rootDir}`));

  getAllFilesByDir(
    {
      dirPath: rootDir,
      fileExtension: ["js", "vue", "ts", "tsx"],
    },
    async(filePath) => {
      console.log(filePath);
      const code = await readFile(filePath)
      
    }
  );
};

export default findChinese;
