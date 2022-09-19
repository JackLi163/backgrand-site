<template>
  <div class="upload-container">
    <el-upload
      class="avatar-uploade"
      :multiple="true"
      action="http://upload.qiniup.com"
      :data="postData"
      :on-success="handleAvatarSuccess"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
import { genUpToken } from "@/utils/qiniuToken";
export default {
  data() {
    return {
      imageUrl: "",
      postData: {},
    };
  },
  created() {
    var token;
    var policy = {};
    var bucketName = "wisconsin-hawk";
    var AK = "ZncTnLcIxG_0nGFrUXK4aQruVA_srum_nHrpCprV";
    var SK = "BcSZpMiLWOadmUgH5uSbrcz0sw_S_7e2DGHpzwLU";
    var deadline = Math.round(new Date().getTime() / 1000) + 3600;
    policy.scope = bucketName;
    policy.deadline = deadline;
    token = genUpToken(AK, SK, policy);
    this.postData.token = token;
  },

  methods: {
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      this.imageUrl = "http://qny.westhawk.cn/" + res.key;
      console.log(this.imageUrl);
    },
    // beforeAvatarUpload(file) {
    //   const isJPG = file.type === "image/jpeg";
    //   const isLt2M = file.size / 1024 / 1024 < 2;

    //   if (!isJPG) {
    //     this.$message.error("上传头像图片只能是 JPG 格式!");
    //   }
    //   if (!isLt2M) {
    //     this.$message.error("上传头像图片大小不能超过 2MB!");
    //   }
    //   return isJPG && isLt2M;
    // },
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
