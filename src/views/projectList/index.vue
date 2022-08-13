<template>
  <div class="app-container">
    <!-- 表单数据 -->
    <el-table :data="data" style="width: 100%" border>
      <el-table-column label="序号" width="100" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="项目名称" align="center" width="250">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="项目描述" align="center">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>
      <el-table-column label="预览图" align="center" width="210">
        <template slot-scope="scope">
          <el-image
            style="width: 180px"
            :src="scope.row.thumb2"
            v-if="scope.row.thumb2"
            fit="cover"
            :preview-src-list="srcList"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="Github"
            placement="top"
          >
            <el-button
              @click="openGithubHandle(scope.row)"
              type="primary"
              icon="iconfont icon-github-fill"
              circle
              size="mini"
              class="github"
            />
          </el-tooltip>
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
              @click="removeProjectHandle(scope.row)"
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
    <el-dialog :title="title" :visible.sync="dialogFormVisible" fullscreen>
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
        <el-form-item label="">
          <el-row class="upload">
            <el-col :span="12"><p class="margin-top">预览图</p></el-col>
            <el-col :span="12"><Upload v-model="form.thumb" /></el-col>
          </el-row>
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

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editBlogTypeConfig">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProject, editProject, deleteProject } from "@/api/project";
import { formContentIsNull } from "@/utils/formContentIsNull"; // 该函数作用用于判断是否存在空值
import { server_URL } from "@/urlConfig";
import "@/assets/iconfot/iconfont.css";
import Upload from "@/components/Upload";
export default {
  name: "ProjectList",
  components: {
    Upload,
  },
  data() {
    return {
      data: [],
      input: "",
      title: "请编辑该项目信息",
      dialogFormVisible: false,
      form: {
        name: "",
        description: "",
        url: "",
        github: "",
        order: 1,
        thumb: "",
      },
      id: "",
      isLoad: false,
      srcList: [],
    };
  },
  async created() {
    await this.fetchData();
    this.upImgUrl(this.data);
  },
  methods: {
    async fetchData() {
      let { data } = await getProject();
      data = data.map((item) => {
        const description2 = item.description.join(",");
        return {
          ...item,
          description: description2,
        };
      });
      this.data = data;
    },
    // 打开编辑界面
    editBlogTypeHandle(item) {
      this.form = { ...item };
      delete this.form.id;
      this.id = item.id;
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
      editProject(this.id, {
        ...this.form,
        description: this.form.description.split(","),
        order: +this.form.order,
      }).then(async ({ code }) => {
        if (code) {
          this.$message.error("项目编辑失败，请重新修改");
          return false;
        }
        this.$message({
          message: "修改成功",
          type: "success",
        });
        this.dialogFormVisible = false;
        await this.fetchData();
        this.upImgUrl(this.data);
      });
    },
    // 删除列表
    async removeProjectHandle({ id }) {
      if (this.isLoad) {
        return -1;
      }
      this.$confirm("删除后该数据将永远删除，是否确定?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          this.isLoad = true;
          deleteProject(id).then(async ({ code }) => {
            if (code) {
              this.$message.error("删除失败，请检查网络");
              return false;
            }
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            await this.fetchData();
            this.isLoad = false;
            this.upImgUrl(this.data);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 跳转到github地址
    openGithubHandle({ github }) {
      window.open(github, "_blank");
    },

    // 补全图片地址
    upImgUrl(data) {
      this.data = data.map((item) => {
        return {
          ...item,
          thumb2: server_URL + item.thumb,
        };
      });
      this.data.forEach((item) => this.srcList.push(item.thumb2));
    },
  },
};
</script>

<style lang="scss" scoped>
.github {
  background: #a3a3a3;
  border-color: #a3a3a3;
}

.upload {
  width: 108px;
}
.margin-top {
  margin-top: 0px;
  font-weight: 800;
}
</style>
