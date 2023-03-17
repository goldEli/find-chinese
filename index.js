import { createProject } from "./src/createProject";
import { createWXConfig } from "./src/createWXConfig";
import arg from "arg";

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--npm": Boolean,
      "--help": Boolean,
      "--branch": String,
      "--useHTTPS": Boolean,
      "-n": "--npm",
      "-h": "--help",
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    useNpm: args["--npm"],
    help: args["--help"],
    branch: args["--branch"],
    useHTTPS: args["--useHTTPS"],
    command: args._[0],
  };
}

export async function run(args) {
  let options = parseArgumentsIntoOptions(args);
  if (options.help) {
    console.log("Usage: lwj <command> [options]");
    console.log();
    console.log("Options:");
    console.log("\t--help\toutput usage information");
    console.log("\t--npm\tuse npm (use yarn by default)");
    console.log();
    console.log("Commands:");
    console.log("\tcreate\t创建渐进式taro项目");
    console.log("\t\t --branch 分支名字，默认 develop 分支");
    console.log("\t\t --useHTTPS，使用 https clone 仓库，默认ssh");
    console.log();
    console.log("\twatch\t文件监听");
    console.log("\tconfigWX\t创建/修改 微信开发配置");
    return;
  }
  switch (options.command) {
    case "create":
      await createProject(options);
      break;
    case "watch":
      await createProject(options);
      break;
    case "configWX":
      await createWXConfig(options);
      break; 
    default:
      break;
  }
}
