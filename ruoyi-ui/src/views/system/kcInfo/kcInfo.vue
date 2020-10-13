<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <el-form-item label="存货编码" prop="djNumber">
        <el-input
          v-model="queryParams.djNumber"
          placeholder="请输入单据编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:randomInsp:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:randomInsp:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:randomInsp:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-edit"
          size="mini"
          @click="handleImport"
          v-hasPermi="['system:randomInsp:import']"
          >导入</el-button
        >
      </el-col>
    </el-row> -->

    <el-table
      v-loading="loading"
      :data="leaseList"
      @selection-change="handleSelectionChange"
      row-key="id"
      :summary-method="getSummaries"
       show-summary
    >
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column type="expand">
        <template slot-scope="props">
          <el-table style="padding: 0; margin: 0" :data="props.row.childrenList">
            <el-table-column label="业户名称" align="center" prop="ownerName" />
            
            <el-table-column label="检测物名称" align="center" prop="goodsName" />
          
            <el-table-column label="检测项目" align="center" prop="checkProject" />
         
             <el-table-column label="合格状态" align="center" prop="checkResultName" />
            <el-table-column label="抑制率(%)" align="center" prop="inhibitionNum" />
            <el-table-column label="备注" align="center" prop="remark" />
          </el-table>
        </template>
      </el-table-column> -->
   
      <el-table-column label="仓库名称" align="center" prop="storeName" />
      <el-table-column label="仓库编码" align="center" prop="storeNum" />
      <el-table-column label="存货编码" align="center" prop="goodsCode" />
      <el-table-column label="存货名称" align="center" prop="goodsName" />
      <el-table-column label="规格型号" align="center" prop="goodsGg" />
      <el-table-column label="计量单位" align="center" prop="goodsDw" />
      <el-table-column label="入库总数量" align="center" prop="goodsNums" />
      <el-table-column label="入库总金额" align="center" prop="goodsMoneys" />
      <el-table-column label="出库总数量" align="center" prop="cgoodsNums" />
      <el-table-column label="出库总金额" align="center" prop="cgoodsMoneys" />
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:randomInsp:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:randomInsp:remove']"
          >删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <goods-select
      v-if="selectGoodsDialog"
      ref="selectGoods"
      @selectData="selectData"
      @selectDataMore="selectDataMore"
    ></goods-select>
  </div>
</template>

<script>

import {
 listKcInfo

} from "@/api/system/kcInfo";

