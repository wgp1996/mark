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

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
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
    </el-row>

    <el-table
      v-loading="loading"
      :data="rkInfoList"
      @selection-change="handleSelectionChange"
     
    >
      <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table style="padding:0;margin:0" :data="props.row.childrenList" id="special">
              <el-table-column label="商品名称" align="center" prop="goodsName" />
              <el-table-column label="商品编码" align="center" prop="goodsCode" />
              <!-- <el-table-column label="商品规格" align="center" prop="goodsGg" /> -->
              <el-table-column label="商品单位" align="center" prop="goodsDw" /> 
              <el-table-column label="主进货地" align="center" prop="goodsAddress" /> 
              <el-table-column label="数量" align="center" prop="goodsNum" /> 
              <el-table-column label="单价" align="center" prop="goodsPrice" /> 
              <el-table-column label="金额" align="center" prop="goodsMoney" /> 
              <el-table-column label="备注" align="center" prop="remark" />
            </el-table>
          </template>
        </el-table-column>
      <el-table-column label="单据编号" align="center" prop="djNumber" />
       <el-table-column label="批次" align="center" prop="rkPc" />
      <el-table-column label="单据日期" align="center" prop="djTime" />
      <el-table-column label="仓库名称" align="center" prop="storeName" />
      <el-table-column label="制单人" align="center" prop="createBy" />
      <el-table-column label="制单日期" align="center" prop="createTime" />

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
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
            <el-form-item label="单据日期" prop="djTime" class="changeBlue pig" style="width:400px">
              <el-date-picker
                style="width: 100%"
                v-model="form.djTime"
                type="date"
                placeholder="检测日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <!-- <el-form-item label="检测人" class="changeBlue pig" style="width:400px">
              <el-input v-model="user.ownerNameJc" :disabled="true" placeholder="检测人" />
            </el-form-item> -->
            <el-form-item label="单据编号" prop="djNumber" class="changeBlue pig" style="width:400px">
              <el-input v-model="form.djNumber" :disabled="true" placeholder="后台自动生成" />
            </el-form-item>
            <!-- <el-form-item label="检测标准" prop="checkNum" class=" pig" style="width:400px">
              <el-input v-model="form.checkNum"  :placeholder="numbers" />
            </el-form-item> -->
            <el-form-item label="仓库" prop="storeNum" class=" pig" style="width:400px">
              <!-- <el-input
                v-model="form.djNumber"
                :disabled="true"
                placeholder=""
              />-->
              <el-select
                v-model="form.storeNum"
                filterable
                @change="selectStore"
                style="width: 100%"
              
              >
                <el-option
                  v-for="item in storeList"
                  :key="item.ckCode"
                  :label="item.ckName "
                  :value="item.ckCode"
                >
                  <span
                    style="
                      float: left;
                      color: #8492a6;
                      font-size: 13px;
                      width: 100%;
                    "
                  >{{ item.ckName }}</span>
                </el-option>
              </el-select>
            </el-form-item>

              <el-form-item label="供应商" prop="khCode">
              <el-select
                v-model="form.khCode"
                placeholder="请选择供应商"
                filterable
                 style="width:100%"
                @change="selectPerson"
              >
                <el-option
                  v-for="item in personList"
                  :key="item.personCode"
                  :label="item.personName"
                  :value="item.personCode"
                >
                  <span style="float: left;width:50%">{{ item.personCode }}</span>
                  <span style="float: left;width:50%">{{ item.personName }}</span>
                </el-option>
              </el-select>
            </el-form-item> 
          

         
            <!-- <el-form-item label="采样地"  prop="sampaddress" style="width:400px" class="pig">
              <el-select
                v-model="form.sampAddress"
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="item in conderaddress"
                  :key="item.sampAddressId"
                  :label="item.sampAddressDetail"
                  :value="item.sampAddressId"
                >
                  <span
                    style="
                      float: left;
                      color: #8492a6;
                      font-size: 13px;
                      width: 100%;
                    "
                  >{{ item.sampAddressDetail }}</span>
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="说明" prop="remark" id="djTitles">
              <el-input v-model="form.remark" placeholder />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="明细信息" name="second">
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="goodsSelect">新增存货信息</el-button>
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
              <!-- <el-table-column label="业户信息" prop="ownerCode" width="250">
                <template scope="scope">
                  <el-select
                    v-model="scope.row.ownerCode"
                    placeholder="请选择业户"
                    filterable
                    style="width:100%"
                    @change="selectPerson(scope.$index, scope.row)"
                  >
                    <el-option
                      v-for="item in personList"
                      :key="item.ownerCode"
                      :label="item.ownerName"
                      :value="item.ownerCode"
                    >
                      <span style="width:100%">{{item.ownerName}}</span>
                    </el-option>
                  </el-select>
                </template>
              </el-table-column> -->
              <!-- <el-table-column label="检测项目" prop="checkProject" width="150">
                <template scope="scope">
                  <el-select
                    v-model="scope.row.checkProject"
                    placeholder="请选择检测项目"
                    filterable
                    style="width:100%"
                  >
                    <el-option
                      v-for="item in projectList"
                      :key="item.projectName"
                      :label="item.projectName"
                      :value="item.projectName"
                    >
                      <span style="width:100%">{{ item.projectName }}</span>
                    </el-option>
                  </el-select>
                </template>
              </el-table-column> -->
              <!-- <el-table-column prop="goodsCode" label="检测物编码" width="200">
                <template scope="scope">
                  <el-input
                    :disabled="true"
                    size="small"
                    v-model="scope.row.goodsCode"
                    placeholder="请输入内容"
                  ></el-input>
                  <span>{{ scope.row.goodsCode }}</span>
                </template>
              </el-table-column> -->
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
              <!-- <el-table-column label="采样日期" width="150">
                <template scope="scope">
                  <el-date-picker v-model="scope.row.sampTime" type="date" placeholder="请选择采样日期"></el-date-picker>
                  <span>{{ scope.row.sampTime }}</span>
                </template>
              </el-table-column> -->
              <!-- <el-table-column label="检测结果" width="150">
                <template scope="scope">
                  <el-input
                    size="small"
                    v-model="scope.row.testResult"
                    placeholder="请输入检测结果"
                  ></el-input>
                  <span>{{ scope.row.testResult }}</span>
                </template>
              </el-table-column> -->
              <el-table-column label="商品规格" width="150">
                <template scope="scope">
                  <el-input
                    size="small"
                    v-model="scope.row.goodsGg"
                         :disabled="true"
                    @change="handleEdit(scope.$index, scope.row)"
                  ></el-input>
                  <span>{{ scope.row.goodsGg }}</span>
                </template>
              </el-table-column>

              <el-table-column label="商品单位" width="150">
                <template scope="scope">
                  <el-input
                    :disabled="true"
                    size="small"
                    v-model="scope.row.goodsDw"
                    placeholder
                    @change="handleEdit(scope.$index, scope.row)"
                  ></el-input>
                  <span>{{ scope.row.goodsDw }}</span>
                </template>
              </el-table-column>
               <el-table-column label="主进货地" width="150">
                <template scope="scope">
                  <el-input
                    :disabled="true"
                    size="small"
                    v-model="scope.row.goodsAddress"
                    placeholder
                    @change="handleEdit(scope.$index, scope.row)"
                  ></el-input>
                  <span>{{ scope.row.goodsAddress }}</span>
                </template>
              </el-table-column>
                <el-table-column label="数量" width="150">
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
                  <el-table-column label="金额" width="150">
                <template scope="scope">
                  <el-input
                    :disabled="true"
                    size="small"
                    v-model="scope.row.goodsMoney"
                    placeholder
                    @change="handleEdit(scope.$index, scope.row)"
                  ></el-input>
                  <span>{{ scope.row.goodsMoney }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template scope="scope">
                  <el-button
                    size="small"
                    type="danger"
                    @click="handleChildDelete(scope.$index, scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!-- <el-tab-pane label="附件信息" name="three">
            <el-row :gutter="15" class="mb8">
              <el-col :span="1.5">
                <el-upload
                  class="upload-demo"
                  :limit="1"
                  drag
                  :file-list="fileList"
                  :action="upload.url"
                  :headers="upload.headers"
                  :on-success="handleFileSuccess"
                  :on-remove="handleRemove"
                  :on-preview="clickFile"
                >
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                  </div>
                </el-upload>
              </el-col>
            </el-row>
          </el-tab-pane> -->
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
          <el-dialog :title="title" :visible.sync="iopen" width="700px">
                <el-row :gutter="15" class="mb8">
            <el-col :span="1.5">
              <el-upload
                class="upload-demo"
                ref="upload"
                :action="importUrl"
                :headers="upload.headers"
                 :on-success="handleSuccess"
                :on-remove="handleRemove"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
              </el-upload>
            </el-col>
          </el-row>
    </el-dialog>
    <goods-select
      v-if="selectGoodsDialog"
      ref="selectGoods"
      @selectData="selectData"
      @selectDataMore="selectDataMore"
    ></goods-select>
  </div>
</template>

<script>
import { listRkInfo,
 getRkInfo, 
 delRkInfo,
 addRkInfo,
updateRkInfo,
exportRkInfo } from "@/api/system/rkInfo";

import {
  listRkInfoChild,
  delRkInfoChild
  // updateCgrkd,
  // updateCgrkdStatus,
  // exportCgrkd,
  // getOwnerList,
} from "@/api/system/rkInfoChild";
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
  name: "RkInfo",
  components: {
    goodsSelect
  },
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
      checking: "",
      left: "right",
      place: "",
      placename:"",
       check: "",
      checkname:"",
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
      rkInfoList: [],
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
        djNumber: undefined,
        djStatus: undefined,
        djTime: undefined,
        storeNum: undefined,
        khCode: undefined,
        djType: undefined,
        lsNumber: undefined,
        rkPc: undefined,
        storeName: undefined,
        khName: undefined
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
     
      }
    };
  },
  created() {
      getPersonAll(this.queryParams).then(response => {
        this.personList = response.rows;
        this.check= response.rows[0].personCode
        this.checkname= response.rows[0].personName
        console.log( this.personList)
    });
     getCkAll(this.queryParams).then(response => {
        this.storeList = response.rows;
        this.place= response.rows[0].ckCode
        this.placename= response.rows[0].ckName
    });
  
    // listCheckProject(this.queryParams).then(response => {
    //   this.projectList = response.rows;
    //   console.log(this.projectList);
    // });
    this.getList();

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
      this.importUrl=process.env.VUE_APP_BASE_API + "/system/randomInsp/import";
    },
    //选择供应商
    selectPerson(index, data) {
      //根据编码找产地
      for (let i = 0; i < this.personList.length; i++) {
        if (this.personList[i].personCode == data) {
          this.form.khName = this.personList[i].personName;
          break;
        }
      }
    },
    //选择仓库
    selectStore(data) {
      //根据仓库编码查找仓库名称
     
      for(let i=0;i<this.storeList.length;i++){
        if(this.storeList[i].ckCode==data){
          this.form.storeName=this.storeList[i].ckName;
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
       if(obj.columnIndex === 5 || obj.columnIndex === 6  ) {
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
    handleSuccess(res, file, fileList) {
       this.getList();
    },
    handleRemove(file, fileList) {
      this.form.fileName = "";
    },
    //选择客户
    selectOwner(data) {},

    handleClick(tab, event) {
      // console.log(tab, event);
    },
    handleCurrentChange(row, event, column) {
      console.log(row, event, column, event.currentTarget);
    },
    handleEdit(index, row) {
      if(row.goodsNum!=""&&row.goodsNum!=null&&row.goodsNum!=undefined){
             row.goodsLossNum=row.goodsNum;
          }
          if(row.goodsNum!=""&&row.goodsNum!=null&&row.goodsNum!=undefined&&row.goodsPrice!=""&&row.goodsPrice!=null&&row.goodsPrice!=undefined){
          
            row.goodsMoney=(parseFloat(row.goodsNum)*parseFloat(row.goodsPrice)).toFixed(2);
            
          }else{

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

    handleChildDelete(index, row) {
      if (row.id != "" && row.id != undefined && row.id != null) {
        delRkInfoChild(row.id);
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
        goodsInfo.goodsCode = row.goodsCode;
        goodsInfo.goodsName = row.goodsName;
        goodsInfo.goodsGg = row.goodsGg;
        goodsInfo.goodsDw = row.goodsDw;
        goodsInfo.goodsAddress = row.goodsAddress;
        goodsInfo.goodsNum = "";
        goodsInfo.goodsPrice    = "";
        goodsInfo.goodsRate = "0";
        goodsInfo.goodsMoney = "";
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
         goodsInfo.goodsCode = row.goodsCode;
        goodsInfo.goodsName = row.goodsName;
        goodsInfo.goodsGg = row.goodsGg;
        goodsInfo.goodsDw = row.goodsDw;
        goodsInfo.goodsAddress = row.goodsAddress;
        goodsInfo.goodsNum = "";
        goodsInfo.goodsPrice    = "";
        goodsInfo.goodsRate = "0";
        goodsInfo.goodsMoney = "";
        goodsInfo.remark = "";
          this.tableData.push(goodsInfo);
        }
        this.$refs.selectGoods.visible = false;
      });
    },
    /** 查询二级市场信息列表 */
    getList() {
      this.loading = true;
      listRkInfo(this.queryParams).then(response => {
        this.rkInfoList = response.rows;
        console.log(this.rkInfoList);
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
        sampAddress: undefined,
        sampAddressPerson: undefined,
        sampAddressPersonTel: undefined,
        inhibitionNum: this.number,
        checkNum: this.numbers,
        afAi: undefined,
        checkResult: undefined,
        ai: undefined,
        af: undefined,
        djStatus: "0",
        storeNum: undefined,
        khCode: undefined,
        djType: undefined,
        lsNumber: undefined,
        rkPc: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        khName: undefined,
        personCode:undefined
        
      };
      this.resetForm("form");
      // this.form.checkAddress=this.check;
      this.form.storeNum=this.place;
      this.form.storeName=this.placename;
       this.form.khCode=this.check;
      this.form.khName=this.checkname;
      // this.form.checkDevice=this.placedevice;
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
      this.title = "入库单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getRkInfo(id).then(response => {
        this.form = response.data;
        // 查询参数
        let queryParams = {
          djNumber: this.form.djNumber
        };
        listRkInfoChild(queryParams).then(response => {
          //this.form.rows = response.data;
          this.tableData = response.rows;
        });
        this.open = true;
        this.title = "修改入库单";
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
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateRkInfo(this.form).then(response => {
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
              addRkInfo(this.form).then(response => {
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
          return delRkInfo(ids);
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
          return exportRkInfo(queryParams);
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