import path from "path";

const repositoryName = "shop-sales-wx-app-next";
const repositoryDir = path.resolve(process.cwd(), repositoryName);
const config = {
    repository: {
        name: repositoryName,
        dir: repositoryDir,
        gitSSHUrl: "git@gitee.com:liweijia/shop-sales-wx-app-next.git",
        gitUrl: "https://gitee.com/liweijia/shop-sales-wx-app-next.git"
    }
}

export default config