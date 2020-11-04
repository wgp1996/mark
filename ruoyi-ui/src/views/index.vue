<template>
  <div class="dashboard-editor-container">
    <panel-group
      @handleSetLineChartData="handleSetLineChartData"
      @handleSetLineChart="handleSetLineChart"
    />

    <el-row
      style="background: #fff; padding: 0px; margin-bottom: 32px"
      v-if="purchases"
    >
      <!-- <line-chart :chart-data="lineChartData" /> -->
      <div style="text-align: center; background-color: #eee">
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
          v-show="total0 > 0"
          :total="total0"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="handleSetLineChartDatas('purchases')"
        />
      </div>
    </el-row>
    <el-row
      style="background: #fff; padding: 0px; margin-bottom: 32px"
      v-if="newVisitis"
    >
      <!-- <line-chart :chart-data="lineChartData" /> -->
      <div style="text-align: center; background-color: #eee">
        <el-table v-loading="loading" :data="ownerList">
          <el-table-column type="selection" width="55" align="center" />
          <!-- <el-table-column label="所属市场" align="center" prop="markTypeName" /> -->
          <el-table-column label="业户编号" align="center" prop="ownerCode" />
          <el-table-column
            label="业户名称"
            align="center"
            prop="ownerName"
            width="300"
          />
          <el-table-column
            label="信用代码/身份证号"
            align="center"
            prop="ownerPersonId"
          />
          <el-table-column label="联系人" align="center" prop="ownerLxr" />
          <el-table-column label="电话" align="center" prop="ownerLxrPhone" />
          <el-table-column label="创建日期" align="center" prop="createTime" />
        </el-table>
        <pagination
          v-show="total1 > 0"
          :total="total1"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="handleSetLineChartDatas('newVisitis')"
        />
      </div>
    </el-row>
    <!-- 随机抽检单 -->
    <el-row v-if="random">
      <el-table v-loading="loading" :data="randomList" row-key="id">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column type="expand"> -->
        <!-- <template slot-scope="props"> -->
        <!-- <el-table style="padding: 0; margin: 0" :data="props.row.childrenList"> -->
        <el-table-column label="单号" align="center" prop="djNumber" />
        <el-table-column label="检测日期" align="center" prop="testResult" />
        <el-table-column label="业户名称" align="center" prop="ownerName" />

        <el-table-column label="检测物名称" align="center" prop="goodsName" />

        <el-table-column label="检测项目" align="center" prop="checkProject" />

        <el-table-column
          label="合格状态"
          align="center"
          prop="checkResultName"
        />
        <el-table-column
          label="抑制率(%)"
          align="center"
          prop="inhibitionNum"
        />
        <el-table-column label="备注" align="center" prop="remark" />
        <!-- </el-table> -->
        <!-- </template> -->
        <!-- </el-table-column> -->
        <!-- 
      <el-table-column label="单据编号" align="center" prop="djNumber" />
      <el-table-column label="单据日期" align="center" prop="djTime" />

      <el-table-column label="采用地点" align="center" prop="checkAddress" />

      <el-table-column label="抑制率标准值" align="center" prop="inhibitionNum" />
      <el-table-column label="检测说明" align="center" prop="djTitle" /> -->
      </el-table>
      <pagination
        v-show="total2 > 0"
        :total="total2"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="handleSetLineChartDatas('random')"
      />
    </el-row>
    <el-row v-if="shoppings">
      <el-table
        v-loading="loading"
        :data="List"
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="销货日期"
          width="100"
          align="center"
          prop="remark"
        />
        <el-table-column label="业户名称" align="center" prop="createBy" />
        <el-table-column label="客户名称" align="center" prop="khName" />
        <!-- <el-table-column label="商品编号" align="center" prop="goodsCode" /> -->
        <el-table-column label="商品名称" align="center" prop="goodsName" />
        <el-table-column
          label="单位"
          width="80"
          align="center"
          prop="wholeDw"
        />
        <el-table-column
          label="销售量"
          width="80"
          align="center"
          prop="wholeNum"
        />
        <el-table-column
          label="单价"
          width="80"
          align="center"
          prop="wholePrice"
        />
        <el-table-column
          label="金额"
          width="80"
          align="center"
          prop="wholeMoney"
        />
      </el-table>
      <pagination
        v-show="total3 > 0"
        :total="total3"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="handleSetLineChartDatas('shoppings')"
      />
    </el-row>
    <el-row
      style="
        background: #fff;
        padding: 16px 16px 16px;
        margin-bottom: 0px;
        height: auto;
      "
    >
      <line-img />
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
import PanelGroup from "./dashboard/PanelGroup";
import LineChart from "./dashboard/LineChart";
import LineImg from "./dashboard/LineImg";
import RaddarChart from "./dashboard/RaddarChart";
import PieChart from "./dashboard/PieChart";
import BarChart from "./dashboard/BarChart";
import { rkdSummaryList } from "@/api/system/cgrkd";
import { listOwner } from "@/api/system/owner";
import { listCgrkdSingle } from "@/api/system/cgrkdSingle";
import {
  listWholeSales,
  getWholeSales,
  getWholeSalesChild,
  delWholeSales,
  delWholeSalesChild,
  addWholeSales,
  updateWholeSales,
  updateWholeSalesStatus,
  exportWholeSales,
  selectWholeAllList,
} from "@/api/system/wholeSales";
import { listRandomInsp } from "@/api/system/randomInsp";
const lineChartData = {
  newVisitis: {
    expectedData: [2.5, 3.5, 3.15, 2.7, 5.78, 3.15, 4.25],
    actualData: [2.7, 3.4, 2.98, 3.2, 4.99, 2.98, 4.75],
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130],
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130],
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130],
  },
};

