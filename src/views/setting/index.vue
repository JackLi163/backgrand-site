<template>
  <div class="app-container">
    <!-- 网站信息 -->
    <div class="block">
      <h1 class="h1">网站信息</h1>
      <h2 class="h2">网站标题</h2>
      <el-input
        v-model="form.siteTitle"
        class="el-input"
        placeholder="请输入内容"
        :disabled="disabled"
      />
      <h2 class="h2">邮箱</h2>
      <el-input
        v-model="form.mail"
        class="el-input"
        placeholder="请输入内容"
        :disabled="disabled"
      />
      <h2 class="h2">备案号</h2>
      <el-input
        v-model="form.icp"
        class="el-input"
        placeholder="请输入内容"
        :disabled="disabled"
      />
    </div>
    <el-divider />
    <!-- 网站头像信息 -->
    <div class="block">
      <h1 class="h1">网站头像信息</h1>
      <el-image style="width: 100px" :src="form.avatar" fit="cover" />
    </div>
    <el-divider />
    <!-- 网址图标信息-->
    <div class="block">
      <h1 class="h1">网址图标信息</h1>
      <h2 class="h2">网址图标地址</h2>
      <el-input
        v-model="form.favicon"
        class="el-input"
        placeholder="请输入内容"
        :disabled="disabled"
      />
      <h2 class="h2">网址图标预览</h2>
      <el-image style="width: 100px" :src="form.favicon" fit="cover" />
    </div>
    <el-divider />
    <!-- github 信息 -->
    <div class="block">
      <h1 class="h1">github 信息</h1>
      <h2 class="h2">github 名字</h2>
      <el-input
        v-model="form.githubName"
        class="el-input"
        placeholder="请输入内容"
        :disabled="disabled"
      />
      <h2 class="h2">github 地址</h2>
      <el-input
        v-model="form.github"
        class="el-input"
        placeholder="请输入内容"
        :disabled="disabled"
      />
    </div>
    <el-divider />
    <!-- QQ 信息 -->
    <div class="block">
      <h1 class="h1">QQ 信息</h1>
      <h2 class="h2">QQ 号码</h2>
      <el-input
        v-model="form.qq"
        class="el-input"
        placeholder="请输入内容"
        :disabled="disabled"
      />
      <h2 class="h2">QQ 二维码图片预览</h2>
      <el-image style="width: 100px" :src="form.qqQrCode" fit="cover" />
    </div>
    <el-divider />
    <!-- 微信信息 -->
    <div class="block">
      <h1 class="h1">微信信息</h1>
      <h2 class="h2">微信号</h2>
      <el-input
        v-model="form.weixin"
        class="el-input"
        placeholder="请输入内容"
        :disabled="disabled"
      />
      <h2 class="h2">微信二维码图片预览</h2>
      <el-image style="width: 100px" :src="form.weixinQrCode" fit="cover" />
    </div>
    <el-divider />
    <el-dialog title="请编辑信息" :visible.sync="dialogFormVisible" fullscreen>
      <el-form :model="form">
        <el-form-item label="网站标题">
          <el-input v-model="form.siteTitle" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.mail" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备案号">
          <el-input v-model="form.icp" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="网站头像地址">
          <Upload v-model="form.avatar" />
        </el-form-item>
        <el-form-item label="网站图标地址">
          <Upload v-model="form.favicon" />
        </el-form-item>
        <el-form-item label="github名字">
          <el-input v-model="form.githubName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="github地址">
          <el-input v-model="form.github" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="QQ号码">
          <el-input v-model="form.qq" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="QQ二维码图片地址">
          <Upload v-model="form.qqQrCode" />
        </el-form-item>
        <el-form-item label="微信号">
          <el-input v-model="form.weixin" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="微信二维码图片地址">
          <Upload v-model="form.weixinQrCode" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editBannerConfig">确 定</el-button>
      </div>
    </el-dialog>
    <el-button type="primary" @click="editHandle">进入编辑模式</el-button>
  </div>
</template>

<script>
import { getSetting, SetSetting } from "@/api/setting";
import { formContentIsNull } from "@/utils/formContentIsNull";
import Upload from "@/components/Upload";
export default {
  name: "Setting",
  components: {
    Upload,
  },
  data() {
    return {
      dialogFormVisible: false,
      form: {
        siteTitle: "",
        mail: "",
        icp: "",
        avatar: "",
        favicon: "",
        githubName: "",
        github: "",
        qq: "",
        qqQrCode: "",
        weixin: "",
        weixinQrCode: "",
      },
      disabled: true,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getSetting().then(({ data }) => (this.form = { ...data }));
    },
    // 进入编辑模式
    editHandle() {
      this.dialogFormVisible = true;
    },
    // 提交
    editBannerConfig() {
      if (formContentIsNull(this.form)) {
        this.$message.error("请将信息填写完整");
        return false;
      }
      SetSetting(this.form).then(({ data }) => (this.form = { ...data }));
      this.$message({
        message: "修改成功",
        type: "success",
      });
      this.dialogFormVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.block {
  width: 600px;
  .h1 {
    font-weight: 400;
    font-size: 20px;
  }
  .h2 {
    font-weight: 100;
    font-size: 14px;
  }
}
</style>
