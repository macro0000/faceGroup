<template>
  <div class="ImgGroup">
    <div :id="id"></div>
    <div class="title" :count="`${pics.length}张，选中${choose}张`">
      <slot></slot>
    </div>

    <div
      :class="'images ' + item.status"
      v-for="(item, index) in pics"
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
            <el-button type="text" class="button">{{ groupName }}</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  props: ["pics", "groupName", "id"],
  data: function () {
    return {};
  },
  computed:{
    choose:function(){
      return this.pics.filter(e => e.status ==='choose' ).length
    }
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
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  clear: both;
  padding: 0.1rem;
  .title {
    position: relative;
    padding-left: 5rem;
    font-size: 1.9em;
    display: flex;
    &:before {
      content: "";
      position: absolute;
      left: 13px;
      right: 13px;
      top: 50%;
      height: 2px;
      background: #c2cada;
    }
    &:after {
      font-size: 0.6em;
      color: #9f9b9b;
      content: attr(count);
    }
  }
  .images {
    width: 200px;
    float: left;
    padding: 10px;
  }
  .choose {
    filter: brightness(90%);
    background-color: #cac0ea;
  }
}
</style>