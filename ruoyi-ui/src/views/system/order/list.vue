<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <el-form-item label="单据编号" prop="djNumber">
        <el-input
          v-model="queryParams.djNumber"
          placeholder="请输入单据编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
        <el-form-item label="选择状态:" prop="isRate" >
              <el-radio-group v-model="queryParams.returnType">
                  <el-radio :label="0" >未处理</el-radio>
                  <el-radio :label="1">已处理</el-radio>
              </el-radio-group>
         </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:order:receive']"
        >接收</el-button>
      </el-col>
       <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="rkdRefuse"
          v-hasPermi="['system:order:refuse']"
        >拒绝接收</el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="leaseList"
      @selection-change="handleSelectionChange"
      row-key="id"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table style="padding:0;margin:0" :data="props.row.childrenList" id="special">
            <el-table-column label="商品名称" align="center" prop="goodsName" />
            <el-table-column label="商品单位" align="center" prop="goodsDw" />
            <el-table-column label="数量" align="center" prop="goodsNum" />
            <el-table-column label="单价" align="center" prop="goodsPrice" /> 
            <el-table-column label="产地" align="center" prop="goodsAddress" /> 
            <el-table-column label="金额" align="center" prop="goodsMoney" /> 
            <el-table-column label="税率(%)" align="center" prop="goodsRate" /> 
            <el-table-column label="单价(含税)" align="center" prop="goodsPriceRate" /> 
            <el-table-column label="金额(含税)" align="center" prop="goodsMoneyRate" /> 
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="单据状态" align="center" prop="statusName" />
      <el-table-column label="单号" align="center" prop="djNumber" />
      <el-table-column label="订购单位编码" align="center" prop="personCode" />
      <el-table-column label="订单单位名称" align="center" prop="personName" />
      <el-table-column label="制单日期" align="center" prop="createTime" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog :title="title" :visible.sync="ropen" width="600px">
        <el-form ref="returnForm" :model="form" :rules="rules" label-width="120px">
             <el-form-item label="拒绝原因" prop="isRate" >
              <el-radio-group v-model="form.returnType">
                  <el-radio :label="0" >其他原因</el-radio>
                  <el-radio :label="1">无货</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注信息" prop="createBy">
              <el-input type="textarea" v-model="form.returnNote" placeholder="请输入备注信息" />
            </el-form-item>
          </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="RefuseSubmitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
    </el-dialog>
    <!-- 添加或修改二级市场信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="明细信息" name="second">
          <el-table
            :data="tableData"
            class="tb-edit"
            style="width: 100%"
            highlight-current-row
            @row-click="handleCurrentChange"
            :header-cell-class-name="starAdd"
          >
            <el-table-column prop="goodsName" label="商品名称" width="150">
              <template scope="scope">
                <el-input
                  :disabled="true"
                  size="small"
                  v-model="scope.row.goodsName"
                  placeholder="请输入内容"
                ></el-input>
                <span>{{scope.row.goodsName}}</span>
              </template>
            </el-table-column>
             <el-table-column prop="goodsDw" label="单位" width="120">
              <template scope="scope">
                <el-input
                  :disabled="true"
                  size="small"
                  v-model="scope.row.goodsDw"
                  placeholder="请输入单位信息"
                ></el-input>
                <span>{{scope.row.goodsDw}}</span>
              </template>
            </el-table-column>
             <el-table-column label="产地信息" width="200">
              <template scope="scope">
                <el-input
                  
                  size="small"
                  v-model="scope.row.goodsAddress"
                  placeholder="请输入产地信息"
                ></el-input>
                <span>{{scope.row.goodsAddress}}</span>
              </template>
            </el-table-column>
            <el-table-column label="单价" width="120">
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.goodsPrice"
                  placeholder="请输入单价"
                  @change="handleEdit(scope.$index, scope.row)"
                ></el-input>
                <span>{{scope.row.goodsPrice}}</span>
              </template>
            </el-table-column>
            <el-table-column label="数量" width="120">
              <template scope="scope">
                <el-input
                :disabled="true"
                  size="small"
                  v-model="scope.row.goodsNum"
                  placeholder="请输入数量"
                  :onkeyup="scope.row.goodsNum=scope.row.goodsNum.replace(/[^\d.]/g,'')"
                  @change="handleEdit(scope.$index, scope.row)"
                ></el-input>
                <span>{{scope.row.goodsNum}}</span>
              </template>
            </el-table-column>
            <el-table-column label="金额" width="120">
              <template scope="scope">
                <el-input
                  :disabled="true"
                  size="small"
                  v-model="scope.row.goodsMoney"
                  placeholder="请输入金额"
                ></el-input>
                <span>{{scope.row.goodsMoney}}</span>
              </template>
            </el-table-column>
            <el-table-column label="税率(%)" width="120">
              <template scope="scope">
                <el-input
                  :disabled="true"
                  size="small"
                  v-model="scope.row.goodsRate"
                  placeholder="请输入税率"
                  
                  @change="handleEdit(scope.$index, scope.row)"
                ></el-input>
                <span>{{scope.row.goodsRate}}</span>
              </template>
            </el-table-column>
            <el-table-column label="单价(含税)" width="120">
              <template scope="scope">
                <el-input
                 :disabled="true"
                  size="small"
                  v-model="scope.row.goodsPriceRate"
                  placeholder="请输入单价"
                ></el-input>
                <span>{{scope.row.goodsPriceRate}}</span>
              </template>
            </el-table-column>
            <el-table-column label="金额(含税)" width="120">
              <template scope="scope">
                <el-input
                  size="small"
                  :disabled="true"
                  v-model="scope.row.goodsMoneyRate"
                  placeholder="请输入金额"
                ></el-input>
                <span>{{scope.row.goodsMoneyRate}}</span>
              </template>
            </el-table-column>
            <el-table-column label="备注" width="150">
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.remark"
                  placeholder="请输入备注"
                ></el-input>
                <span>{{scope.row.remark}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  rkdReceive,
  rkdRefuse,
  listOrder,
  getCgrkd,
  getCgrkdMxChild,
} from "@/api/system/cgrkd";


