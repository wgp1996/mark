<template>
  <div class="dashboard-editor-container">

    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:0px;margin-bottom:32px;">
      <!-- <line-chart :chart-data="lineChartData" /> -->
      <div style="text-align:center;background-color:#eee">
      <el-table
      v-loading="loading"
      :summary-method="getSummaries"
       show-summary
      :data="leaseList"
      row-key="id"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="业户代码" align="center" prop="createBy" />
      <el-table-column label="业户名称" align="center" prop="createName" />
      <el-table-column label="进货日期" align="center" prop="djTime" />
      <el-table-column label="进货商品" align="center" prop="goodsName" />
      <el-table-column label="单位" align="center" prop="goodsDw" />
      <el-table-column label="产地" align="center" prop="goodsAddress" />
    </el-table>
     <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

      </div>
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 16px;margin-bottom:32px;height:auto">
      <line-img  />
    </el-row>
    <el-row :gutter="32">
      <el-col :xs="35" :sm="35" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="35" :sm="35" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="35" :sm="35" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    
  </div>
</template>

<script>
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import LineImg from './dashboard/LineImg'
import RaddarChart from './dashboard/RaddarChart'
import PieChart from './dashboard/PieChart'
import BarChart from './dashboard/BarChart'
import {
  rkdSummaryList
} from "@/api/system/cgrkd";
const lineChartData = {
  newVisitis: {
    expectedData: [2.5, 3.5, 3.15, 2.7, 5.78, 3.15, 4.25],
    actualData: [2.7, 3.4, 2.98, 3.2, 4.99, 2.98, 4.75]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'Index',
  components: {
    PanelGroup,
    LineChart,
    LineImg,
    RaddarChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      sumNum:0,
       // 主表信息表格数据
      leaseList: [],
      lineChartData: lineChartData.newVisitis,
       // 总条数
      total: 0,
        /** 查询二级市场信息列表 */
        // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        markCode: undefined,
        djNumber: undefined,
        djTime: undefined,
      },
    }
  },
  methods: {
    getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 5) {
            sums[index] = '进货总数:';
            return;
          }
          if (index === 6) {
            sums[index] = this.sumNum;
            return;
          }
        //   const values = data.map(item => Number(item[column.property]));
        //   if (!values.every(value => isNaN(value))) {
        //     sums[index] = values.reduce((prev, curr) => {
        //       const value = Number(curr);
        //       if (!isNaN(value)) {
        //         return prev + curr;
        //       } else {
        //         return prev;
        //       }
        //     }, 0);
        //     sums[index] += ' 元';
        //   } else {
        //     sums[index] = 'N/A';
        //   }
         });

        return sums;
      },
    getList() {
      this.loading = true;
      rkdSummaryList(this.queryParams).then((response) => {
        this.leaseList = response.rows;
        for(let i=0;i<response.rows.length;i++){
          this.sumNum+=parseFloat(response.rows[i].sumNum);
        }
        this.total = response.total;
        this.loading = false;
      });
    },
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  },
    created() {
    this.getList();
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
.el-carousel__container{
  height:400px
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
