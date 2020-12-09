<template>
  <div>
    <p>该软件还有{{ lastDay }}天使用时间</p>
    <p>mail:macro0000@outlook.com</p>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      endDate: 1613664000000,
    };
  },
  computed: {
    lastDay: function () {
      const now = new Date().getTime();
      return parseInt((this.endDate - now) / 1000 / 60 / 60 / 24);
    },
  },
};
</script>

<style>
</style>