import { ownerList } from "@/api/system/owner";
import { getCkAll } from "@/api/system/ck";
import { getInfo } from "@/api/login";
import { getPersonAll } from "@/api/system/person";
import { getToken } from "@/utils/auth";
import { goodsList } from "@/api/system/ownerGoods";
import { getShopList } from "@/api/system/shopInfo";
import { getAllSampAddress } from "@/api/system/sampAddress";
import { getAllDeviceItem } from "@/api/system/deviceItem";
import { listCheck } from "@/api/system/check";
import { listCheckProject } from "@/api/system/checkProject";
export default {
  name: "Lease",
  data() {
    return {
      importUrl:"",
      //用户信息
      user: {
        ownerCode: "",
        ownerName: "",
        ownerNameJc: "",
        sampaddress: "",
        device: ""
      },
      sumNum:0,
       sumNum1:0,
        sumNum2:0,
         sumNum3:0,
      checking: "",
      left: "right",
      place: "",
      numbers: "",
      number: "",
      fileList: [],
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/common/upload"
      },
      //仓库列表
      storeList: [],
      // 门店信息
      shopList: [],
      // 地点列表
      checkaddress: [],
      conderaddress: [],
      // 设备
      conderdevice: [],
      placedevice: "",
      check:"",
      //供应商
      personList: [],
      // 遮罩层
      loading: false,
      selectGoodsDialog: false,
      //选取主市场
      markDatas: [],
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      //子表数据
      tableData: [],
      // 检测项目
      projectList: [],
      // 仓库信息默认
      placeholderone: "",
      // 主表信息表格数据
      leaseList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      iopen:false,
      perationOptions: [],
      operateOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        markCode: undefined,
        djNumber: undefined,
        djTime: undefined
      },
      // 表单参数
      form: {},
      activeName: "first",
      // 表单校验
      rules: {
        inhibitionNum: [
          {
            required: true,
            message: "抑制率标准设定值不能为空",
            trigger: "blur"
          }
        ],
        checkDevice: [
          { required: true, message: "检测设备不能为空", trigger: "blur" }
        ],
        checkAddress: [
          { required: true, message: "采用地点不能为空", trigger: "blur" }
        ],
        // count: [
        //   { required: true, message: "检测通道数量不能为空", trigger: "blur" },
        // ],
        checkNum: [
          { required: true, message: "检测标准不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    ownerList(this.queryParams).then(response => {
      this.personList = response.data;
    });
    listCheckProject(this.queryParams).then(response => {
      this.projectList = response.rows;
      console.log(this.projectList);
    });
    this.getList();
 

 
  
    getInfo().then(response => {
      this.user.ownerCode = response.user.userName;
      this.user.ownerName = response.user.nickName;
      this.user.ownerNameJc = response.user.nickName;
      this.form.djTime = this.getTime();
    });
  },
  methods: {
       getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 6) {
            sums[index] = '数量合计:';
            return;
          }
          if (index === 7) {
            sums[index] = this.sumNum;
            return;
          }
          if (index === 8) {
            sums[index] = this.sumNum1;
            return;
          }
          if (index === 8) {
            sums[index] = this.sumNum2;
            return;
          }
           if (index === 10) {
            sums[index] = this.sumNum3;
            return;
          }
    
         });

        return sums;
      },
    submitUpload() {
        this.$refs.upload.submit();
      },
      /** 导入操作 */
    handleImport() {
      //this.reset();
      this.iopen = true;
      this.title = "导入检测明细";
      const id = this.ids;
      this.importUrl=process.env.VUE_APP_BASE_API + "/system/randomInsp/import";
    },
    //选择供应商
    selectPerson(index, data) {
      //根据编码找产地
      for (let i = 0; i < this.personList.length; i++) {
        if (this.personList[i].ownerCode == data.ownerCode) {
          data.ownerName = this.personList[i].ownerName;
          break;
        }
      }
    },
    changer(value) {
      console.log(this.tableData);
      for (let i = 0; i < this.tableData.length; i++) {
        console.log(this.tableData[i]);
        if (parseFloat(value) > parseFloat(this.tableData[i].inhibitionNum)) {
          this.tableData[i].checkResultName = "合格";
        } else {
          this.tableData[i].checkResultName = "不合格";
        }
      }
    },
    editTime(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    },
    getTime() {
      var date = new Date();
      var year = date.getFullYear(); //得到当前年份
      var month = this.editTime(date.getMonth() + 1); //得到当前月份
      var day = this.editTime(date.getDate()); //得到当前几号
      var hour = this.editTime(date.getHours()); //得到当前小时
      var min = this.editTime(date.getMinutes()); //得到当前分钟
      var seconds = this.editTime(date.getSeconds()); //得到当前秒
      var weeks = date.getDay();
      var week;
      switch (weeks) {
        case 0:
          week = "星期日";
          break;
        case 1:
          week = "星期一";
          break;
        case 2:
          week = "星期二";
          break;
        case 3:
          week = "星期三";
          break;
        case 4:
          week = "星期四";
          break;
        case 5:
          week = "星期五";
          break;
        case 6:
          week = "星期六";
          break;
      }
      return year + "-" + month + "-" + day;
    },
    //追加子表必填样式
    starAdd(obj) {

    },
  
    clickFile(file) {
      if (file.url != "") {
        window.location.href = file.url;
      }
    },
    handleFileSuccess(res, file, fileList) {
      // 上传成功
      console.log(res.url);
      this.form.fileName = res.url;
    },
    handleSuccess(res, file, fileList) {
       this.getList();
    },
    handleRemove(file, fileList) {
      this.form.fileName = "";
    },
    //选择客户
    selectOwner(data) {},
    //选择仓库
    selectStore(data) {
      //根据仓库编码查找仓库名称
      for (let i = 0; i < this.storeList.length; i++) {
        if (this.storeList[i].ckCode == data) {
          this.form.storeName = this.storeList[i].ckName;
          break;
        }
      }
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    handleCurrentChange(row, event, column) {
      console.log(row, event, column, event.currentTarget);
    },
    handleEdit(index, row) {
      if (
        row.ai != "" &&
        row.ai != null &&
        row.ai != undefined &&
        row.af != "" &&
        row.af != null &&
        row.af != undefined
      ) {
        row.afAi = (parseFloat(row.af) - parseFloat(row.ai)).toFixed(2);
        // row.goodsMoneyRate=row.goodsMoney;
      }

      if (
        this.form.inhibitionNum != "" &&
        this.form.inhibitionNum != null &&
        this.form.inhibitionNum != undefined
      ) {
        if (
          row.inhibitionNum != "" &&
          row.inhibitionNum != null &&
          row.inhibitionNum != undefined
        ) {
          if (
            parseFloat(row.inhibitionNum) > parseFloat(this.form.inhibitionNum)
          ) {
             row.checkResult = 0;
            row.checkResultName = "不合格";
          } else {
            row.checkResult = 1;
            row.checkResultName = "合格";
          }
        }
      } else {
        console.log(this.form.inhibitionNum);
        this.msgError("请先填写抑制率标准设定值!");
        return;
      }
    },
    handleEditPerson(data, index, row) {
      //根据编码找产地
      for (let i = 0; i < this.goodsList.length; i++) {
        console.log(this.goodsList[i].objectNum == data);
        if (this.goodsList[i].objectNum == data) {
          row.goodsAddress = this.goodsList[i].goodsAddress;
          row.goodsDw = this.goodsList[i].goodsDw;
          row.goodsName = this.goodsList[i].objectName;
          break;
        }
      }
    },
    getSumMoney(index, row) {
      //计算总金额
      let sumMoney = 0;
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].goodsCode != "") {
          sumMoney += parseFloat(this.tableData[i].goodsCode);
        }
      }
      this.form.storeName = sumMoney.toString();
      console.log(this.form);
      // console.log(row.goodsCode);
    },
    handleChildDelete(index, row) {
      if (row.id != "" && row.id != undefined && row.id != null) {
        delRandomInspChild(row.id);
        this.tableData.splice(index, 1);
      } else {
        this.tableData.splice(index, 1);
      }
      console.log(index, row);
    },
    /** 操作 */
    goodsSelect() {
      this.selectGoodsDialog = true;
      this.$nextTick(() => {
        this.$refs.selectGoods.visible = true;
      });
    },
    //选择数据

    selectData(row) {
      //  this.selectGoodsDialog=false;
      this.$nextTick(() => {
        //检查是否存在重复数据
        // for (let i = 0; i < this.tableData.length; i++) {
        //   if (row.objectNum == this.tableData[i].objectNum) {
        //     this.msgError("信息重复!");
        //     return;
        //   }
        // }

        let goodsInfo = new Object();
        goodsInfo.goodsCode = row.objectNum;
        goodsInfo.goodsName = row.objectName;
        goodsInfo.ai = "";
        goodsInfo.af = "";
        goodsInfo.afAi = "";
        goodsInfo.checkResult = "";
        goodsInfo.checkResultName = "";
        goodsInfo.goodsRate = "0";
        //goodsInfo.goodsWeight = "";
        goodsInfo.remark = "";
        this.tableData.push(goodsInfo);
        this.$refs.selectGoods.visible = false;
      });
    },
    //批量选择数据
    selectDataMore(rows) {
      //  this.selectGoodsDialog=false;
      this.$nextTick(() => {
        //检查是否存在重复数据
        // for (let i = 0; i < this.tableData.length; i++) {
        //   if (row.objectNum == this.tableData[i].objectNum) {
        //     this.msgError("信息重复!");
        //     return;
        //   }
        // }

        console.log(rows);
        for (let i = 0; i < rows.length; i++) {
          let row = rows[i];
          let goodsInfo = new Object();
          goodsInfo.goodsCode = row.objectNum;
          goodsInfo.goodsName = row.objectName;
          goodsInfo.ai = "";
          goodsInfo.af = "";
          goodsInfo.afAi = "";
          goodsInfo.checkResult = "";
          goodsInfo.checkResultName = "";
          goodsInfo.goodsRate = "0";
          this.tableData.push(goodsInfo);
        }
        this.$refs.selectGoods.visible = false;
      });
    },
    /** 查询二级市场信息列表 */
    getList() {
      this.loading = true;
      listKcInfo(this.queryParams).then(response => {
        this.leaseList = response.rows;
        for(let i=0;i<response.rows.length;i++){
          this.sumNum+=parseFloat(response.rows[i].goodsNums);
          this.sumNum1+=parseFloat(response.rows[i].goodsMoneys);
          this.sumNum2+=parseFloat(response.rows[i].cgoodsNums);
          this.sumNum3+=parseFloat(response.rows[i].cgoodsMoneys);
        }
        this.total = response.total;
       this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        djNumber: undefined,
        djTime: this.getTime(),
        storeCode: undefined,
        storeName: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        fileName: undefined,
        isRate: 0,
        rows: "",
        sampBz: undefined,
        sampAddress: undefined,
        sampAddressPerson: undefined,
        sampAddressPersonTel: undefined,
        inhibitionNum: this.number,
        checkNum: this.numbers,
        afAi: undefined,
        checkResult: undefined,
        ai: undefined,
        af: undefined
      };
      this.resetForm("form");
      this.form.checkAddress=this.check;
      this.form.sampAddress=this.place;
      this.form.checkDevice=this.placedevice;
      this.tableData = [];
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "随机抽检单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getRandomInsp(id).then(response => {
        this.form = response.data;
        if (response.data.fileName != "") {
          this.fileList = [];
          let info = new Object();
          info.name = response.data.fileName;
          info.url = response.data.fileName;
          this.fileList.push(info);
        }
        // 查询参数
        let queryParams = {
          djNumber: this.form.djNumber
        };
        listRandomInspChild(queryParams).then(response => {
          //this.form.rows = response.data;
          this.tableData = response.rows;
        });
        this.open = true;
        this.title = "修改取样地点信息";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      console.log(this.tableData.length);
      console.log(this.tableData);
      if (this.tableData.length > 0) {
        //检查子表信息
        for (let i = 0; i < this.tableData.length; i++) {
          console.log(this.tableData[i]);
          if (
            this.tableData[i].objectNum == "" ||
            // this.tableData[i].ai == "" ||
            // this.tableData[i].af == "" ||
            this.tableData[i].inhibitionNum == ""
          ) {
            this.msgError("检查明细信息必填项!");
            return;
          }
        }
        this.form.rows = JSON.stringify(this.tableData);
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateRandomInsp(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                  this.$refs.selectGoods.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              addRandomInsp(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                  this.$refs.selectGoods.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            }
          }
        });
      } else {
        this.msgError("请填写子表信息!");
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除单据编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delRandomInsp(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    /** 生效按钮操作 */
    handleEffect(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认单据编号为"' + ids + '"的数据项已生效?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return updateCgrkdStatus(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("操作成功");
        })
        .catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有租赁单据数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportRandomInsp(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>
<style>
.cell .el-select + span {
  display: none;
}
.cell .el-input + span {
  display: none;
}
.el-table__expanded-cell {
  padding: 0 !important;
  margin: 0 !important;
}
.tb-edit .el-input {
  display: block !important;
}
.tb-edit .current-row .el-input {
  display: block;
}
.tb-edit .current-row .el-input + span {
  display: none;
}
.tb-edit .current-row .el-select {
  display: block;
}
.tb-edit .current-row .el-select + span {
  display: none;
}
table th.star div::after {
  content: "*";
  color: red;
}
.el-input.is-disabled .el-input__inner {
  color: #606266;
}
.changeBlue .el-form-item__label {
  color: #1890ff;
}

.pig .el-form-item__content {
  width: 215px;
}
#djTitles .el-form-item__content {
  width: 630px;
}
#djTitles .el-input--medium .el-input__inner {
  height: 70px;
}
#djTitless .el-form-item__content {
  width: 630px;
}
</style>