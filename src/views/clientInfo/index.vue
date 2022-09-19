<template>
  <div class="app-container">
    <div class="search-container">
      <el-input v-model="input" placeholder="请输入客户手机号"></el-input>
      <el-button @click="handleSearch" type="primary" class="search"
        >搜索</el-button
      >
    </div>
    <!-- 表格数据 -->
    <el-table :data="dataList" style="width: 100%" border stripe>
      <el-table-column label="序号" width="120" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="设备号" align="center">
        <template slot-scope="scope">{{
          scope.row.deviceClient.serialNumber
        }}</template>
      </el-table-column>
      <el-table-column label="客户名称" align="center">
        <template slot-scope="scope">{{ scope.row.client.name }}</template>
      </el-table-column>
      <el-table-column label="客户电话" align="center">
        <template slot-scope="scope">{{ scope.row.client.tel }}</template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button
              @click="openPopup(scope.row.deviceClient.serialNumber)"
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗框 -->
    <el-dialog
      title="编辑设备参数"
      :visible.sync="dialogFormVisible"
      width="35%"
      fullscreen
    >
      <el-form :model="form">
        <el-form-item
          label="主动轮电机预分频系数"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.dwmfdc"
            placeholder="请输入主动轮电机预分频系数"
          ></el-input>
        </el-form-item>
        <el-form-item label="主动轮电机重装载值" :label-width="formLabelWidth">
          <el-input
            v-model="form.dwmhlv"
            placeholder="请输入主动轮电机重装载值"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="圆弧门电机预分频系数"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.admfdc"
            placeholder="请输入圆弧门电机预分频系数"
          ></el-input>
        </el-form-item>
        <el-form-item label="圆弧门电机重装载值" :label-width="formLabelWidth">
          <el-input
            v-model="form.admhlv"
            placeholder="请输入圆弧门电机重装载值"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="全收纳盘电机预分频系数"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.fsdmfdc"
            placeholder="请输入全收纳盘电机预分频系数"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="全收纳盘电机重装载值"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.fsdmhlv"
            placeholder="请输入全收纳盘电机重装载值"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="1/2收纳盘电机预分频系数"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.stmfdc"
            placeholder="请输入1/2收纳盘电机预分频系数"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="1/2收纳盘电机重装载值"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.stmhlv"
            placeholder="请输入1/2收纳盘电机重装载值"
          ></el-input>
        </el-form-item>
        <el-form-item label="检漏箱偏移量" :label-width="formLabelWidth">
          <el-input
            v-model="form.rbo"
            placeholder="请输入检漏箱偏移量"
          ></el-input>
        </el-form-item>
        <el-form-item label="1/2收纳盘偏移量" :label-width="formLabelWidth">
          <el-input
            v-model="form.stmo"
            placeholder="请输入1/2收纳盘偏移量"
          ></el-input>
        </el-form-item>
        <el-form-item label="全收纳盘偏移量" :label-width="formLabelWidth">
          <el-input
            v-model="form.lrado"
            placeholder="请输入全收纳盘偏移量"
          ></el-input>
        </el-form-item>
        <el-form-item label="传动比" :label-width="formLabelWidth">
          <el-input
            v-model="form.driveRatio"
            placeholder="请输入传动比"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="是否把设置值写入flash标志位"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.writesFlashFlag"
            placeholder="请输入是否把设置值写入flash标志位"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否更新代码标志位" :label-width="formLabelWidth">
          <el-input
            v-model="form.updateCodeFlag"
            placeholder="请输入是否更新代码标志位"
          ></el-input>
        </el-form-item>
        <el-form-item label="脉冲偏移个数" :label-width="formLabelWidth">
          <el-input
            v-model="form.pulseOffsetNumber"
            placeholder="请输入脉冲偏移个数"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="脉冲偏移个数的正负标志位"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.pulseOffsetNumberPlusMinus"
            placeholder="请输入脉冲偏移个数的正负标志位"
          ></el-input>
        </el-form-item>
        <el-form-item label="默认检漏压力" :label-width="formLabelWidth">
          <el-input
            v-model="form.ruleOfPressure"
            placeholder="请输入默认检漏压力"
          ></el-input>
        </el-form-item>
        <el-form-item label="水箱加热" :label-width="formLabelWidth">
          <el-input
            v-model="form.radiatorHeating"
            placeholder="请输入水箱加热"
          ></el-input>
        </el-form-item>
        <el-form-item label="水箱加热温度" :label-width="formLabelWidth">
          <el-input
            v-model="form.radiatorHeatingTemperature"
            placeholder="请输入水箱加热温度"
          ></el-input>
        </el-form-item>
        <el-form-item label="默认速度" :label-width="formLabelWidth">
          <el-input
            v-model="form.speed"
            placeholder="请输入默认速度"
          ></el-input>
        </el-form-item>
        <el-form-item label="空气泵最大的压力" :label-width="formLabelWidth">
          <el-input
            v-model="form.mpoap"
            placeholder="请输入空气泵最大的压力"
          ></el-input>
        </el-form-item>
        <el-form-item label="最低水位高度" :label-width="formLabelWidth">
          <el-input
            v-model="form.lowestWaterLevel"
            placeholder="请输入最低水位高度"
          ></el-input>
        </el-form-item>
        <el-form-item label="恢复出厂设置" :label-width="formLabelWidth">
          <el-input
            v-model="form.factoryReset"
            placeholder="请输入恢复出厂设置"
          ></el-input>
        </el-form-item>
        <el-form-item label="默保压时间" :label-width="formLabelWidth">
          <el-input
            v-model="form.dwellTime"
            placeholder="请输入默保压时间"
          ></el-input>
        </el-form-item>
        <el-form-item label="默认泵水时间" :label-width="formLabelWidth">
          <el-input
            v-model="form.primingTime"
            placeholder="请输入默认泵水时间"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditFacilityConfig"
          >确 定</el-button
        >
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
  getAlldeviceAuthorizationCode,
  getIddeviceAuthorizationCode,
} from "@/api/deviceAuthorizationCode";
import { getPhoneClient } from "@/api/client";
import { getIdFacilityConfig, upFacilityConfig } from "@/api/facilityConfig";
export default {
  data() {
    return {
      dataList: [],
      total: 0,
      pageSize: 10, // 每页显示条目个数
      currentPage: 1, // 当前页数
      input: "",
      dialogFormVisible: false,
      form: {
        clientId: 0, // 客户id
        dwmfdc: "", // 主动轮电机预分频系数
        dwmhlv: "", // 主动轮电机重装载值
        admfdc: "", // 圆弧门电机预分频系数
        admhlv: "", // 圆弧门电机重装载值
        fsdmfdc: "", // 全收纳盘电机预分频系数
        fsdmhlv: "", // 全收纳盘电机重装载值
        stmfdc: "", // 1/2收纳盘电机预分频系数
        stmhlv: "", // 1/2收纳盘电机重装载值
        rbo: "", // 检漏箱偏移量
        stmo: "", // 1/2收纳盘偏移量
        lrado: "", // 全收纳盘偏移量
        driveRatio: "", // 传动比
        writesFlashFlag: "", // 是否把设置值写入flash标志位
        updateCodeFlag: "", // 是否更新过代码标志位
        pulseOffsetNumber: "", // 脉冲偏移个数
        pulseOffsetNumberPlusMinus: "", // 脉冲偏移个数的正负标志位
        ruleOfPressure: "", // 默认检漏压力
        radiatorHeating: "", // 水箱加热
        radiatorHeatingTemperature: "", // 水箱加热温度
        speed: "", // 默认速度
        mpoap: "", // 空气泵最大的压力
        lowestWaterLevel: "", // 最低水位高度
        factoryReset: "", // 恢复出厂设置
        dwellTime: "", // 默保压时间
        primingTime: "", // 默认泵水时间
        id: "",
      },
      formLabelWidth: "180PX",
    };
  },
  computed: {
    // 最大页码数
    maxPageNumber() {
      return Math.ceil(this.total / this.pageSize);
    },
  },
  created() {
    const param = this.$route.params;
    if (param.id === ":id") {
      this.fetchData();
    } else {
      this.getIdDev(param.id);
    }
  },
  methods: {
    fetchData() {
      getAlldeviceAuthorizationCode(this.currentPage, this.pageSize).then(
        ({ code, data }) => {
          if (code === 0) {
            this.dataList = data.dataList;
          }
        }
      );
    },
    handleSearch() {
      if (this.input === "") {
        this.fetchData();
        return;
      }
      getPhoneClient(this.input).then(({ code, data, msg }) => {
        if (code === 0) {
          this.getIdDev(data.id);
        } else {
          this.$message({
            showClose: true,
            message: msg,
            type: "error",
          });
        }
        this.input = "";
      });
    },
    // 通过客户id查询客户的所有设备
    getIdDev(id) {
      getIddeviceAuthorizationCode(id).then(({ code, data, msg }) => {
        if (code === 0) {
          this.dataList = data.dataList;
        } else {
          this.$message({
            showClose: true,
            message: msg,
            type: "error",
          });
          this.dataList = [];
        }
      });
    },
    // 打开编辑弹窗
    openPopup(devId) {
      getIdFacilityConfig(devId).then(({ code, data, msg }) => {
        if (code === 0) {
          this.dialogFormVisible = true;
          this.form = { ...this.form, ...data };
        } else {
          this.$message({
            showClose: true,
            message: msg,
            type: "error",
          });
        }
      });
    },
    // 参数修改完成
    handleEditFacilityConfig() {
      upFacilityConfig(this.form).then(({ code, msg }) => {
        if (code === 0) {
          this.$message({
            type: "success",
            message: msg,
          });
          this.dialogFormVisible = false;
        } else {
          this.$message({
            showClose: true,
            message: msg,
            type: "error",
          });
        }
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
