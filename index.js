import findChinese from "./src/findChinese.js";
import arg from "arg";
import chalk from "chalk";

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "-h": Boolean,
      "--i": String,
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  const strIgnore = args["--i"];

  const ignoreDirsAndFiles = strIgnore ? strIgnore.split("|") : [];
  return {
    ignoreDirsAndFiles: ignoreDirsAndFiles,
    help: args["-h"],
    suffix: args["--suffix"],
    // command: args._[0],
  };
}

export async function run(args) {
  let options = parseArgumentsIntoOptions(args);
  console.log(chalk.green("开始检测包含文件的中文..."));
  if (options.help) {
    console.log("Usage: find-chinese [options]");
    console.log();
    console.log("Options:");
    console.log("\t--help\toutput usage information");
    // console.log("\t--npm\tuse npm (use yarn by default)");
    console.log();
    // console.log("Commands:");
    // console.log("\tcreate\t创建渐进式taro项目");
    console.log(
      "\t\t --i 忽略的文件夹, 默认过滤 node_modules 文件夹 中竖向 'dir|src'"
    );
    console.log();
    // console.log("\twatch\t文件监听");
    // console.log("\tconfigWX\t创建/修改 微信开发配置");
    return;
  }
  findChinese(options);
}
