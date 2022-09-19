<template>
  <div class="app-container">
    <div class="search-container">
      <el-button @click="openPopup('添加用户')" type="success"
        >添加用户</el-button
      >
    </div>
    <!-- 表格数据 -->
    <el-table :data="dataList" style="width: 100%" border stripe>
      <el-table-column label="序号" width="120" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="用户id" align="center">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="用户手机号" align="center">
        <template slot-scope="scope">{{ scope.row.tel }}</template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button
              @click="openPopup('修改用户信息', scope.row)"
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
            />
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="删除用户"
            placement="top"
          >
            <el-button
              @click="rmUsertHandle(scope.row.id)"
              type="danger"
              :icon="isLoad ? 'el-icon-loading' : 'el-icon-delete'"
              circle
              size="mini"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹出框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="35%">
      <el-form :model="form">
        <el-form-item label="用户姓名" :label-width="formLabelWidth">
          <el-input
            v-model="form.name"
            placeholder="请输入用户名字"
            :disabled="isDisabled"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户号码" :label-width="formLabelWidth">
          <el-input
            v-model="form.tel"
            placeholder="请输入用户手机号码"
            :disabled="isDisabled"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户密码" :label-width="formLabelWidth">
          <el-input
            placeholder="可不输入，默认值为6个1"
            v-model="form.password"
            show-password
            :disabled="isDisabled"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="isAdmin ? '管理员' : '非管理员'"
          :label-width="formLabelWidth"
        >
          <el-switch
            v-model="isAdmin"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addUser, getAllUser, rmUser } from "@/api/user";
import { addUserRole, getIdUserRole, rmUserRole } from "@/api/userRole";
export default {
  data() {
    return {
      title: "",
      dataList: [],
      isLoad: false,
      input: "",
      dialogFormVisible: false,
      formLabelWidth: "100px",
      form: {
        name: "",
        tel: "",
        password: "",
      },
      isAdmin: false,
      isDisabled: false,
      id: "",
    };
  },
  created() {
    getIdUserRole(JSON.parse(sessionStorage.getItem("adminInfo")).id).then(
      ({ data }) => {
        if (data.length > 0) {
          this.fetchData();
        } else {
          this.$router.push("/");
          this.$message({
            type: "info",
            message: "非管理员禁止进入该页面",
          });
        }
      }
    );
  },
  methods: {
    fetchData() {
      getAllUser().then(({ code, data }) => {
        if (code === 0) {
          this.dataList = data.dataList;
        }
      });
    },
    // 打开弹窗
    openPopup(title, row) {
      this.title = title;
      this.isAdmin = false;
      this.isDisabled = false;
      this.form = {
        name: "",
        tel: "",
        password: "",
      };
      if (this.title === "修改用户信息") {
        this.form.tel = row.tel;
        this.form.name = row.name;
        this.form.password = "111111";
        this.id = row.id;
        this.isDisabled = true;
        getIdUserRole(row.id).then(({ data }) => {
          if (data.length > 0) {
            this.isAdmin = true;
          }
        });
      }
      this.dialogFormVisible = true;
    },
    // 编辑用户
    handleEditUser() {
      if (this.title === "添加用户") {
        this.addUsers();
      } else {
        if (this.isAdmin) {
          addUserRole({ userId: this.id, roleId: 1 });
        } else {
          rmUserRole({ userId: this.id, roleId: 1 });
        }
        this.dialogFormVisible = false;
      }
    },
    // 用户添加
    addUsers() {
      if (this.form.password === "") {
        this.form.password = "111111";
      }
      if (this.form.password < 6) {
        this.$message.error("密码不能小于6位");
        return;
      }
      // 添加用户
      addUser(this.form).then(({ code, msg, data }) => {
        if (code === 0) {
          this.$message({
            message: msg,
            type: "success",
          });
          // 是否为管理员
          if (this.isAdmin) {
            addUserRole({ roleId: "1", userId: data.id }).then(
              ({ code, msg }) => {
                if (code !== 0) {
                  this.$message.error(msg);
                }
              }
            );
          }
          this.fetchData();
        } else {
          this.$message.error(msg);
        }
        this.dialogFormVisible = false;
      });
    },
    // 删除用户
    rmUsertHandle(id) {
      if (this.isLoad) {
        return -1;
      }
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          this.isLoad = true;
          rmUser(id).then(async ({ code, msg }) => {
            if (code) {
              this.$message.error(msg);
              this.isLoad = false;
              return false;
            }
            this.$message({
              type: "success",
              message: msg,
            });
            await this.fetchData();
            this.isLoad = false;
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  .search-container {
    width: 40%;
    margin-bottom: 20px;
    display: flex;
    .search {
      margin-left: 10px;
    }
  }
}
</style>
