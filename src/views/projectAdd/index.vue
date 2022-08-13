<template>
  <div class="app-container">
    <el-form :model="form">
      <el-form-item label="项目名称">
        <el-input
          v-model="form.name"
          placeholder="请输入项目名称"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="项目描述（每一项描述以英文逗号分割）">
        <el-input
          v-model="form.description"
          placeholder="请输入项目描述"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="项目链接">
        <el-input
          v-model="form.url"
          placeholder="请输入项目链接"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="Github 地址">
        <el-input
          v-model="form.github"
          placeholder="请输入Github 地址"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="项目预览图地址">
        <Upload v-model="form.thumb" class="upload" />
      </el-form-item>

      <el-form-item label="排序等级">
        <el-select v-model="form.order">
          <el-option label="1" value="1"></el-option>
          <el-option label="2" value="2"></el-option>
          <el-option label="3" value="3"></el-option>
          <el-option label="4" value="4"></el-option>
          <el-option label="5" value="5"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="block">
      <el-button type="primary" @click="addProjectHandle">发布项目</el-button>
    </div>
  </div>
</template>

<script>
import Upload from "@/components/Upload";
import { formContentIsNull } from "@/utils/formContentIsNull";
import { addProject } from "@/api/project";
export default {
  name: "ProjectAdd",
  components: {
    Upload,
  },
  data() {
    return {
      form: {
        name: "",
        description: "",
        url: "",
        github: "",
        order: 1,
        thumb: "",
      },
    };
  },
  methods: {
    // 提交项目
    async addProjectHandle() {
      if (formContentIsNull(this.form)) {
        this.$message.error("请将信息填写完整");
        return false;
      }
      await addProject({
        ...this.form,
        description: this.form.description.split(","),
      });
      this.$router.push("/project/list");
    },
  },
};
</script>

<style lang="scss" scoped>
.upload {
  width: 178px;
}
</style>
