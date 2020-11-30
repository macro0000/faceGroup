<template>
  <div class="download-container sureDrag">
    <button @click="openFileHandler">打开文件目录</button>
    
  </div>
</template>

<script>
const ipcRenderer = require("electron").ipcRenderer;
export default {
  methods: {
    openFileHandler() {
      const { shell } = require("electron").remote;
      shell.showItemInFolder("C://");
    }
  }
};
</script>