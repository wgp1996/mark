<template>
  <div class="appContainer">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="收款单号" prop="collectionCode">
        <el-input
          v-model="queryParams.collectionCode"
          placeholder="请输入收款单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同名称" prop="contractName">
        <el-input
          v-model="queryParams.contractName"
          placeholder="请输入合同名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同编码" prop="contractCode">
        <el-input
          v-model="queryParams.contractCode"
          placeholder="请输入合同编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户编码" prop="ownerCode">
        <el-input
          v-model="queryParams.ownerCode"
          placeholder="请输入客户编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="ownerName">
        <el-input
          v-model="queryParams.ownerName"
          placeholder="请输入客户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="摊位编码" prop="stallCode">
        <el-input
          v-model="queryParams.stallCode"
          placeholder="请输入摊位编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="摊位名称" prop="stallName">
        <el-input
          v-model="queryParams.stallName"
          placeholder="请输入摊位名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同金额" prop="contractMoney">
        <el-input
          v-model="queryParams.contractMoney"
          placeholder="请输入合同金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同开始时间" prop="contractStartTime">
        <el-input
          v-model="queryParams.contractStartTime"
          placeholder="请输入合同开始时间"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同结束时间" prop="contractEndTime">
        <el-input
          v-model="queryParams.contractEndTime"
          placeholder="请输入合同结束时间"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收款金额" prop="collectionMoney">
        <el-input
          v-model="queryParams.collectionMoney"
          placeholder="请输入收款金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收款方式" prop="collectionPayType">
        <el-select v-model="queryParams.collectionPayType" placeholder="请选择收款方式" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <elCol :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:leaseCollection:add']"
        >新增</el-button>
      </elCol>
      <elCol :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:leaseCollection:edit']"
        >修改</el-button>
      </elCol>
      <elCol :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:leaseCollection:remove']"
        >删除</el-button>
      </elCol>
      <elCol :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:leaseCollection:export']"
        >导出</el-button>
      </elCol>
    </el-row>

    <el-table v-loading="loading" :data="leaseCollectionList" @selectionChange="handleSelectionChange">
      <el-tableColumn type="selection" width="55" align="center" />
      <el-tableColumn label="收款单号" align="center" prop="collectionCode" />
      <el-tableColumn label="合同名称" align="center" prop="contractName" />
      <el-tableColumn label="合同编码" align="center" prop="contractCode" />
      <el-tableColumn label="客户编码" align="center" prop="ownerCode" />
      <el-tableColumn label="客户名称" align="center" prop="ownerName" />
      <el-tableColumn label="摊位编码" align="center" prop="stallCode" />
      <el-tableColumn label="摊位名称" align="center" prop="stallName" />
      <el-tableColumn label="合同金额" align="center" prop="contractMoney" />
      <el-tableColumn label="合同开始时间" align="center" prop="contractStartTime" />
      <el-tableColumn label="合同结束时间" align="center" prop="contractEndTime" />
      <el-tableColumn label="收款金额" align="center" prop="collectionMoney" />
      <el-tableColumn label="收款方式" align="center" prop="collectionPayType" />
      <el-tableColumn label="备注" align="center" prop="remark" />
      <el-tableColumn label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:leaseCollection:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:leaseCollection:remove']"
          >删除</el-button>
        </template>
      </el-tableColumn>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改租赁收款对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="收款单号" prop="collectionCode">
          <el-input v-model="form.collectionCode" placeholder="请输入收款单号" />
        </el-form-item>
        <el-form-item label="收款单号" prop="id">
          <el-input v-model="form.id" placeholder="请输入收款单号" />
        </el-form-item>
        <el-form-item label="合同名称" prop="contractName">
          <el-input v-model="form.contractName" placeholder="请输入合同名称" />
        </el-form-item>
        <el-form-item label="合同编码" prop="contractCode">
          <el-input v-model="form.contractCode" placeholder="请输入合同编码" />
        </el-form-item>
        <el-form-item label="客户编码" prop="ownerCode">
          <el-input v-model="form.ownerCode" placeholder="请输入客户编码" />
        </el-form-item>
        <el-form-item label="客户名称" prop="ownerName">
          <el-input v-model="form.ownerName" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="摊位编码" prop="stallCode">
          <el-input v-model="form.stallCode" placeholder="请输入摊位编码" />
        </el-form-item>
        <el-form-item label="摊位名称" prop="stallName">
          <el-input v-model="form.stallName" placeholder="请输入摊位名称" />
        </el-form-item>
        <el-form-item label="合同金额" prop="contractMoney">
          <el-input v-model="form.contractMoney" placeholder="请输入合同金额" />
        </el-form-item>
        <el-form-item label="合同开始时间" prop="contractStartTime">
          <el-input v-model="form.contractStartTime" placeholder="请输入合同开始时间" />
        </el-form-item>
        <el-form-item label="合同结束时间" prop="contractEndTime">
          <el-input v-model="form.contractEndTime" placeholder="请输入合同结束时间" />
        </el-form-item>
        <el-form-item label="收款金额" prop="collectionMoney">
          <el-input v-model="form.collectionMoney" placeholder="请输入收款金额" />
        </el-form-item>
        <el-form-item label="收款方式">
          <el-select v-model="form.collectionPayType" placeholder="请选择收款方式">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listLeaseCollection, getLeaseCollection, delLeaseCollection, addLeaseCollection, updateLeaseCollection, exportLeaseCollection } from "@/api/system/leaseCollection";

export default {
  name: "LeaseCollection",
  data() {
    return {
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
      // 租赁收款表格数据
      leaseCollectionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        collectionCode: undefined,
        contractName: undefined,
        contractCode: undefined,
        ownerCode: undefined,
        ownerName: undefined,
        stallCode: undefined,
        stallName: undefined,
        contractMoney: undefined,
        contractStartTime: undefined,
        contractEndTime: undefined,
        collectionMoney: undefined,
        collectionPayType: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询租赁收款列表 */
    getList() {
      this.loading = true;
      listLeaseCollection(this.queryParams).then(response => {
        this.leaseCollectionList = response.rows;
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
        collectionCode: undefined,
        id: undefined,
        contractName: undefined,
        contractCode: undefined,
        ownerCode: undefined,
        ownerName: undefined,
        stallCode: undefined,
        stallName: undefined,
        contractMoney: undefined,
        contractStartTime: undefined,
        contractEndTime: undefined,
        collectionMoney: undefined,
        collectionPayType: undefined,
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
      this.ids = selection.map(item => item.collectionCode)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加租赁收款";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const collectionCode = row.collectionCode || this.ids
      getLeaseCollection(collectionCode).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改租赁收款";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.collectionCode != undefined) {
            updateLeaseCollection(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addLeaseCollection(this.form).then(response => {
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
      const collectionCodes = row.collectionCode || this.ids;
      this.$confirm('是否确认删除租赁收款编号为"' + collectionCodes + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delLeaseCollection(collectionCodes);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有租赁收款数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportLeaseCollection(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>