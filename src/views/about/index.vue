<template>
  <div class="app-container">
    <div class="block">关于我</div>
    <el-input
      class="el-input"
      placeholder="请输入内容"
      v-model="data"
      :disabled="disabled"
    >
    </el-input>
    <el-button type="primary" round @click="editHandle">{{
      disabled ? "编辑" : "完成"
    }}</el-button>
  </div>
</template>

<script>
import { getAbout, setAbout } from "@/api/about";
export default {
  name: "About",
  data() {
    return {
      data: "",
      disabled: true,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getAbout().then(({ data }) => (this.data = data));
    },
    editHandle() {
      this.disabled = !this.disabled;
      setAbout({ url: this.data }).then(({ data }) => (this.data = data));
    },
  },
};
</script>

<style lang="scss" scoped>
.el-input {
  margin: 15px 0;
}
.block {
  font-weight: 100;
}
</style>
