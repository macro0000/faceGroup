<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
const { ipcRenderer, app } = require("electron");
export default {
  name: "face",
  mounted: function () {
    const end = 1613664000000;
    const now = new Date().getTime();
    if (now > end) {
      // ipcRenderer.send("quit");
    }
    setInterval(() => {
      document.title = `当前目录：${this.$store.getters.rootPath}(共${
        this.$store.getters.count
      }/${this.$store.getters.fileChooseCount}张-${this.$store.getters.GroupCount}组) 当前时间为：${new Date().format("hh:mm:ss")}`;
    }, 100);

    ipcRenderer.on("preferences", (event, arg) => {
      switch (arg) {
        case "chooseWrokSpace":
          this.$store.dispatch("chooseWorkSpace");
          break;
        case "output":
          this.$store.dispatch("outputFile").then(({ path, groupl, filel }) => {
            this.$notify({
              title: "导出成功",
              dangerouslyUseHTMLString: true,
              message: `<p>导入目录：</p><p>${path}</p><p>创建分组：${groupl}</p><p>移动文件：${filel}</p>`,
              onClick: () => {
                const { shell } = require("electron").remote;
                shell.showItemInFolder(`${path}//`);
              },
              position: "bottom-right",
            });
          });
          break;
      }
    });
    ipcRenderer.on("about", (event, arg) => {
      switch (arg) {
        case "about":
          ipcRenderer.send("openWindow", arg);
          break;
      }
    });
  },
};
</script>

<style>
/* CSS */
body {
  padding: 0;
  margin: 0;
}
</style>
