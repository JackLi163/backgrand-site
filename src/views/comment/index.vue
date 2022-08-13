<template>
  <div class="app-container">
    <el-table :data="dataList.rows" style="width: 100%" border>
      <el-table-column label="序号" align="center" width="80">
        <template slot-scope="scope">{{
          scope.$index + pageSize * (currentPage - 1) + 1
        }}</template>
      </el-table-column>
      <el-table-column label="头像" align="center" width="100">
        <template slot-scope="scope"
          ><div class="avatar">
            <el-image
              style="width: 30px; display: block"
              :src="scope.row.avatar"
              fit="cover"
            ></el-image></div
        ></template>
      </el-table-column>
      <el-table-column label="昵称" align="center">
        <template slot-scope="scope">{{ scope.row.nickname }}</template>
      </el-table-column>
      <el-table-column label="评论文章" align="center">
        <template slot-scope="scope">{{ scope.row.blog.title }}</template>
      </el-table-column>
      <el-table-column label="评论内容" align="center">
        <template slot-scope="scope">{{ scope.row.content }}</template>
      </el-table-column>
      <el-table-column label="评论日期" align="center">
        <template slot-scope="scope">{{
          formatData(scope.row.createDate)
        }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="80">
        <template slot-scope="scope"
          ><el-tooltip
            class="item"
            effect="dark"
            content="删除"
            placement="top"
          >
            <el-button
              type="danger"
              :icon="isLoad ? 'el-icon-loading' : 'el-icon-delete'"
              circle
              @click="removeBlogListHandle(scope.row)"
              size="mini"
            /> </el-tooltip
        ></template>
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
import { getComment, deleteComment } from "@/api/comment";
import formatData from "@/utils/formatDate";
export default {
  name: "Comment",
  data() {
    return {
      dataList: {},
      isLoad: false,
      pageSize: 5, // 每页显示条目个数
      currentPage: 1, // 当前页数
    };
  },
  computed: {
    // 总条目数
    total() {
      return this.dataList.total;
    },
    // 最大页码数
    maxPageNumber() {
      return Math.ceil(this.total / this.pageSize);
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const { data } = await getComment(this.currentPage, this.pageSize);
      this.dataList = data;
    },
    formatData,
    // 删除对应评论
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
          deleteComment(item.id).then(async ({ data }) => {
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

<style lang="scss" scoped>
.avatar {
  width: 30px;
  background: #c0c4cc;
  border-radius: 5px;
  display: inline-block;
}
</style>
