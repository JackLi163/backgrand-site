<template>
  <div class="app-container">
    <!-- 表格数据 -->
    <el-table :data="data.rows" style="width: 100%" border>
      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">{{
          scope.$index + pageSize * (currentPage - 1) + 1
        }}</template>
      </el-table-column>

      <el-table-column label="文章名称" align="center">
        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.thumb"
            placement="top-start"
            title="博客预览图"
            width="150"
            trigger="hover"
            style="text-align: center"
          >
            <el-image
              style="width: 130px"
              :src="scope.row.thumb"
              fit="cover"
              :preview-src-list="srcList"
            ></el-image>
            <a
              :href="url + '/blog/' + scope.row.id"
              target="_blank"
              slot="reference"
              >{{ scope.row.title }}</a
            >
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="文章描述" align="center">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>
      <el-table-column label="浏览数" width="80" align="center">
        <template slot-scope="scope">{{ scope.row.scanNumber }}</template>
      </el-table-column>
      <el-table-column label="评论量" width="80" align="center">
        <template slot-scope="scope">{{ scope.row.commentNumber }}</template>
      </el-table-column>
      <el-table-column label="所属分类" align="center">
        <template slot-scope="scope">{{
          scope.row.category === null ? "未分类" : scope.row.category.name
        }}</template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="220">
        <template slot-scope="scope">{{
          formatDate(scope.row.createDate)
        }}</template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button
              @click="editBannerHandle(scope.row)"
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
            />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button
              @click="removeBlogListHandle(scope.row)"
              type="danger"
              :icon="isLoad ? 'el-icon-loading' : 'el-icon-delete'"
              circle
              size="mini"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      style="margin-top: 30px"
      background
      layout="prev, pager, next,total,->,sizes,jumper"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      :page-sizes="[5, 10, 20]"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getBlog, deleteBlog } from "@/api/blog";
import { server_URL, front_URL } from "@/urlConfig";
import formatDate from "@/utils/formatDate";
export default {
  name: "BlogList",
  data() {
    return {
      data: {},
      isLoad: false,
      front_URL,
      srcList: [],
      pageSize: 5, // 每页显示条目个数
      currentPage: 1, // 当前页数
    };
  },

  computed: {
    // 总条目数
    total() {
      return this.data.total;
    },
    // 最大页码数
    maxPageNumber() {
      return Math.ceil(this.total / this.pageSize);
    },
    url() {
      return location.origin;
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    formatDate,
    // 分页请求文章
    async fetchData() {
      const { data } = await getBlog(this.currentPage, this.pageSize);
      this.data = data;
      this.upImgUrl(this.data.rows);
    },
    // 删除对应文章
    removeBlogListHandle(item) {
      if (this.isLoad) {
        return -1;
      }
      this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          this.isLoad = true;
          deleteBlog(item.id).then(async ({ data }) => {
            if (!data) {
              this.$message.error("删除失败，请检查网络");
              this.isLoad = false;
              return false;
            }
            await this.fetchData();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 判断删除的数据是否为某一页的最后一条数据，如果是的话需要将当前页改为页码最大值，并重新请求数据
            if (this.maxPageNumber < this.currentPage) {
              this.currentPage = this.maxPageNumber;
              this.fetchData();
            }
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
    editBannerHandle({ id }) {
      this.$router.push(`/blog/edit/${id}`);
    },
    // 补全图片地址
    upImgUrl(data) {
      this.data.rows = data.map((item) => {
        return {
          ...item,
          thumb2: server_URL + item.thumb,
        };
      });
      this.data.rows.forEach((item) => this.srcList.push(item.thumb2));
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
  },
};
</script>

<style lang="scss" scoped></style>
