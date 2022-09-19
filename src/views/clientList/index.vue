<template>
  <div class="app-container">
    <div class="search-container">
      <el-input v-model="input" placeholder="请输入客户姓名或手机号"></el-input>
      <el-button @click="handleSearch" type="primary" class="search"
        >搜索</el-button
      >
      <el-button @click="openPopup('添加客户')" type="success"
        >添加客户</el-button
      >
    </div>
    <!-- 表格数据 -->
    <el-table
      @cell-click="cellHandleclick"
      :data="dataList"
      style="width: 100%"
      border
      stripe
    >
      <el-table-column label="序号" width="120" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="客户id" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="客户名称" align="center">
        <template slot-scope="scope"
          ><span class="client-name">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户电话" align="center">
        <template slot-scope="scope">{{ scope.row.tel }}</template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button
              @click="openPopup('修改客户信息', scope.row)"
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
            />
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="删除客户"
            placement="top"
          >
            <el-button
              @click="rmClientHandle(scope.row.id)"
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
        <el-form-item label="客户姓名" :label-width="formLabelWidth">
          <el-input v-model="form.name" placeholder="请输入客户名字"></el-input>
        </el-form-item>
        <el-form-item label="客户手机号码" :label-width="formLabelWidth">
          <el-input
            v-model="form.tel"
            placeholder="请输入客户手机号码"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closePoput">取 消</el-button>
        <el-button type="primary" @click="handleEditClient">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分页组件 -->
    <el-pagination
      style="margin-top: 30px"
      background
      layout="prev, pager, next,total,->,sizes,jumper"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30]"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
    >
    </el-pagination>
  </div>
</template>

<script>
import {
  addClient,
  upClient,
  rmClient,
  getAllClient,
  getnameClient,
  getPhoneClient,
} from "@/api/client";
export default {
  name: "ClientList",
  data() {
    return {
      dataList: [],
      isLoad: false,
      form: {
        name: "",
        tel: "",
        id: "",
      },
      dialogFormVisible: false,
      formLabelWidth: "100px",
      title: "",
      input: "",
      total: 0,
      pageSize: 10, // 每页显示条目个数
      currentPage: 1, // 当前页数
    };
  },

  computed: {
    // 最大页码数
    maxPageNumber() {
      return Math.ceil(this.total / this.pageSize);
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 分页请求客户列表
    async fetchData() {
      const { data } = await getAllClient(this.currentPage, this.pageSize);
      this.dataList = data.dataList;
      this.total = data.total;
    },
    // 打开添加用户弹窗
    openPopup(info, obj) {
      this.title = info;
      if (obj) {
        this.form.name = obj.name;
        this.form.tel = obj.tel;
        this.form.id = obj.id;
      }

      this.dialogFormVisible = true;
    },
    // 取消关闭弹窗
    closePoput() {
      this.form = { name: "", tel: "", id: "" };
      this.dialogFormVisible = false;
    },
    // 确认关闭弹窗
    handleEditClient() {
      if (this.title === "添加客户") {
        this.addClient();
      } else {
        this.editClient();
      }
      this.dialogFormVisible = false;
    },
    // 添加客户
    async addClient() {
      addClient({ name: this.form.name, tel: this.form.tel }).then(
        ({ code, msg }) => {
          if (!code) {
            this.$message({
              message: "客户信息添加成功",
              type: "success",
            });
            this.fetchData();
            this.form = { name: "", tel: "", id: "" };
          } else {
            this.$message({
              showClose: true,
              message: msg,
              type: "error",
            });
            this.form = { name: "", tel: "", id: "" };
          }
        }
      );
    },
    // 编辑客户
    editClient() {
      upClient(this.form).then(({ code, msg }) => {
        if (!code) {
          this.$message({
            message: "客户信息修改成功",
            type: "success",
          });
          this.fetchData();
        } else {
          this.$message({
            showClose: true,
            message: msg,
            type: "error",
          });
        }
        this.form = { name: "", tel: "", id: "" };
      });
    },
    // 删除客户
    rmClientHandle(id) {
      if (this.isLoad) {
        return -1;
      }
      this.$confirm("此操作将永久删除该客户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          this.isLoad = true;
          rmClient(id).then(async ({ code }) => {
            if (code) {
              this.$message.error("删除失败，请检查网络");
              this.isLoad = false;
              return false;
            }
            this.$message({
              type: "success",
              message: "删除成功!",
            });

            this.total--;
            console.log(this.maxPageNumber, this.currentPage);
            // 判断删除的数据是否为某一页的最后一条数据，如果是的话需要将当前页改为页码最大值，并重新请求数据
            if (this.maxPageNumber < this.currentPage) {
              this.currentPage = this.maxPageNumber;
              this.fetchData();
            }
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
    // 客户搜索
    handleSearch() {
      if (this.input === "") {
        this.fetchData();
        return;
      }
      if (this.input.length === 11) {
        getPhoneClient(this.input).then(({ code, data, msg }) => {
          if (!code) {
            const arr = [];
            this.total = 1;
            arr.push(data);
            this.dataList = arr;
          } else {
            this.$message.error(msg);
            this.fetchData();
          }
        });
      } else {
        getnameClient(this.input).then(({ code, data, msg }) => {
          if (!code) {
            this.dataList = data.dataList;
            this.total = data.total;
          } else {
            this.$message.error(msg);
            this.fetchData();
          }
        });
      }
      this.input = "";
    },

    // 当每页显示条数发生改变时会触发
    sizeChangeHandle(pagerNum) {
      this.pageSize = pagerNum;
      this.currentPage = 1;
      this.fetchData();
    },
    // 当当前页改变时会触发
    currentChangeHandle(pageNum) {
      this.currentPage = pageNum;
      this.fetchData();
    },
    cellHandleclick(row, column) {
      // //如果规定点击某一列执行，利用column中的label属性
      if (column.label === "客户名称") {
        this.$router.push(`/client/info/${row.id}`);
      }
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
  .client-name:hover {
    color: #ccc;
    cursor: pointer;
  }
}
</style>
