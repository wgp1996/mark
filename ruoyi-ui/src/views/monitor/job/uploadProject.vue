<template>
  <div class="app-container">
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.8">
        <el-button
          type="warning"
          icon="el-icon-edit"
          size="mini"
          @click="handleCheck"
          >检测文件</el-button
        >
      </el-col>
      <el-col :span="1.8">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          @click="handleDelete"
          >删除文件</el-button
        >
      </el-col>
    </el-row>
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-input v-model="fileName" placeholder="请输入项目名称" />
      </el-col>
    </el-row>
    <el-row :gutter="15" class="mb8">
      <el-col :span="1.5">
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="upload.url"
          :on-preview="clickFile"
          :headers="upload.headers"
          :on-remove="handleRemove"
          :file-list="fileList"
          :data="dataList"
          :on-success="handleFileSuccess"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary"
            >选取文件</el-button
          >
          <el-button
            style="margin-left: 10px"
            size="small"
            type="success"
            @click="submitUpload"
            >上传到服务器</el-button
          >
        </el-upload>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { deleteProject, checkProject } from "@/api/system/file";
let _that;
export default {
  name: "uploadProject",
  data() {
    return {
      fileName: "",
      fileList: [],
      dataList: null,
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
        url: process.env.VUE_APP_BASE_API + "/common/uploadProject",
      },
    };
  },
  created() {
    _that=this;
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit();
      //   if(this.filePath==""){
      //       return
      //   }else{
      //   this.$nextTick(() => {
      //         this.upload.url=process.env.VUE_APP_BASE_API + "/common/uploadProject?filePath="+this.filePath
      //         this.$refs.upload.action=process.env.VUE_APP_BASE_API + "/common/uploadProject?filePath="+this.filePath;
      //         this.$refs.upload.submit();
      //          console.log(this.upload.url)
      //   });
      //}
    },
    clickFile(file) {
      console.log(file);
      if (
        file.response != "" &&
        file.response != undefined &&
        file.response != null
      ) {
        window.open(file.response.url);
      }
      if (file.url != "" && file.url != undefined && file.url != null) {
        window.open(file.url);
      }
    },
    handleFileSuccess(res, file, fileList) {
      _that.fileList = fileList;
      //fileList = [];
      // 上传成功
      console.log(res.url);
      // this.form.fileName = res.url;
    },
    handleRemove(file, fileList) {},
    handleDelete() {
      if (_that.fileName != "") {
        _that.$confirm(
          "是否确认删除名称为" + _that.fileName + '"的文件或文件夹?',
          "警告",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(function () {
             deleteProject(_that.fileName).then((response) => {
                if(response.result==true){
                    _that.msgSuccess(_that.fileName+"删除成功!");
                }else{
                     _that.msgError(_that.fileName+"删除失败!");
                }
              });
          })
      } else {
        _that.msgError("请输入文件名!");
      }
    },
    handleCheck() {
      if (_that.fileName != "") {
        checkProject(_that.fileName).then((response) => {
          if(response.result==1){
              _that.msgSuccess(_that.fileName+"存在!");
          }else{
              _that.msgError(_that.fileName+"不存在!");
          }
        });
      } else {
        _that.msgError("请输入文件名!");
      }
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
</style>