export default {
  name: "Index",
  components: {
    PanelGroup,
    LineChart,
    LineImg,
    RaddarChart,
    PieChart,
    BarChart,
  },
  data() {
    return {
      type: "purchases",
      sumNum: 0,
      // 主表信息表格数据
      //  溯源单据
      leaseList: [],
      // 节点业户
      ownerList: [],
      // 销货单据
      List: [],
      //  随机抽检单
      randomList: [],
      lineChartData: lineChartData.newVisitis,
      // 总条数
      total0: 0,
      total1: 0,
      total2: 0,
      total3: 0,
      /** 查询二级市场信息列表 */
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        markCode: undefined,
        djNumber: undefined,
        djTime: undefined,
        markType: undefined,
      },
      newVisitis: false,
      // messages:false,
      purchases: true,
      // shopping:false,
      shoppings: false,
      random: false,
    };
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 5) {
          sums[index] = "进货总数:";
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
        this.sumNum = 0;
        this.leaseList = response.rows;
        for (let i = 0; i < response.rows.length; i++) {
          this.sumNum += parseFloat(response.rows[i].sumNum);
          //  alert(this.sumNum)
        }
        this.total0 = response.total;
        this.loading = false;
      });
      // listOwner(this.queryParams).then(response => {
      //   this.ownerList = response.rows;
      //   this.total1 = response.total;
      //   this.loading = false;
      //   this.sumNum=0
      // });
      // selectWholeAllList(this.queryParams).then((response) => {
      //   this.List = response.rows;
      //   console.log(this.List)
      //    this.sumNum=0;
      //   for(let i=0;i<response.rows.length;i++){
      //       if(response.rows[i].wholeMoney==null||response.rows[i].wholeMoney==""||response.rows[i].wholeMoney==undefined){
      //        response.rows[i].wholeMoney='0';
      //      }else{
      //         //  alert(response.rows[i].wholeMoney)
      //        this.sumNum+=parseFloat(response.rows[i].wholeMoney);
      //      }

      //   }
      //   this.sumNum=this.sumNum.toFixed(2)

      //   this.total3 = response.total;
      //   this.loading = false;
      // });
      // listRandomInsp(this.queryParams).then(response => {
      //   this.randomList = response.rows;

      //   this.total2 = response.total;
      //  // this.checking = response.rows[0].checkAddress;
      //   this.loading = false;
      // });
    },
    handleSetLineChart(type) {
      this.queryParams.markType = type;
      this.handleSetLineChartData(this.type);
    },
    handleSetLineChartData(type) {
      this.type = type;
      this.loading = true;
      // this.lineChartData = lineChartData[type]
      if (type == "newVisitis") {
        // 节点业户
        this.newVisitis = true;
        this.purchases = false;
        this.shoppings = false;
        this.random = false;
        listOwner(this.queryParams).then((response) => {
          this.ownerList = response.rows;
          this.total1 = response.total;
          this.loading = false;
          this.sumNum = 0;
        });
        this.queryParams.pageNum = 1;
      } else if (type == "purchases") {
        // 溯源单据
        this.purchases = true;
        this.newVisitis = false;
        this.shoppings = false;
        this.random = false;
        rkdSummaryList(this.queryParams).then((response) => {
          console.log(response);
          this.leaseList = response.rows;
          this.sumNum = 0;
          for (let i = 0; i < response.rows.length; i++) {
            // alert(this.sumNum)

            this.sumNum += parseFloat(response.rows[i].sumNum);
          }
          this.total0 = response.total;
          this.loading = false;
        });
        this.queryParams.pageNum = 1;
      } else if (type == "shoppings") {
        // 销货单据
        this.shoppings = true;
        this.newVisitis = false;
        this.purchases = false;
        this.random = false;
        selectWholeAllList(this.queryParams).then((response) => {
          this.List = response.rows;
          console.log(this.List);
          this.sumNum = 0;
          for (let i = 0; i < response.rows.length; i++) {
            if (
              response.rows[i].wholeMoney == null ||
              response.rows[i].wholeMoney == "" ||
              response.rows[i].wholeMoney == undefined
            ) {
              response.rows[i].wholeMoney = "0";
            } else {
              //  alert(response.rows[i].wholeMoney)
              this.sumNum += parseFloat(response.rows[i].wholeMoney);
            }
          }
          this.sumNum = this.sumNum.toFixed(2);

          this.total3 = response.total;
          this.loading = false;
        });
        this.queryParams.pageNum = 1;
      } else if (type == "random") {
        this.shoppings = false;
        this.newVisitis = false;
        this.purchases = false;
        this.random = true;
        listRandomInsp(this.queryParams).then((response) => {
          this.randomList = response.rows;

          this.total2 = response.total;
          // this.checking = response.rows[0].checkAddress;
          this.loading = false;
        });
        this.queryParams.pageNum = 1;
      } else {
        // 溯源单据
        this.purchases = true;
        this.newVisitis = false;
        this.shoppings = false;
        this.random = false;
        rkdSummaryList(this.queryParams).then((response) => {
          console.log(response);
          this.leaseList = response.rows;
          this.sumNum = 0;
          for (let i = 0; i < response.rows.length; i++) {
            // alert(this.sumNum)

            this.sumNum += parseFloat(response.rows[i].sumNum);
          }
          this.total0 = response.total;
          this.loading = false;
        });
        this.queryParams.pageNum = 1;
      }
    },
    handleSetLineChartDatas(type) {
      this.loading = true;
      // this.lineChartData = lineChartData[type]
      if (type == "newVisitis") {
        // 节点业户
        this.newVisitis = true;
        this.purchases = false;
        this.shoppings = false;
        this.random = false;
        listOwner(this.queryParams).then((response) => {
          this.ownerList = response.rows;
          this.total1 = response.total;
          this.loading = false;
          this.sumNum = 0;
        });
      } else if (type == "purchases") {
        // 溯源单据
        this.purchases = true;
        this.newVisitis = false;
        this.shoppings = false;
        this.random = false;
        rkdSummaryList(this.queryParams).then((response) => {
          console.log(response);
          this.leaseList = response.rows;
          this.sumNum = 0;
          for (let i = 0; i < response.rows.length; i++) {
            // alert(this.sumNum)

            this.sumNum += parseFloat(response.rows[i].sumNum);
          }
          this.total0 = response.total;
          this.loading = false;
        });
      } else if (type == "shoppings") {
        // 销货单据
        this.shoppings = true;
        this.newVisitis = false;
        this.purchases = false;
        this.random = false;
        selectWholeAllList(this.queryParams).then((response) => {
          this.List = response.rows;
          console.log(this.List);
          this.sumNum = 0;
          for (let i = 0; i < response.rows.length; i++) {
            if (
              response.rows[i].wholeMoney == null ||
              response.rows[i].wholeMoney == "" ||
              response.rows[i].wholeMoney == undefined
            ) {
              response.rows[i].wholeMoney = "0";
            } else {
              //  alert(response.rows[i].wholeMoney)
              this.sumNum += parseFloat(response.rows[i].wholeMoney);
            }
          }
          this.sumNum = this.sumNum.toFixed(2);

          this.total3 = response.total;
          this.loading = false;
        });
      } else if (type == "random") {
        this.shoppings = false;
        this.newVisitis = false;
        this.purchases = false;
        this.random = true;
        listRandomInsp(this.queryParams).then((response) => {
          this.randomList = response.rows;

          this.total2 = response.total;
          // this.checking = response.rows[0].checkAddress;
          this.loading = false;
        });
      }
    },
  },
  created() {
    this.getList();
  },
};
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
.el-carousel__container {
  height: 400px;
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