import { getStoreAll } from "@/api/system/store";
import { getPersonAll } from "@/api/system/person";
import { getToken } from "@/utils/auth";
export default {
  name: "Order",
  data() {
    return {
      //用户信息
      user:{},
      type:0,//未处理
      fileList: [],
      //拒绝弹出层
      ropen: false,
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
        url: process.env.VUE_APP_BASE_API + "/common/upload",
      },
      //列表
      types: [],
      djNumbers:[],
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

      // 主表信息表格数据
      leaseList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      perationOptions: [],
      operateOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        djNumber: undefined,
        returnType: 0,
      },
      // 表单参数
      form: {},
      activeName: "first",
      // 表单校验
      rules: {
        
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //追加子表必填样式
    starAdd(obj) {
      if(obj.columnIndex === 2 || obj.columnIndex === 3) {
          return 'star';
      }
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
    handleRemove(file, fileList) {
      this.form.fileName = "";
    },
    
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    handleCurrentChange(row, event, column) {
      console.log(row, event, column, event.currentTarget);
    },
    /** 查询二级市场信息列表 */
    getList() {
      this.loading = true;
      if(this.queryParams.returnType==null||this.queryParams.returnType==undefined||this.queryParams.returnType==""){
        this.queryParams.returnType==0;
      }
      listOrder(this.queryParams.returnType).then((response) => {
        this.leaseList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.ropen = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        djNumber: undefined,
        type:0,
        rows: "",
        djId: "",
        returnType: undefined,
        returnNote: undefined,
        statusName: undefined,
      };
      this.resetForm("form");
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
      this.ids = selection.map((item) => item.id);
      this.types = selection.map((item) => item.type);
      this.djNumbers = selection.map((item) => item.djNumber);
      this.form.type=this.types[0];
      this.form.djNumber=this.djNumbers[0];
      this.form.djId=this.ids[0];
      this.form.statusName=selection.map((item) => item.statusName)[0];
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      //this.reset();
      const id = row.id || this.ids;
      const type=this.types;
      getCgrkdMxChild(id,type).then((response) => {
          this.tableData = response.rows;
      });
      this.open = true;
      this.title = "订单接收";
    },
    /** 拒绝按钮操作 */
    rkdRefuse(row) {
      this.ropen = true;
      this.title = "拒绝订单";
    },
       handleEdit(index, row) {
      //不含税
      if(row.goodsRate==0){
          if(row.goodsPrice!=""&&row.goodsPrice!=null&&row.goodsPrice!=undefined){
             row.goodsPriceRate=row.goodsPrice;
          }
          if(row.goodsNum!=""&&row.goodsNum!=null&&row.goodsNum!=undefined&&row.goodsPrice!=""&&row.goodsPrice!=null&&row.goodsPrice!=undefined){
            row.goodsMoney=(parseFloat(row.goodsNum)*parseFloat(row.goodsPrice)).toFixed(2);
            row.goodsMoneyRate=row.goodsMoney;
          }
      }
      //含税
      if(row.goodsRate>0){
          if(row.goodsNum!=""&&row.goodsNum!=null&&row.goodsNum!=undefined&&row.goodsPrice!=""&&row.goodsPrice!=null&&row.goodsPrice!=undefined&&row.goodsRate!=""&&row.goodsRate!=null&&row.goodsRate!=undefined){
            row.goodsMoney=(parseFloat(row.goodsNum)*parseFloat(row.goodsPrice)).toFixed(2);
            row.goodsMoneyRate=(((1+parseFloat(row.goodsRate)/100))*row.goodsMoney).toFixed(2);
            row.goodsPriceRate=(parseFloat(row.goodsMoneyRate)/parseFloat(row.goodsNum)).toFixed(2);
          }
      }
    },
    /** 接收按钮 */
    submitForm: function () {
      if(this.form.statusName!="未接收"){
         this.msgError("禁止操作!");
         return
      }
      if (this.tableData.length > 0) {
        //检查子表信息
        for (let i = 0; i < this.tableData.length; i++) {
          if (
            this.tableData[i].id == "" ||
            this.tableData[i].goodsPrice == "" ||
            this.tableData[i].goodAddress == ""
          ) {
            this.msgError("检查信息必填项!");
            return;
          }
        }
        this.form.rows = JSON.stringify(this.tableData);
        rkdReceive(this.form).then((response) => {
          if (response.code === 200) {
            this.msgSuccess("接收成功");
            this.open = false;
            this.reset();
            this.getList();
          } else {
            this.msgError(response.msg);
          }
        });
      } else {
        this.msgError("请填写子表信息!");
      }
    },
    /** 拒绝接收按钮 */
    RefuseSubmitForm: function () {
      if(this.form.statusName!="未接收"){
         this.msgError("禁止操作!");
         return
      }
        if(this.form.returnType==null||this.form.returnType==""||this.form.returnType==undefined){
           this.msgError("请选择拒绝原因类型!");
           return
        }
        this.form.rows = JSON.stringify(this.tableData);
        rkdRefuse(this.form).then((response) => {
          if (response.code === 200) {
            this.msgSuccess("拒绝成功");
            this.ropen = false;
            this.reset();
            this.getList();
          } else {
            this.msgError(response.msg);
          }
        });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除单据编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delCgrkd(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
     /** 生效按钮操作 */
    handleEffect(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认单据编号为"' + ids + '"的数据项已生效?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return updateCgrkdStatus(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("操作成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有租赁单据数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportCgrkd(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>
<style>

.cell .el-select+span{
  display: none;
}
.cell .el-input+span{
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
</style>