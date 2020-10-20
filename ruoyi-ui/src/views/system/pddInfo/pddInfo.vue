<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="单据编号" prop="djNumber">
        <el-input
          v-model="queryParams.djNumber"
          placeholder="请输入单据编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:checkInfo:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:checkInfo:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:checkInfo:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-s-promotion"
          size="mini"
          :disabled="multiple"
          @click="handleEffect"
          v-hasPermi="['system:rkInfo:effect']"
          >生效</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="leaseList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />

      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="单据状态" align="center" prop="djStatus" /> -->
      <el-table-column label="单据编号" align="center" prop="djNumber" />
      <el-table-column label="账面日期" align="center" prop="djTime" />
      <el-table-column
        label="盘点结束日期"
        align="center"
        prop="checkEndTime"
      />
      <el-table-column label="仓库名称" align="center" prop="storeName" />

      <el-table-column label="制单人" align="center" prop="createBy" />
      <el-table-column label="制单日期" align="center" prop="createTime" />
      <!-- <el-table-column label="制单日期" align="center" prop="create_Time" /> -->

      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:checkInfo:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:checkInfo:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改二级市场信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="150px"
        :inline="true"
        class="random"
        :label-position="left"
      >
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="first">
            <!-- <el-form-item label="单据编号" prop="djNumber">
              <el-input v-model="form.djNumber" placeholder="" />
            </el-form-item>-->
            <!-- <el-form-item label="标题" prop="djTitle" id="djTitless">
              <el-input v-model="form.djTitle" placeholder />
            </el-form-item> -->
            <el-form-item
              label="账面日期"
              prop="djTime"
              class="changeBlue pig"
              style="width: 400px"
            >
              <el-date-picker
                style="width: 100%"
                v-model="form.djTime"
                type="date"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item
              label="盘点结束日期"
              prop="checkEndTime"
              class="changeBlue pig"
              style="width: 400px"
            >
              <el-date-picker
                style="width: 100%"
                v-model="form.checkEndTime"
                type="date"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item
              label="单据编号"
              prop="djNumber"
              class="changeBlue pig"
              style="width: 400px"
            >
              <el-input
                v-model="form.djNumber"
                :disabled="true"
                placeholder="后台自动生成"
              />
            </el-form-item>
            <el-form-item
              label="仓库"
              prop="storeNum"
              class="pig"
              style="width: 400px"
            >
              <el-select
                v-model="form.storeNum"
                filterable
                style="width: 100%"
                    @change="selectStore"
              >
                <el-option
                  v-for="item in storeList"
                  :key="item.ckCode"
                  :label="item.ckName"
                  :value="item.ckCode"
              
                >
                  <span
                    style="
                      float: left;
                      color: #8492a6;
                      font-size: 13px;
                      width: 100%;
                    "
                    >{{ item.ckName }}</span
                  >
                </el-option>
              </el-select>
            </el-form-item>

            <!-- <el-form-item label="采用地点" prop="checkAddress">
              <el-input v-model="form.checkAddress" placeholder="" />
            </el-form-item>-->

            <el-form-item label="说明" prop="remark" id="djTitles">
              <el-input v-model="form.remark" placeholder />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="明细信息" name="second">
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  @click="goodsSelect"
                  >新增存货信息</el-button
                >
              </el-col>
            </el-row>
            <el-table
              :data="tableData"
              class="tb-edit"
              style="width: 100%"
              highlight-current-row
              @row-click="handleCurrentChange"
              :header-cell-class-name="starAdd"
            >
              <el-table-column prop="goodsCode" label="商品编码" width="200">
                <template scope="scope">
                  <el-input
                    :disabled="true"
                    size="small"
                    v-model="scope.row.goodsCode"
                    placeholder="请输入内容"
                  ></el-input>
                  <span>{{ scope.row.goodsCode }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="goodsName" label="商品名称" width="200">
                <template scope="scope">
                  <el-input
                    :disabled="true"
                    size="small"
                    v-model="scope.row.goodsName"
                    placeholder="请输入内容"
                  ></el-input>
                  <span>{{ scope.row.goodsName }}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column label="采样日期" width="150">
                <template scope="scope">
                  <el-date-picker v-model="scope.row.sampTime" type="date" placeholder="请选择采样日期"></el-date-picker>
                  <span>{{ scope.row.sampTime }}</span>
                </template>
              </el-table-column> -->
              <el-table-column label="规格型号" width="150">
                <template scope="scope">
                  <el-input
                    size="small"
                    v-model="scope.row.goodsGg"
                    :disabled="true"
                  ></el-input>
                  <span>{{ scope.row.goodsGg }}</span>
                </template>
              </el-table-column>
              <el-table-column label="计量单位" width="150">
                <template scope="scope">
                  <el-input
                    size="small"
                    v-model="scope.row.goodsDw"
                    :disabled="true"
                    @change="handleEdit(scope.$index, scope.row)"
                  ></el-input>
                  <span>{{ scope.row.goodsDw }}</span>
                </template>
              </el-table-column>

              <el-table-column label="账面数量" width="150">
                <template scope="scope">
                  <el-input
                    :disabled="true"
                    size="small"
                    v-model="scope.row.kcNum"
                    placeholder
                    @change="handleEdit(scope.$index, scope.row)"
                  ></el-input>
                  <span>{{ scope.row.kcNum }}</span>
                </template>
              </el-table-column>
              <el-table-column label="盘点数量" width="150">
                <template scope="scope">
                  <el-input
                    size="small"
                    v-model="scope.row.goodsNum"
                    placeholder
                    @change="handleEdit(scope.$index, scope.row)"
                  ></el-input>
                  <span>{{ scope.row.goodsNum }}</span>
                </template>
              </el-table-column>
              <el-table-column label="盈亏数量" width="150">
                <template scope="scope">
                  <el-input
                    :disabled="true"
                    size="small"
                    v-model="scope.row.goodsLossNum"
                    placeholder
                    @change="handleEdit(scope.$index, scope.row)"
                  ></el-input>
                  <span>{{ scope.row.goodsLossNum }}</span>
                </template>
              </el-table-column>
              <el-table-column label="单价" width="150">
                <template scope="scope">
                  <el-input
                    size="small"
                    v-model="scope.row.goodsPrice"
                    placeholder
                    @change="handleEdit(scope.$index, scope.row)"
                  ></el-input>
                  <span>{{ scope.row.goodsPrice }}</span>
                </template>
              </el-table-column>
              <el-table-column label="盈亏金额" width="150">
                <template scope="scope">
                  <el-input
                    :disabled="true"
                    size="small"
                    v-model="scope.row.goodsLossMoney"
                    placeholder
                    @change="handleEdit(scope.$index, scope.row)"
                  ></el-input>
                  <span>{{ scope.row.goodsLossMoney }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template scope="scope">
                  <el-button
                    size="small"
                    type="danger"
                    @click="handleChildDelete(scope.$index, scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
   <div v-if="showen">
    <goods-select
    
      ref="selectGoods"
      v-bind:sunny="sun"
      @selectData="selectData"
      @selectDataMore="selectDataMore"
    ></goods-select>
      <!-- v-if="selectGoodsDialog" -->
    </div>
  </div>
</template>

<script>
import {
  listCheckInfo,
  getCheckInfo,
  addCheckInfo,
  updateCheckInfo,
  delCheckInfo,
  exportCheckInfo,
  updateCheckInfoStatus,
} from "@/api/system/checkInfo";
import {
  listCheckInfoChild,
  delCheckInfoChild,
  // updateCgrkd,
  // updateCgrkdStatus,
  // exportCgrkd,
  // getOwnerList,
} from "@/api/system/checkInfoChild";
import { ownerList } from "@/api/system/owner";
import goodsSelect from "./goodsSelect";
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
  components: {
    goodsSelect,
  },
  data() {
    return {
      // 传值数据
    sun:"",
    importUrl: "",
      //用户信息
      user: {
        ownerCode: "",
        ownerName: "",
        ownerNameJc: "",
        sampaddress: "",
        device: "",
      },
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
        url: process.env.VUE_APP_BASE_API + "/common/upload",
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
      check: "",
      //供应商
      personList: [],
      // 遮罩层
      loading: false,
      selectGoodsDialog: false,
      // 显示
      showen:false,
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
      iopen: false,
      perationOptions: [],
      operateOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        markCode: undefined,
        djNumber: undefined,
        djTime: undefined,
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
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    getCkAll(this.queryParams).then((response) => {
      this.storeList = response.rows;
      this.form.storeNum=response.rows[0].ckCode
      this.check = response.rows[0].ckCode;
       this.sun= this.storeList[0].ckCode;
      this.place = response.rows[0].ckName;
    });
    ownerList(this.queryParams).then((response) => {
      this.personList = response.data;
    });
    listCheckProject(this.queryParams).then((response) => {
      this.projectList = response.rows;
      console.log(this.projectList);
    });
    this.getList();

    getInfo().then((response) => {
      this.user.ownerCode = response.user.userName;
      this.user.ownerName = response.user.nickName;
      this.user.ownerNameJc = response.user.nickName;
      this.form.djTime = this.getTime();
    });
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit();
    },
    /** 导入操作 */
    handleImport() {
      //this.reset();
      this.iopen = true;
      this.title = "导入检测明细";
      const id = this.ids;
      this.importUrl =
        process.env.VUE_APP_BASE_API + "/system/checkInfo/import";
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
      if (obj.columnIndex === 5 || obj.columnIndex === 7) {
        return "star";
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
    //  alert(data)
      //根据仓库编码查找仓库名称
      for (let i = 0; i < this.storeList.length; i++) {
        if (this.storeList[i].ckCode == data) {
          this.form.storeName = this.storeList[i].ckName;
          this.sun= data;
          // alert(this.sun)
          break;
        }
      }
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    handleCurrentChange(row, event, column) {
      console.log(row, event, column);
    },
    handleEdit(index, row) {
      if (
        row.goodsNum != "" &&
        row.goodsNum != null &&
        row.goodsNum != undefined
      ) {
        row.goodsLossNum = row.goodsNum;
      }
      if (
        row.goodsNum != "" &&
        row.goodsNum != null &&
        row.goodsNum != undefined &&
        row.goodsPrice != "" &&
        row.goodsPrice != null &&
        row.goodsPrice != undefined
      ) {
        row.goodsLossMoney = (
          parseFloat(row.goodsNum) * parseFloat(row.goodsPrice)
        ).toFixed(2);
      } else {
      }

      //含税
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
    handleChildDelete(index, row) {
      if (row.id != "" && row.id != undefined && row.id != null) {
        delCheckInfoChild(row.id);
        this.tableData.splice(index, 1);
      } else {
        this.tableData.splice(index, 1);
      }
      console.log(index, row);
    },
    /** 操作 */
    goodsSelect() {
      this.selectGoodsDialog = true;
      this.showen=true
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
        goodsInfo.goodsCode = row.goodsCode;
        goodsInfo.goodsName = row.goodsName;
        goodsInfo.goodsGg = row.goodsGg;
        goodsInfo.goodsDw = row.goodsDw;
        goodsInfo.kcNum = row.kcNum;
        goodsInfo.goodsLossNum='';
        goodsInfo.goodsNum='';
        goodsInfo.checkResult = "";
        goodsInfo.checkResultName = "";
        goodsInfo.goodsRate = "0";
        goodsInfo.goodsPrice = "";
        goodsInfo.remark = "";
        goodsInfo.goodsLossMoney = "";
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
          goodsInfo.goodsCode = row.goodsCode;
          goodsInfo.goodsName = row.goodsName;
          goodsInfo.goodsGg = row.goodsGg;
          goodsInfo.goodsDw = row.goodsDw;
          goodsInfo.kcNum = row.kcNum;
          goodsInfo.goodsLossNum='';
           goodsInfo.goodsNum='';
          goodsInfo.checkResult = "";
          goodsInfo.checkResultName = "";
          goodsInfo.goodsRate = "0";
          goodsInfo.goodsPrice = "";
          goodsInfo.remark = "";
          goodsInfo.goodsLossMoney = "";
          this.tableData.push(goodsInfo);
        }
        this.$refs.selectGoods.visible = false;
      });
    },
    /** 查询二级市场信息列表 */
    getList() {
      this.loading = true;
      listCheckInfo(this.queryParams).then((response) => {
        this.leaseList = response.rows;
        console.log(this.leaseList);
        this.total = response.total;
        // this.checking = response.rows[0].checkAddress;
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
        goodsDw: undefined,
        goodsNum: undefined,
        goodsPrice: undefined,
        inhibitionNum: this.number,
        checkNum: this.numbers,
        afAi: undefined,
        checkResult: undefined,
        goodsGg: undefined,
        goodsName: undefined,
        goodsLossMoney: undefined,
        goodsLossNum: undefined,
        kcNum: undefined,
        checkEndTime: this.getTime(),
        storeNum:undefined,
      };
      this.resetForm("form");
      // this.form.checkAddress = this.check;
      this.form.storeNum = this.check;
      //  this.form.storeNum=response.rows[0].ckCode
      this.form.storeName = this.place;
      this.form.checkDevice = this.placedevice;
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
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "盘点单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getCheckInfo(id).then((response) => {
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
          djNumber: this.form.djNumber,
        };
        listCheckInfoChild(queryParams).then((response) => {
          //this.form.rows = response.data;
          this.tableData = response.rows;
        });
        this.open = true;
        this.title = "修改取样地点信息";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      console.log(this.tableData.length);
      console.log(this.tableData);
      if (this.tableData.length > 0) {
        //检查子表信息
        for (let i = 0; i < this.tableData.length; i++) {
          console.log(this.tableData[i]);
          if (
            this.tableData[i].goodsNum == "" ||
            // this.tableData[i].ai == "" ||
            // this.tableData[i].af == "" ||
            this.tableData[i].goodsPrice == ""
          ) {
            this.msgError("检查明细信息必填项!");
            return;
          }
        }
        this.form.rows = JSON.stringify(this.tableData);
        this.$refs["form"].validate((valid) => {
          if (valid) {
            if (this.form.id != undefined) {
              updateCheckInfo(this.form).then((response) => {
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
              addCheckInfo(this.form).then((response) => {
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
        type: "warning",
      })
        .then(function () {
          return delCheckInfo(ids);
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
      this.$confirm('是否确认单据编号为"' + ids + '"的数据项已生效?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return updateCheckInfoStatus(ids);
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
          return exportCheckInfo(queryParams);
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