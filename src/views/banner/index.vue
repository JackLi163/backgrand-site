<template>
  <div class="app-container">
    <!-- 表格数据 -->
    <el-table :data="dataList" style="width: 100%" border>
      <el-table-column label="序号" width="80" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="标题" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column label="描述">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>
      <el-table-column label="中图预览" align="center">
        <template slot-scope="scope">
          <el-image style="width: 100px" :src="scope.row.midImg" fit="cover" />
        </template>
      </el-table-column>
      <el-table-column label="大图预览" align="center">
        <template slot-scope="scope">
          <el-image style="width: 100px" :src="scope.row.bigImg" fit="cover" />
        </template>
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
              @click="removeBannerHandle(scope.row)"
              type="danger"
              :icon="isLoad ? 'el-icon-loading' : 'el-icon-delete'"
              circle
              size="mini"
            />
            <!-- el-icon-delete -->
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑数据 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" top="5vh">
      <el-form :model="form">
        <el-form-item label="标题">
          <el-input
            v-model="form.title"
            placeholder="请输入标题"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            resize="none"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="form.description"
          >
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="首页中图">
              <Upload v-model="form.midImg" /> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item label="首页大图">
              <Upload v-model="form.bigImg" /> </el-form-item
          ></el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editBannerConfig">确 定</el-button>
      </div>
    </el-dialog>
    <el-tooltip
      class="item"
      effect="dark"
      content="添加标语"
      placement="top-start"
    >
      <div class="add" @click="addBannerHandle">
        <i class="el-icon-circle-plus-outline"></i>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
import { getBanner, setBanner } from "@/api/banner";
// import { server_URL } from "@/urlConfig";
import Upload from "@/components/Upload";
import { formContentIsNull } from "@/utils/formContentIsNull"; // 该函数作用用于判断是否存在空值
export default {
  name: "Banner",
  components: {
    Upload,
  },
  data() {
    return {
      dataList: [],
      title: "",
      dialogFormVisible: false,
      form: {
        midImg: "",
        bigImg: "",
        title: "",
        description: "",
        id: "",
      },
      isLoad: false,
    };
  },
  async created() {
    const { data } = await this.asynCbanner();
    this.dataList = data;
  },
  methods: {
    async asynCbanner() {
      return await getBanner();
    },
    // upImgUrl(data) {
    //   this.dataList = data.map((item) => {
    //     return {
    //       ...item,
    //       midImg2: server_URL + item.midImg,
    //       bigImg2: server_URL + item.bigImg,
    //     };
    //   });
    // },
    // 删除列表
    async removeBannerHandle(item) {
      if (this.isLoad) {
        return -1;
      }
      this.isLoad = true;
      this.dataList = this.dataList
        .filter((i) => i.id !== item.id)
        .map((i) => {
          if (delete i.id) {
            return i;
          }
        });
      const dataList = await setBanner(this.dataList);
      this.isLoad = false;
      this.dataList = dataList.data ? dataList.data : [];
      // this.upImgUrl(this.dataList);
    },
    // 打开编辑界面
    editBannerHandle(item) {
      this.form = { ...item };
      this.title = "请编辑信息";
      this.dialogFormVisible = true;
    },
    // 确定上传
    async editBannerConfig() {
      let data = [];
      if (this.title === "请编辑信息") {
        data = this.editDataList(this.dataList);
        if (!data) {
          this.$message({
            message: "请将信息填写完整",
            type: "warning",
          });
          return -1;
        }
        this.$message({
          message: "编辑成功",
          type: "success",
        });
      } else {
        data = this.addDataList(this.dataList);
        if (!data) {
          this.$message({
            message: "请将信息填写完整",
            type: "warning",
          });
          return -1;
        }
        this.$message({
          message: "添加成功",
          type: "success",
        });
      }
      this.dialogFormVisible = false;
      this.dataList = (await setBanner(data)).data;
      // this.upImgUrl(this.dataList);
    },
    // 添加首页标语
    addBannerHandle() {
      this.title = "请添加标语";
      this.dialogFormVisible = true;
      this.form = {
        midImg: "",
        bigImg: "",
        title: "",
        description: "",
        id: "",
      };
    },
    // 编辑列表数组
    editDataList(data) {
      if (formContentIsNull(this.form)) {
        return false;
      }
      return data.map((item) => {
        if (item.id === this.form.id) {
          return this.form;
        }
        return item;
      });
    },
    // 添加列表数组
    addDataList(data) {
      if (formContentIsNull(this.form)) {
        return false;
      }
      return data ? data.push(this.form) && data : this.form;
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes add {
  0% {
    transform: translateY(-5px);
  }
  50% {
    transform: translateY(5px);
  }
  100% {
    transform: translateY(-5px);
  }
}
.add {
  position: fixed;
  border-radius: 50%;
  right: 20px;
  bottom: 20px;
  cursor: pointer;
  transition: all 0.5s;
  animation: add 2s infinite;
  box-shadow: -2px 2px 10px rgba($color: #000000, $alpha: 0.5);
  i {
    font-size: 38px;
    color: #fff;
    border-radius: 50%;
    background: #409eff;
  }
  &:hover {
    animation-play-state: paused;
  }
}
</style>
