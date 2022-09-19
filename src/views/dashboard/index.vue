<template>
  <div class="app-container">
    <div class="search-container">
      <el-input v-model="input" placeholder="请输入客户姓名或手机号"></el-input>
      <el-button @click="handleSearch" type="primary" class="search"
        >搜索</el-button
      >
      <el-button @click="editClientCode" type="info" class="search"
        >添加用户授权码</el-button
      >
    </div>
    <!-- 表格数据 -->
    <el-table :data="dataList" style="width: 100%" border stripe>
      <el-table-column label="序号" width="90" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="客户id" width="100" align="center">
        <template slot-scope="scope">{{ scope.row.client.id }}</template>
      </el-table-column>
      <el-table-column label="客户名称" align="center">
        <template slot-scope="scope">{{ scope.row.client.name }}</template>
      </el-table-column>
      <el-table-column label="客户电话" align="center">
        <template slot-scope="scope">{{ scope.row.client.tel }}</template>
      </el-table-column>
      <el-table-column label="客户授权码" align="center">
        <template slot-scope="scope">{{
          scope.row.authorizationCode
        }}</template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="删除客户授权号"
            placement="top"
          >
            <el-button
              @click="removeBlogListHandle(scope.row.id)"
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
    <el-dialog
      title="生成客户授权码"
      :visible.sync="dialogFormVisible"
      width="30%"
    >
      <el-form :model="form">
        <el-form-item label="选择客户" :label-width="formLabelWidth">
          <el-select
            size="medium"
            filterable
            v-if="clientInfoList.length !== 0"
            v-model="form.clientId"
            placeholder="请选择客户"
          >
            <el-option
              v-for="item in clientInfoList"
              :key="item.id"
              :label="item.name + ' , ' + item.tel"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-input
            v-if="clientInfoList.length === 0"
            v-model="clientInfoObj.msg"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="生成数量" :label-width="formLabelWidth">
          <el-input-number
            v-model="form.num"
            :min="1"
            :max="10"
            label="描述文字"
          ></el-input-number>
          <!-- <el-input v-model="form.num" autocomplete="off"></el-input> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closePoput">取 消</el-button>
        <el-button type="primary" @click="handleAddCode">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllAuthorizationCode,
  addAuthorizationCode,
  getIdAuthorizationCode,
  rmAuthorizationCode,
} from "@/api/authorizationCode";
import { getPhoneClient, getnameClient } from "@/api/client";
export default {
  name: "Dashboard",
  data() {
    return {
      dataList: [],
      dialogFormVisible: false,
      formLabelWidth: "80px",
      input: "",
      clientInfoList: [],
      clientInfoObj: {
        id: "",
        name: "",
        tel: "",
        msg: "",
      },
      clientNameList: [],
      isLoad: false,
      form: {
        clientId: "",
        num: 1,
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const { data } = await getAllAuthorizationCode();
      this.dataList = (data && data.dataList) || [];
    },
    /**
     * 查询客户信息
     * @param {string} type 查询的方式，参数为phone或name
     * @param {string} info 对应方式的查询内容
     */
    async seachClientInfo(type, info) {
      if (type === "phone") {
        // 用电话进行查找
        const data = await getPhoneClient(info);
        this.input = "";
        if (data.code !== 0) {
          this.clientInfoObj.msg = "该客户不存在或格式错误";
          this.$message.error(data.msg);
        } else {
          this.clientInfoObj = {
            ...this.clientInfoObj,
            ...data.data,
            msg: data.data.name + " , " + data.data.tel,
          };
          this.form.clientId = data.data.id;
        }
        return { code: data.code, msg: data.msg };
      } else {
        // 用姓名进行查找
        const data = await getnameClient(info);
        this.input = "";
        if (data.code !== 0) {
          this.clientInfoObj.msg = "该客户不存在或格式错误";
          this.$message.error(data.msg);
        } else {
          this.clientInfoList = data.data.dataList;
        }
        return { code: data.code, msg: data.msg };
      }
    },
    // 打开弹出框
    editClientCode() {
      if (this.input === "") {
        this.$message.error("请检查客户信息是否输入完整");
        return;
      }
      if (this.input.length === 11) {
        this.seachClientInfo("phone", this.input);
      } else {
        this.seachClientInfo("name", this.input);
      }

      this.dialogFormVisible = true;
    },
    // 添加客户授权码
    async handleAddCode() {
      if (this.form.clientId === "") {
        this.$message.error("客户信息不能为空");
        this.dialogFormVisible = false;
        return;
      }
      const { data } = await addAuthorizationCode(this.form);
      const clientAuthorizationCodes = [];
      data.forEach((item) => {
        clientAuthorizationCodes.push(item.authorizationCode);
      });
      this.fetchData();
      this.form.num = 1;
      this.clientInfoObj = {};
      this.clientInfoList = [];
      this.dialogFormVisible = false;
      this.open(clientAuthorizationCodes);
    },
    // 打开提醒框
    open(clientAuthorizationCodes) {
      const html = clientAuthorizationCodes
        .map(
          (item) =>
            `<p style="border-bottom: 1px solid #ccc;margin-bottom:3px">${item}</p>`
        )
        .join("");
      this.$alert(html, "授权码为:", {
        dangerouslyUseHTMLString: true,
      });
    },
    // 关闭弹窗
    closePoput() {
      this.dialogFormVisible = false;
      this.form.num = 1;
      this.clientInfoObj = {};
      this.clientInfoList = [];
    },
    // 通过手机号或姓名查询用户
    async handleSearch() {
      if (this.input === "") {
        this.fetchData();
        return;
      }
      let obj;
      if (this.input.length === 11) {
        obj = await this.seachClientInfo("phone", this.input);
      } else {
        obj = await this.seachClientInfo("name", this.input);
        this.clientNameList = [];
        if (obj.code) {
          return;
        }
        let iscode = 0; // 查询的客户中是否都不存在授权码
        await this.clientInfoList.map(async (item) => {
          const { data } = await getIdAuthorizationCode(item.id);
          if (data) {
            this.clientNameList = this.clientNameList.concat(data.dataList);
            this.dataList = this.clientNameList;
            iscode = 1;
          }
        });
        setTimeout(() => {
          iscode === 0 ? this.$message.error("该客户暂无授权码") : "";
        }, 500);

        return;
      }
      const { data, code, msg } = await getIdAuthorizationCode(
        this.form.clientId
      );
      this.dataList = (data && data.dataList) || [];
      code !== 0 ? this.$message.error(msg) : "";
    },
    // 删除客户授权码
    async removeBlogListHandle(id) {
      if (this.isLoad) {
        return -1;
      }
      this.$confirm("此操作将永久删除该授权码, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          this.isLoad = true;
          rmAuthorizationCode(id).then(async ({ code }) => {
            if (code) {
              this.$message.error("删除失败，请检查网络");
              this.isLoad = false;
              return false;
            }
            await this.fetchData();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
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
