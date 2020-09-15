<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
     
      <el-form-item label="门店编号" prop="storeid">
        <el-input
          v-model="queryParams.storeid"
          placeholder="请输入门店编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品编码" prop="goodsCode">
        <el-input
          v-model="queryParams.goodsCode"
          placeholder="请输入商品编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="尺寸" prop="inch">
        <el-input
          v-model="queryParams.inch"
          placeholder="请输入尺寸"
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
          v-hasPermi="['system:shopLabel:add']"
        >新增价签</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:shopLabel:edit']"
        >绑定商品</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-edit"
          size="mini"
          :disabled="multiple"
          @click="handleBind"
          v-hasPermi="['system:shopLabel:remove']"
        >绑定网关</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:shopLabel:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:shopLabel:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="shopLabelList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="门店编号" align="center" prop="storeid" />
      <el-table-column label="标签Mac地址" align="center" prop="mac" />
      <el-table-column label="商品名称" align="center" prop="goodsName" />
      <el-table-column label="模板信息" align="center" prop="demoName" />
      <el-table-column label="尺寸" align="center" prop="inch" />
      <el-table-column label="电量" align="center" prop="battery" />
      <el-table-column label="温度信息" align="center" prop="temperature" />
      <el-table-column label="是否在线" align="center" prop="status" />
      <el-table-column label="是否绑定网关" align="center" prop="labelStatus" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:shopLabel:edit']"
          >绑定商品</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:shopLabel:remove']"
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

    <!-- 添加或修改电子价签管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="标签Mac地址" prop="mac">
          <el-input v-model="form.mac" placeholder="请输入标签Mac地址" />
        </el-form-item>
         <el-form-item label="门店信息" prop="storeid">
              <el-select
                v-model="form.storeid"
                placeholder="请选择门店"
                filterable
                 style="width:100%"
              >
                <el-option
                  v-for="item in shopList"
                  :key="item.storeid"
                  :label="item.shopName"
                  :value="item.storeid"
                >
                  <span style="float: left;width:50%">{{ item.storeid }}</span>
                   <span style="float: left;width:50%">{{ item.shopName }}</span>
                </el-option>
              </el-select>
        </el-form-item> 
        <el-form-item label="模板id" prop="demoid">
          <el-select v-model="form.demoid" placeholder="请选择模板ID" style="width:100%">
            <el-option
              v-for="dict in demoId"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签尺寸" prop="inch">
          <el-input v-model="form.inch" placeholder="请输入标签尺寸" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  <el-dialog title="绑定商品信息" :visible.sync="editOpen" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="标签Mac地址" prop="mac">
          <el-input v-model="form.mac" placeholder="请输入标签Mac地址" :readonly="true"/>
        </el-form-item>
         <el-form-item label="商品信息" prop="goodsCode">
              <el-select
                v-model="form.goodsCode"
                placeholder="请选择商品"
                filterable
                 style="width:100%"
              >
                <el-option
                  v-for="item in goodsList"
                  :key="item.goodsCode"
                  :label="item.goodsName"
                  :value="item.goodsCode"
                >
                  <span style="float: left;width:40%">{{ item.goodsCode }}</span>
                  <span style="float: left;width:40%">{{ item.goodsName }}</span>
                  <span style="float: left;width:10%">{{ item.goodsDw }}</span>
                  <span style="float: left;width:10%">{{ item.goodsG }}</span>
                </el-option>
              </el-select>
        </el-form-item> 
        <el-form-item label="模板id" prop="demoid">
          <el-select v-model="form.demoid" placeholder="请选择模板ID" style="width:100%">
            <el-option
              v-for="dict in demoId"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
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
import { listShopLabel, getShopLabel, delShopLabel, addShopLabel, updateShopLabel, exportShopLabel,bindShopLabel } from "@/api/system/shopLabel";
import {listShopInfo} from "@/api/system/shopInfo"; 
import { listShopGoods} from "@/api/system/shopGoods";
export default {
  name: "ShopLabel",
  data() {
    return {
           //门店
      shopList: [],
       //商品
      goodsList: [],
      //模板ID
      demoId:[],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 选中数组
      macs: [],
      // 选中门店
      storeIds: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 电子价签管理表格数据
      shopLabelList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
       // 是否显示弹出层
      editOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        mac: undefined,
        activekey: undefined,
        storeid: undefined,
        goodsCode: undefined,
        labelStatus: undefined,
        gatewayMac: undefined,
        inch: undefined,
        battery: undefined,
        demoid: undefined,
        status: undefined,
        temperature: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        mac:[
           {required:true,message:"MAC地址不能为空", trigger: "blur"}
         ],
         storeid:[
           {required:true,message:"门店不能为空", trigger: "blur"}
         ],
         demoid:[
           {required:true,message:"模板不能为空", trigger: "blur"}
         ],
      }
    };
  },
  created() {
    this.getList();
        //获取门店信息
    listShopInfo(this.queryParams).then(response => {
        this.shopList = response.rows;
        console.log(this.shopList)
    });
    //获取商品信息
      listShopGoods(this.queryParams).then(response => {
        this.goodsList = response.rows;
      });
      //获取模板信息
    this.getDicts("demo_type").then((response) => {
      this.demoId = response.data;
    });
  },
  methods: {
    /** 查询电子价签管理列表 */
    getList() {
      this.loading = true;
      listShopLabel(this.queryParams).then(response => {
        this.shopLabelList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.editOpen = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        mac: undefined,
        activekey: undefined,
        storeid: undefined,
        goodsCode: undefined,
        labelStatus: "0",
        gatewayMac: undefined,
        inch: undefined,
        battery: undefined,
        demoid: undefined,
        status: "0",
        temperature: undefined,
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
      this.macs = selection.map(item => item.mac)
      this.storeIds = selection.map(item => item.storeid)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加电子价签管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getShopLabel(id).then(response => {
        this.form = response.data;
        this.editOpen = true;
        this.title = "";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateShopLabel(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.editOpen = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addShopLabel(this.form).then(response => {
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
      this.$confirm('是否确认删除电子价签管理编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delShopLabel(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 绑定网关按钮操作 */
    handleBind(row) {
      console.log(row)
      const macs = row.mac || this.macs;
      const storeIds = row.storeIds || this.storeIds;
      this.$confirm('是否确认绑定电子价签编号为"' + macs + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return bindShopLabel(macs,storeIds[0]);
        }).then(() => {
          this.getList();
          this.msgSuccess("绑定成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有电子价签管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportShopLabel(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>