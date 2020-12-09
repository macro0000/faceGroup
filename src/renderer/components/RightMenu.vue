<template>
  <div class="rightMenu" @contextmenu.prevent="rightShow" @click="rightHide">
    <div
      id="rightclick-menu"
      :style="this.show ? this.style : 'display: none;'"
    >
      <div @click="action('createGroup')">使用现有选择({{count}})创建分组</div>
      <div @click="action('moveToGroup')">移动现有选择({{count}})到分组</div>
      <div @click="action('jump')">快速转跳</div>
      <div @click="action('delete')">删除</div>
    </div>
    <div :class="`mask ${this.show ? 'show' : 'hide'}`"></div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      show: false,
      dom: {},
      x: 0,
      y: 0,
    };
  },
  props:['count'],
  mounted: function () {
    document.onmousewheel = this.handleScroll;
  },
  methods: {
    rightShow: function (e) {
      this.show = true;
      this.x = e.x;
      this.y = e.y;
    },
    rightHide: function (e) {
      this.show = false;
    },
    action: function (action) {
      this.$emit("action", action);
    },
    handleScroll: function (e) {
      return !this.show;
    },
  },
  computed: {
    style: function () {
      return `transform: translate(${this.x}px, ${this.y}px)`;
    },
  },
};
</script>

<style type="text/css">
.mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: initial;
  z-index: 10;
}
.show {
  display: inline-block;
}
.hide {
  display: none;
}
.rightMenu {
  z-index: 1;
  height: 100vh;
  overflow-y: auto;
}
#rightclick-menu {
  position: absolute;
  background-color: #fff;
  box-shadow: 0px 0px 3px #777;
  z-index: 11;
}

#rightclick-menu > div {
  position: relative;
  padding: 5px 20px;
  cursor: pointer;
  border-bottom: 1px solid #eef;
}

#rightclick-menu > div:hover {
  background-color: #eef;
  border-radius: 3px;
}
</style>