<template>
  <div class="app-container">
    <div class="block">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="name">
          <el-input
            type="text"
            v-model="ruleForm.name"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            autocomplete="off"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >修改</el-button
          >
          <el-button @click="resetForm('ruleForm')">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { updataInfo } from "@/api/user";
export default {
  data() {
    const valideteUser = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账号"));
      } else {
        callback();
      }
    };

    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (value.length < 6) {
          callback(new Error("新密码不能小于6位"));
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        name: "",
        password: "",
        checkPass: "",
        tel: "",
        id: "",
      },
      rules: {
        name: [{ validator: valideteUser, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  created() {
    if (sessionStorage.getItem("adminInfo")) {
      const { name, tel, id } = JSON.parse(sessionStorage.getItem("adminInfo"));
      this.ruleForm.name = name;
      this.ruleForm.tel = tel;
      this.ruleForm.id = id;
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const obj = { ...this.ruleForm };
          delete obj.checkPass;
          updataInfo(obj).then(async ({ code }) => {
            if (code !== 0) {
              this.$message.error("非管理员无法修改密码");
              this.ruleForm.password = "";
              this.ruleForm.checkPass = "";
              return false;
            } else {
              this.$message.success("修改密码成功");
              localStorage.removeItem("adminToken");
              await this.$store.dispatch("user/resetToken");
              this.$router.push("/login");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.block {
  width: 500px;
}
</style>
