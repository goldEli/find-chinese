import fs from "fs";
import execa from "execa";
import { log, createLoading } from "./utils";
import path from "path";
import ncp from "ncp";
import * as inquirer from "inquirer";
import chalk from "chalk";
import { promisify } from "util";
const copy = promisify(ncp);

const projectDefaultJsonPath = path.resolve(
  process.cwd(),
  "./src/project.config.default.json"
);
const projectJsonPath = path.resolve(
  process.cwd(),
  "./src/project.config.json"
);
const extDefaultJsonPath = path.relative(
  process.cwd(),
  "./src/ext.default.json"
);
const extJsonPath = path.relative(process.cwd(), "./src/ext.json");
const promptList = [
  {
    type: "list",
    message: "选择开发环境：",
    name: "env",
    choices: ["dev", "staging", "prod"],
  },
  {
    type: "input",
    message: "请输入租户 code 码：",
    name: "code",
    default: "o",
  },
];
export async function createWXConfig(options) {
  const answers = await inquirer.prompt(promptList);
  console.log(
    `${chalk.blue(
      `配置文件基于, ${answers.env}环境，${answers.code}租户生成。`
    )}`
  );
  log.suc("");
  log.suc("开始创建配置文件。。。");
  log.suc("");
  const loading = createLoading("创建 project.config.json");
  await copy(projectDefaultJsonPath, projectJsonPath, {
    clobber: false,
  });

  loading.succeed();

  const loading1 = createLoading("创建 exj.config.json");

  const json = await readFile(extDefaultJsonPath).catch(() => {
    loading1.fail();
  });
  const data = JSON.parse(json.toString());
  const domain = answers.env === "prod" ? "sales" : `sales-${answers.env}`
  data.ext.DOMAIN = `http://cloud.${domain}.liweijia.com`
  data.ext.APP_TENANT_CODE = answers.code;
  data.ext.WX_CLIENT_APP_CODE = `sales-${answers.code}`;

  const str = JSON.stringify(data);
  await writeFile(extJsonPath, str).catch(() => {
    loading1.fail();
  });
  loading1.succeed();
  log.suc("");
  log.suc("配置文件创建完成。");
  log.suc("");
}

function readFile(filename) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filename, function (err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function writeFile(filename, str) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(filename, str, function (err) {
      if (err) reject(err);
      else resolve();
    });
  });
}
