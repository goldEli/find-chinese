import fs from "fs";
import execa from "execa";
import { log, createLoading } from "./utils";
import config from "../config";
import * as child_process from 'child_process';

const repositoryName = config.repository.name;
const repositoryDir = config.repository.dir;
async function updateRepo() {
  const loading = createLoading("项目代码更新");
  try {
    const result = await execa("git", ["pull", "--rebase"], {
      cwd: repositoryDir,
    });

    if (result.failed) {
      loading.fail();
      return Promise.reject(new Error("项目代码更新失败"));
    }
    loading.succeed();
  } catch (error) {
    console.error(error);
    loading.fail();
  }
}

// 克隆项目
async function cloneRepo(branch = "develop", useHTTPS = false) {
  const loading = createLoading("项目代码下载");
  const url = useHTTPS ? config.repository.gitUrl : config.repository.gitSSHUrl;
  const commands = ["git", ["clone", "-b", branch, url]];
  // const result = await execa(...commands);
  return new Promise((resolve, reject) => {
    try {
      const s = child_process.spawn(...commands, { stdio: "inherit", stdin: "inherit" });
      s.on("close", () => {
        resolve();
        loading.succeed();
      });
    } catch (error) {
      loading.fail(error);
      reject(new Error("项目代码下载失败"));
    }
  });
}

// 安装依赖
async function install(useNpm) {
  const loading = createLoading("项目依赖安装");
  const commands = useNpm ? ["npm", ["install"]] : ["yarn"];
  const result = await execa(...commands, {
    cwd: repositoryDir,
  });
  if (result.failed) {
    loading.fail();
    return Promise.reject(new Error("依赖安装失败"));
  }
  loading.succeed();
}

// 启动
// async function start() {
//   const loading = createLoading("启动项目");
//   const result = await execa(
//     "taro",
//     ["build", "--type", "weapp", "--blended", "--watch"],
//     {
//       cwd: repositoryDir,
//     }
//   );
//   if (result.failed) {
//     loading.fail();
//     return Promise.reject(new Error("依赖安装失败"));
//   }
//   loading.succeed();
// }

export async function createProject(options) {
  console.log("   ");
  log.suc(`开始创建项目`);
  console.log("   ");
  console.log(`项目名称: ${repositoryName}`);
  console.log(`仓库地址: ${config.repository.gitUrl}`);
  console.log("   ");
  console.log("   ");
  if (fs.existsSync(repositoryDir)) {
    await updateRepo();
  } else {
    await cloneRepo(options.branch, options.useHTTPS);
  }
  await install(options.useNpm);
  //   await start()
  console.log("   ");
  console.log("   ");
}
