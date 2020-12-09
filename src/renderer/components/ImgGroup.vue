<template>
  <div class="ImgGroup">
    <div :id="id"></div>
    <el-divider content-position="left" >
      <slot></slot>
    </el-divider>

    <div
      :class="'images ' + item.status"
      v-for="(item, index) in this.pics"
      :key="index"
      @click="clickHandle(index)"
    >
      <el-card :body-style="{ padding: '0px' }">
        <img
          :id="'image_' + index"
          :src="'file://' + item.path"
          class="image"
          width="100%"
          height="100%"
        />
        <div style="padding: 14px">
          <span>{{ item.name }}</span>
          <div class="bottom clearfix">
            <time class="time"></time>
            <el-button type="text" class="button">{{groupName}}</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  props: ["pics", "groupName","id"],
  data: function () {
    return {};
  },
  methods: {
    clickHandle: function (index) {
      this.$emit("click", index);
    },
  },
};
</script>

<style lang='scss'>
.ImgGroup {
  clear: both;
  padding: 0.1rem;
  .images {
    width: 200px;
    float: left;
    padding: 10px;
  }
  .choose {
    background-color: #cac0ea;
  }
}
</style>