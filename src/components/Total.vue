<template>
  <div class="fixBottom">
    <div class="total">总私信：{{ totalSX }}</div>
    <div class="total">总验证数：{{ totalYZS }}</div>
    <div class="total">总真实验证书：{{totalYZSReal}}</div>
  </div>
</template>

<style>
.fixBottom {
  position: fixed;
  left: 0;
  bottom: 0%;
  opacity: 0.5;
  z-index: 1000;
}
.total {
  color: red;
}
</style>
<script>
export default {
  name: "Total",
  props: {
    totalYZS: [String, Number],
    totalSX: [String, Number],
    totalYZSReal: [String, Number],
  },
  mounted() {},
};
</script>
