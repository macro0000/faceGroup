<template>
  <div class="download-container sureDrag">
    <button @click="openFileHandler">读取文件</button>
    <button @click="getDirHandler">读取文件列表</button>
    <button @click="chooseWorkSpace">选择文件列表</button>
    <el-row>
      <el-col :span="12" :offset="6">
        <el-input
          placeholder="请选择工作空间"
          v-model="this.$store.getters.rootPath"
          @click="getDirHandler"
        ></el-input>
      </el-col>
    </el-row>

    <div class="images" v-for="item in this.$store.getters.fileList">
      <el-card :body-style="{ padding: '0px' }">
        <img :src="'file://' + item.path" class="image" width="100%" height="100%"/>
        <div style="padding: 14px">
          <span>{{ item.name }}</span>
          <div class="bottom clearfix">
            <time class="time">{{ new Date().getTime() }}</time>
            <el-button type="text" class="button">分组</el-button>
          </div>
        </div>
      </el-card>
    </div>

  </div>
</template>

<script>
export default {
  data: function () {
    return {};
  },
  methods: {
    chooseWorkSpace() {
      this.$store.dispatch("chooseWorkSpace");
    },
    openFileHandler() {
      const path =
        "C:/Users/macrocc/Desktop/html 样例展示/10402.request.body.json";
      this.$store.dispatch("readFile", path);
    },
    getDirHandler() {
      const path = "C:/Users/macrocc/Desktop/html 样例展示/";
      this.$store.dispatch("getDir", path);
    },
  },
};
</script>
<style type="text/css">
.images{
    width: 200px;
    height: 100%;
    float: left;
    padding: 10px;
}
</style>