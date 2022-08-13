<template>
  <div class="app-container">
    <!-- 输入框 -->
    <div style="margin-top: 15px; width: 450px">
      <el-input
        placeholder="请输入要添加的分类，左边选择该分类的等级"
        v-model="input"
        class="input-with-select"
      >
        <el-select v-model="select" slot="prepend" placeholder="请选择">
          <el-option label="1" value="1"></el-option>
          <el-option label="2" value="2"></el-option>
          <el-option label="3" value="3"></el-option>
          <el-option label="4" value="4"></el-option>
          <el-option label="5" value="5"></el-option>
        </el-select>
        <el-button slot="append" type="primary" @click="addBlogTypeHandle"
          >添加</el-button
        >
      </el-input>
    </div>
    <!-- 表单数据 -->
    <el-table :data="data" style="width: 100%; margin-top: 25px" border>
      <el-table-column label="序号" width="100" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="博客类别" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="文章数量" align="center">
        <template slot-scope="scope">{{ scope.row.articleCount }}</template>
      </el-table-column>
      <el-table-column label="文章分类等级" align="center">
        <template slot-scope="scope">{{ scope.row.order }}</template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button
              @click="editBlogTypeHandle(scope.row)"
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
            />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button
              @click="removeBlogTypeHandle(scope.row)"
              type="danger"
              :icon="isLoad ? 'el-icon-loading' : 'el-icon-delete'"
              circle
              size="mini"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑表单数据 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" top="5vh">
      <el-form :model="form">
        <el-form-item label="分类名称">
          <el-input
            v-model="form.name"
            placeholder="请输入分类名称"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="分类等级">
          <el-select v-model="form.order">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
            <el-option label="4" value="4"></el-option>
            <el-option label="5" value="5"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editBlogTypeConfig">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBlogType,
  editBlogType,
  deleteBlogType,
  addBlogType,
} from "@/api/blog";
import { formContentIsNull } from "@/utils/formContentIsNull"; // 该函数作用用于判断是否存在空值
export default {
  name: "BlogType",
  data() {
    return {
      data: [],
      input: "",
      select: "",
      title: "编辑文章分类",
      dialogFormVisible: false,
      form: {
        name: "",
        articleCount: "",
        order: "",
        id: "",
      },
      isLoad: false,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const { data } = await getBlogType();
      this.data = data;
    },
    // 打开编辑界面
    editBlogTypeHandle(item) {
      this.form = { ...item };
      this.title = "请编辑信息";
      this.dialogFormVisible = true;
    },
    // 编辑后确定上传
    editBlogTypeConfig() {
      if (formContentIsNull(this.form)) {
        this.$message({
          message: "请完整填写信息",
          type: "warning",
        });
        return false;
      }
      editBlogType(this.form.id, {
        name: this.form.name,
        order: +this.form.order,
      }).then(({ code }) => {
        if (code) {
          this.$message.error("修改分类失败，请重新修改");
          return false;
        }
        this.$message({
          message: "修改成功",
          type: "success",
        });
        this.fetchData();
        this.dialogFormVisible = false;
      });
    },
    // 删除列表
    async removeBlogTypeHandle({ id }) {
      if (this.isLoad) {
        return -1;
      }
      this.$confirm(
        "删除该分类后，该分类下面的所有文章将变为未分类状态，是否继续?",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
        }
      )
        .then(() => {
          this.isLoad = true;
          deleteBlogType(id).then(({ code }) => {
            if (code) {
              this.$message.error("修改分类失败，请检查网络");
              return false;
            }
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.fetchData();
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
    // 添加文章分类
    addBlogTypeHandle() {
      if (formContentIsNull({ name: this.input, order: this.select })) {
        this.$message({
          message: "请完整填写信息",
          type: "warning",
        });
        return false;
      }

      addBlogType({ name: this.input, order: this.select }).then(({ code }) => {
        if (code) {
          this.$message.error("修改分类失败，请重新修改");
          return false;
        }
        this.$message({
          message: "添加成功",
          type: "success",
        });
        this.fetchData();
        this.input = "";
        this.select = "";
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
