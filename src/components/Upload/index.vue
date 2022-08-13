<template>
  <div class="upload-container">
    <div class="block">{{ uploadTitle }}</div>
    <el-upload
      class="avatar-uploader"
      action="/api/upload"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :headers="headers"
    >
      <img v-if="value" :src="value" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon el-upload"></i>
    </el-upload>
  </div>
</template>

<script>
export default {
  props: ["uploadTitle", "value"],
  computed: {
    headers() {
      return { Authorization: "Bearer " + localStorage.getItem("adminToken") };
    },
  },
  methods: {
    // 图片上传后的回调函数，参数为服务器传回来的数值
    handleAvatarSuccess(res) {
      if (!res.code && res.data) {
        this.$emit("input", res.data);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.block {
  margin-bottom: 15px;
}
</style>
