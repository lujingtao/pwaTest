/* eslint-disable no-console */

import { register } from "register-service-worker"


window.version = "0.02";
window.SW = null;

if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        "准备完成"
      )
    },
    registered(reg) {
      console.log("注册成功");
      console.log(reg);
      SW = reg;
    },
    cached() {
      console.log("缓存")
    },
    updatefound() {
      console.log("正在下载新内容")
    },
    updated() {
      console.log("已更新")
      // localStorage.setItem("sw_version", version);
      // console.log("已更新版本为：", version);
    },
    offline() {
      console.log("找不到Internet连接。应用程序正在脱机模式下运行")
    },
    error(error) {
      console.error("服务工作者注册过程中出错:", error)
    }
  })
}
