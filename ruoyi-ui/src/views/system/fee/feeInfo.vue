<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <el-form-item label="费用项目名称" prop="feeName">
        <el-input
          v-model="queryParams.feeName"
          placeholder="请输入费用项目名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="费用项目编码" prop="feeCode" label-width="100px">
        <el-input
          v-model="queryParams.feeCode"
          placeholder="请输入费用项目编码"
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
          v-hasPermi="['info:feeInfo:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['info:feeInfo:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['info:feeInfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['info:feeInfo:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="feeInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="id" align="center" prop="id" /> -->
      <el-table-column label="费用项目名称" align="center" prop="feeName" />
      <el-table-column label="费用项目编码" align="center" prop="feeCode" />
      <el-table-column label="金额" align="center" prop="feeMoney" />
      <el-table-column label="凭证张数" align="center" prop="feeNum" />
      <el-table-column label="消费日期" align="center" prop="feeTime" />
      <!-- <el-table-column label="附件" align="center" prop="fileName" /> -->
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['info:feeInfo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['info:feeInfo:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改帐夹对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <!-- <el-form-item label="费用项目名称" prop="feeName">
          <el-input v-model="form.feeName" placeholder="请输入费用项目名称" />
        </el-form-item> -->
        <el-form-item label="费用项目名称" prop="feeName">
              <el-row :gutter="0">
                <el-col :span="21">
                  <el-input
                    v-model="form.feeName"
                    placeholder="点击选择费用项目名称"
                    :disabled="true"
                  />
                </el-col>
                <el-col :span="1" :offset="2">
                  <i
                    @click="khSelect"
                    class="el-icon-plus"
                    style="font-size: 20px"
                  ></i>
                </el-col>
              </el-row>
            </el-form-item>
        <!-- <el-form-item label="费用项目编码" prop="feeCode">
          <el-input v-model="form.feeCode" placeholder="请输入费用项目编码" />
        </el-form-item> -->
        <el-form-item label="金额" prop="feeMoney">
          <el-input v-model="form.feeMoney" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="凭证张数" prop="feeNum">
          <el-input v-model="form.feeNum" placeholder="请输入凭证张数" />
        </el-form-item>
        <el-form-item label="消费日期" prop="feeTime">
          <!-- <el-input v-model="form.feeTime" placeholder="请输入消费日期" /> -->
            <el-date-picker
              v-model="form.feeTime"
              type="date"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              placeholder="选择消费日期"
               style="width:100%"
              >
    </el-date-picker>
        </el-form-item>
        <el-form-item label="附件" prop="fileName">
          <!-- <el-input v-model="form.fileName" placeholder="请输入附件" /> -->
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
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <kh-select
      v-if="selectKhDialog"
      ref="selectKh"
      @selectData="selectKhData"
    ></kh-select>
  </div>
</template>

<script>
import { listFeeInfo, getFeeInfo, delFeeInfo, addFeeInfo, updateFeeInfo, exportFeeInfo } from "@/api/system/feeInfo";
import khSelect from "./khSelect";
import { getToken } from "@/utils/auth";
export default {
  name: "FeeInfo",
  components: {
   khSelect,
  },
  data() {
    return {
      // 文件列表
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
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 帐夹表格数据
      feeInfoList: [],
      // 弹出层标题
      title: "",
      // 遮罩层
       selectKhDialog: false,
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        feeName: undefined,
        feeCode: undefined,
        feeMoney: undefined,
        feeNum: undefined,
        feeTime: undefined,
        fileName: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        feeMoney:[
          { required: true, message: "请输入金额", trigger: "blur" },
        ],
        feeNum:  [{ required: true, message: "请输入凭证张数", trigger: "blur" }],
        feeTime:[{ required: true, message: "请输入时间", trigger: "blur" }],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 上传成功
      handleFileSuccess(res, file, fileList) {
    
      console.log(res.url);
      this.form.fileName = res.url;
    },
    // 删除文件
     handleRemove(file, fileList) {
      this.form.fileName = "";
    },
    // 点击文件
    clickFile(file) {
      if (file.url != "") {
        window.location.href = file.url;
      }
    },
    // 选择时间
      editTime(i){
      if(i<10){
      i="0"+i;
      }
      return i;
      },
      getTime(){
        var date=new Date();
        var year=date.getFullYear();//得到当前年份
        var month=this.editTime(date.getMonth()+1);//得到当前月份
        var day=this.editTime(date.getDate());//得到当前几号
        var hour=this.editTime(date.getHours());//得到当前小时
        var min=this.editTime(date.getMinutes());//得到当前分钟
        var seconds=this.editTime(date.getSeconds());//得到当前秒
        var weeks=date.getDay();
        var week;
        switch(weeks){
        case 0:
        week="星期日";
        break;
        case 1:
        week="星期一";
        break;
        case 2:
        week="星期二";
        break;
        case 3:
        week="星期三";
        break;
        case 4:
        week="星期四";
        break;
        case 5:
        week="星期五";
        break;
        case 6:
        week="星期六";
        break;
        }
          return year+"-"+month+"-"+day;
        },
     //选择数据
        selectData(row) {
      //  this.selectGoodsDialog=false;

      this.$nextTick(() => {
        let goodsInfo = new Object();
        goodsInfo.feeCode = row.feeCode;
        goodsInfo.feeName = row.feeName;
        goodsInfo.feeMoney=''
        goodsInfo.feeNum=''
        goodsInfo.feeTime=''
       this.tableData.push(goodsInfo);
        this.$refs.selectKh.visible = false;
      });
    },
    //批量选择数据
    selectDataMore(rows) {
      //  this.selectGoodsDialog=false;
      this.$nextTick(() => {
        for (let i = 0; i < rows.length; i++) {
          let row = rows[i];
          let goodsInfo = new Object();
          goodsInfo.feeCode = row.feeCode;
          goodsInfo.feeName = row.feeName;
          goodsInfo.feeMoney=''
         goodsInfo.feeNum=''
          goodsInfo.feeTime=''
          this.tableData.push(goodsInfo);
        }
        this.$refs.selectKh.visible = false;
      });
    },
    khSelect() {
      this.selectKhDialog = true;
      this.$nextTick(() => {
        this.$refs.selectKh.visible = true;
      });
    },
      selectKhData(row) {
      this.form.feeCode = row.feeCode;
      this.form.feeName = row.feeName;
      this.$refs.selectKh.visible = false;
    },
    /** 查询帐夹列表 */
    getList() {
      this.loading = true;
      listFeeInfo(this.queryParams).then(response => {
        this.feeInfoList = response.rows;
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
        feeName: undefined,
        feeCode: undefined,
        feeMoney: undefined,
        feeNum: undefined,
        feeTime: this.getTime(),
        fileName: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined
      };
      this.resetForm("form");
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加帐夹";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getFeeInfo(id).then(response => {
        this.form = response.data;
          if (response.data.fileName != "") {
          this.fileList = [];
          let info = new Object();
          info.name = response.data.fileName;
          info.url = response.data.fileName;
          this.fileList.push(info);
        }
        this.open = true;
        this.title = "修改帐夹";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateFeeInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addFeeInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除帐夹编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delFeeInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有帐夹数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportFeeInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>