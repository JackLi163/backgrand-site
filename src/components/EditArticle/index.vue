<template>
  <div class="edit-article-container">
    <div class="block">文章标题</div>
    <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
    <div class="block">文章编辑</div>
    <Editor
      ref="toastuiEditor"
      height="600px"
      :initialValue="form.markdownContent"
      :options="editorOptions"
    />
    <div class="block">文章描述</div>
    <el-input
      v-model="form.description"
      type="textarea"
      placeholder="请输入文章的描述"
      :rows="6"
    />
    <div class="block left">
      <Upload uploadTitle="文章头图" v-model="form.thumb" />
    </div>
    <div class="block">选择分类</div>
    <el-select
      v-model="form.categoryId"
      @change="changeHandle"
      slot="prepend"
      placeholder="请选择"
    >
      <el-option
        v-for="item in blogTypeList"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
    <div class="block">
      <el-button type="primary" @click="addBlogHandle">{{
        mode !== "" ? "发布文章" : "修改文章"
      }}</el-button>
    </div>
  </div>
</template>

<script>
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/vue-editor";
import { getBlogType, getOneBlog, addBlog, editBlog } from "@/api/blog";
import Upload from "@/components/Upload";
import { formContentIsNull } from "@/utils/formContentIsNull"; // 该函数作用用于判断是否存在空值
import "@toast-ui/editor/dist/i18n/zh-tw";
export default {
  name: "EditBlog",
  components: {
    Editor,
    Upload,
  },
  props: {
    // 默认为修改文章，传入add为添加文章
    mode: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      editorOptions: { language: "zh-TW" },
      id: "",
      form: {
        title: "",
        markdownContent: "",
        description: "",
        categoryId: "",
        thumb: "",
        createDate: 0,
        htmlContent: "",
      },
      blogTypeList: [],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      // 修改文章
      if (this.mode === "") {
        this.id = this.$route.params === null ? "" : this.$route.params.id;
        getOneBlog(this.id).then(({ data }) => {
          this.form = data;
          this.$refs.toastuiEditor.invoke("setHTML", data.htmlContent);
          this.form.categoryId = data.category === null ? "" : data.category.id;
        });
      }
      getBlogType().then(({ data }) => (this.blogTypeList = data));
    },
    // 点击确定键后触发
    addBlogHandle() {
      this.form.htmlContent = this.$refs.toastuiEditor.invoke("getHTML");
      this.form.markdownContent =
        this.$refs.toastuiEditor.invoke("getMarkdown");
      this.form.createDate = new Date().getTime();
      const obj = { ...this.form };
      if (formContentIsNull(obj)) {
        this.$message.error("请将信息填写完整");
        return false;
      }

      if (this.mode === "add") {
        //   添加文章
        addBlog(obj).then(() => {
          this.$message.success("发布成功");
          this.$router.push("/blog/list");
        });
      } else {
        // 修改文章
        editBlog(this.id, obj).then(() => {
          this.$message.success("修改成功");
          this.$router.push("/blog/list");
        });
      }
    },
    // elementUi强制更新
    changeHandle() {
      this.$forceUpdate();
    },
  },
};
</script>

<style lang="scss" scoped>
.block {
  margin: 15px 0;
  font-weight: 100;
}
.left {
  width: 180px;
}
</style>
