<template>
  <el-row :gutter="10" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" style="width:16.6% !important">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')" style="background-color:#ccc" v-bind:class="{ 'activefather': father}">
        <div class="card-panel-icon-wrapper icon-people"  style="margin:14px 0px 0px 0px;padding:16px 0px 0px 2px">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description" >
          <div class="card-panel-text" style="color:#000">
            节点业户
          </div>
          <count-to :start-val="0" :end-val="total" :duration="3000" class="card-panel-num" style="color:#000"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" style="width:16.6% !important">
      <div class="card-panel" @click="handleSetLineChartData('messages')" style="background-color:#ccc" v-bind:class="{ 'activefather': father1}">
        <div class="card-panel-icon-wrapper icon-message special" style="margin:14px 0px 0px 0px;padding:16px 0px 0px 2px">
          <!-- <svg-icon icon-class="message" class-name="card-panel-icon" /> -->
          <img src="../../assets/count.png" style="width:50px;height:50px">
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text" style="color:#000">
           溯源商品
          </div>
          <count-to :start-val="0" :end-val="total1" :duration="3000" class="card-panel-num" style="color:#000"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" style="width:16.6% !important">
      <div class="card-panel" @click="handleSetLineChartData('purchases')" style="background-color:#ccc" v-bind:class="{ 'activefather': father2}">
        <div class="card-panel-icon-wrapper icon-money special" style="margin:14px 0px 0px 0px;padding:16px 0px 0px 2px">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text" style="color:#000">
           入场溯源单
          </div>
          <count-to :start-val="0" :end-val="total2" :duration="3000" class="card-panel-num" style="color:#000"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" style="width:16.6% !important">
      <div class="card-panel" @click="handleSetLineChartData('shopping')" style="background-color:#ccc" v-bind:class="{ 'activefather': father3}">
        <div class="card-panel-icon-wrapper icon-shopping special" style="margin:14px 0px 0px 0px;padding:16px 0px 0px 2px">
          <!-- <svg-icon icon-class="shopping" class-name="card-panel-icon" /> -->
          <img src="../../assets/dan.png" style="width:50px;height:50px">
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text" style="color:#000">
            产地档案
          </div>
          <count-to :start-val="0" :end-val="total3" :duration="3600" class="card-panel-num" style="color:#000"/>
        </div>
      </div>
    </el-col>
      <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" style="width:16.6% !important"> 
      <div class="card-panel" @click="handleSetLineChartData('shoppings')" style="background-color:#ccc" v-bind:class="{ 'activefather': father4}">
        <div class="card-panel-icon-wrapper icon-shopping special" style="margin:14px 0px 0px 0px;padding:16px 0px 0px 2px">
          <!-- <svg-icon icon-class="shopping" class-name="card-panel-icon" /> -->
          <img src="../../assets/he.png" style="width:50px;height:50px">
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text" style="color:#000">
           销货单据
          <!-- <span style="display:inline-block;color:#666;font-size:20px;margin-top:15px">89.7%</span> -->
          </div>
          <count-to :start-val="0" :end-val="total4" :duration="3600" class="card-panel-num" style="color:#000"/> 
        </div>
      </div>
    </el-col>
     <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" style="width:16.6% !important"> 
 
      <div class="card-panel" @click="handleSetLineChartData('random')" style="background-color:#ccc" v-bind:class="{ 'activefather': father5}">
        <div class="card-panel-icon-wrapper icon-message" style="margin:14px 0px 0px 0px;padding:16px 0px 0px 2px">
          <svg-icon icon-class="documentation" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text" style="color:#000">
             随机抽检
          </div>
          <count-to :start-val="0" :end-val="total5" :duration="3600" class="card-panel-num" style="color:#000"/> 
        </div>
      </div>

    </el-col>
    <!-- 蔬菜 -->
     <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" style="width:12.4% !important;"> 
       <div class="card-panel" @click="handleSetLineChart('1')" style="height:80px;background-color:#d7d7d7" v-bind:class="{ 'actives': isActive }">
        <div class="card-panel-icon-wrapper " style="margin:14px 0px 0px 0px;padding:0px 0px 0px 6px">
          <!-- <svg-icon icon-class="documentation" class-name="card-panel-icon" /> -->
          <img src="../../assets/shucai.png" style="width:50px;height:50px">
        </div>
        
        <div class="card-panel-description" >
          <div class="card-panel-text"  style="margin-bottom:6px;color:#000;font-size:20px;">
             蔬菜
          </div>
          <count-to :start-val="0" :end-val="result" :duration="3600" class="card-panel-num" style="font-size:18px;color:#000"/> 
        </div>
      </div>
     </el-col>
        <!-- 水果 -->
     <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" style="width:12.4% !important;"> 
       <div class="card-panel" @click="handleSetLineChart('2')" style="height:80px;background-color:#d7d7d7" v-bind:class="{ 'actives': isActive1 }">
        <div class="card-panel-icon-wrapper " style="margin:14px 0px 0px 0px;padding:0px 0px 0px 6px">
          <!-- <svg-icon icon-class="documentation" class-name="card-panel-icon" /> -->
            <img src="../../assets/shuiguo.png" style="width:50px;height:50px">
        </div>
        <div class="card-panel-description" >
          <div class="card-panel-text"  style="margin-bottom:6px;color:#000;font-size:20px;">
             水果
          </div>
          <count-to :start-val="0" :end-val="result1" :duration="3600" class="card-panel-num" style="font-size:18px;color:#000"/> 
        </div>
      </div>
     </el-col>
        <!-- 肉类 -->
     <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" style="width:12.4% !important;"> 
       <div class="card-panel" @click="handleSetLineChart('6')" style="height:80px;background-color:#d7d7d7" v-bind:class="{ 'actives': isActive2 }">
        <div class="card-panel-icon-wrapper " style="margin:14px 0px 0px 0px;padding:0px 0px 0px 6px">
          <!-- <svg-icon icon-class="documentation" class-name="card-panel-icon" /> -->
             <img src="../../assets/rou.png" style="width:50px;height:50px">
        </div>
        <div class="card-panel-description" >
          <div class="card-panel-text" style="margin-bottom:6px;color:#000;font-size:20px;">
             肉类
          </div>
          <count-to :start-val="0" :end-val="result2" :duration="3600" class="card-panel-num" style="font-size:18px;color:#000"/> 
        </div>
      </div>
     </el-col>
        <!-- 水产 -->
     <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" style="width:12.4% !important;"> 
       <div class="card-panel" @click="handleSetLineChart('5')" style="height:80px;background-color:#d7d7d7" v-bind:class="{ 'actives': isActive3 }">
        <div class="card-panel-icon-wrapper " style="margin:14px 0px 0px 0px;padding:0px 0px 0px 6px">
          <!-- <svg-icon icon-class="documentation" class-name="card-panel-icon" /> -->
           <img src="../../assets/haixian.png" style="width:50px;height:50px">
        </div>
        <div class="card-panel-description" >
          <div class="card-panel-text" style="margin-bottom:6px;color:#000;font-size:20px;">
             水产
          </div>
          <count-to :start-val="0" :end-val="result3" :duration="3600" class="card-panel-num" style="font-size:18px;color:#000"/> 
        </div>
      </div>
     </el-col>
        <!-- 冻品 -->
     <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" style="width:12.4% !important;"> 
       <div class="card-panel" @click="handleSetLineChart('3')" style="height:80px;background-color:#d7d7d7" v-bind:class="{ 'actives': isActive4 }">
        <div class="card-panel-icon-wrapper " style="margin:14px 0px 0px 0px;padding:0px 0px 0px 6px">
          <!-- <svg-icon icon-class="documentation" class-name="card-panel-icon" /> -->
           <img src="../../assets/dongpin.png" style="width:50px;height:50px">
        </div>
        <div class="card-panel-description" >
          <div class="card-panel-text" style="margin-bottom:6px;color:#000;font-size:20px;">
             冻品
          </div>
          <count-to :start-val="0" :end-val="result4" :duration="3600" class="card-panel-num" style="font-size:18px;color:#000"/> 
        </div>
      </div>
     </el-col>
       <!-- 干调 -->
     <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" style="width:12.4% !important;"> 
       <div class="card-panel" @click="handleSetLineChart('7')" style="height:80px;background-color:#d7d7d7" v-bind:class="{ 'actives': isActive5 }">
        <div class="card-panel-icon-wrapper" style="margin:14px 0px 0px 0px;padding:0px 0px 0px 6px">
          <!-- <svg-icon icon-class="documentation" class-name="card-panel-icon" /> -->
           <img src="../../assets/tiaoliao.png" style="width:50px;height:50px">
        </div>
        <div class="card-panel-description" >
          <div class="card-panel-text" style="margin-bottom:6px;color:#000;font-size:20px;">
             干调
          </div>
          <count-to :start-val="0" :end-val="result5" :duration="3600" class="card-panel-num" style="font-size:18px;color:#000"/> 
        </div>
      </div>
     </el-col>
        <!-- 熟食 -->
     <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" style="width:12.4% !important;"> 
       <div class="card-panel" @click="handleSetLineChart('4')" style="height:80px;background-color:#d7d7d7" v-bind:class="{ 'actives': isActive6 }">
        <div class="card-panel-icon-wrapper " style="margin:14px 0px 0px 0px;padding:0px 0px 0px 6px">
          <!-- <svg-icon icon-class="documentation" class-name="card-panel-icon" /> -->
           <img src="../../assets/shushi.png" style="width:50px;height:50px">
        </div>
        <div class="card-panel-description" >
          <div class="card-panel-text" style="margin-bottom:6px;color:#000;font-size:20px;">
             熟食
          </div>
          <count-to :start-val="0" :end-val="result6" :duration="3600" class="card-panel-num" style="font-size:16px;color:#000"/> 
        </div>
      </div>
     </el-col>
          <!-- 所有 -->
     <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" style="width:12.4% !important;"> 
       <div class="card-panel" @click="handleSetLineChart('')" style="height:80px;background-color:#d7d7d7" v-bind:class="{ 'actives': isActive7 }">
        <div class="card-panel-icon-wrapper " style="margin:14px 0px 0px 0px;padding:0px 0px 0px 6px">
          <!-- <svg-icon icon-class="documentation" class-name="card-panel-icon" /> -->
           <img src="../../assets/all.png" style="width:50px;height:50px">
        </div>
        <div class="card-panel-description" >
          <div class="card-panel-text" style="margin-bottom:6px;color:#000;font-size:20px;">
             所有
          </div>
          <count-to :start-val="0" :end-val="result7" :duration="3600" class="card-panel-num"  style="font-size:16px;color:#000"/> 
        </div>
      </div>
     </el-col>

    
  </el-row>
  
</template>

<script>
import CountTo from 'vue-count-to'
import {
  selectNumlList,
  selectNumFlList
} from "@/api/system/wholeRetails";
export default {
  components: {
    CountTo
  },
    data() {
    return {
   
       // 总条数
      total: 0,
      total2: 0,
      total1:0,
      total3:0,
      total4:0,
      total5:0,
      isActive:false,
      isActive1:false,
      isActive2:false,
      isActive3:false,
      isActive4:false,
      isActive5:false,
      isActive6:false,
      isActive7:false,
      father:false,
      father1:false,
      father2:false,
      father3:false,
      father4:false,
      father5:false,
      result: 0,
       result1: 0,
       result2: 0,
      result3: 0,
        result4: 0,
       result5: 0,
        result6: 0,
        result7: 0,
        // 查询参数
    queryParams: {
         type: undefined,
        
      },
    }
  },
  methods: {
    handleSetLineChartData(type) {
      if(type=="newVisitis"){
        this.father=true;
        this.father1=false;
        this.father2=false;
        this.father3=false;
        this.father4=false;
        this.father5=false;
        selectNumFlList("1").then((response) => {
        // this.total = Number(response.data.ownerCount);
        // this.total1 = Number(response.data.goodsCount);
        // this.total2 = Number(response.data.rkdCount);
        // this.total3 = Number(response.data.addressCount);
        // this.total4 = Number(response.data.wholeCount);
        // this.total5 = Number(response.data.randomCount);
        });
      }else if(type=="messages"){
        this.father=false;
        this.father1=true;
        this.father2=false;
        this.father3=false;
        this.father4=false;
        this.father5=false;
      }else if(type=="purchases"){
        this.father=false;
        this.father1=false;
        this.father2=true;
        this.father3=false;
        this.father4=false;
        this.father5=false;
        selectNumFlList("2").then((response) => {
        // this.total = Number(response.data.ownerCount);
        // this.total1 = Number(response.data.goodsCount);
        // this.total2 = Number(response.data.rkdCount);
        // this.total3 = Number(response.data.addressCount);
        // this.total4 = Number(response.data.wholeCount);
        // this.total5 = Number(response.data.randomCount);
        });
      }else if(type=="shopping"){
        this.father=false;
        this.father1=false;
        this.father2=false;
        this.father3=true;
        this.father4=false;
        this.father5=false;
        selectNumFlList("3").then((response) => {
        // this.total = Number(response.data.ownerCount);
        // this.total1 = Number(response.data.goodsCount);
        // this.total2 = Number(response.data.rkdCount);
        // this.total3 = Number(response.data.addressCount);
        // this.total4 = Number(response.data.wholeCount);
        // this.total5 = Number(response.data.randomCount);
        });
      }else if(type=="random"){
        this.father=false;
        this.father1=false;
        this.father2=false;
        this.father3=false;
        this.father4=false;
        this.father5=true;
      }
      this.$emit('handleSetLineChartData', type)
    },
    handleSetLineChart(type) {
      if(type=="1"){
        this.isActive=true;
        this.isActive1=false;
        this.isActive2=false;
        this.isActive3=false;
        this.isActive4=false;
        this.isActive5=false;
        this.isActive6=false;
           this.isActive7=false;
      }else if(type=="2"){
        this.isActive1=true;
        this.isActive=false;
        this.isActive2=false;
        this.isActive3=false;
        this.isActive4=false;
        this.isActive5=false;
        this.isActive6=false;
           this.isActive7=false;
      }else if(type=="6"){
        this.isActive1=false;
        this.isActive=false;
        this.isActive2=true;
        this.isActive3=false;
        this.isActive4=false;
        this.isActive5=false;
        this.isActive6=false;
         this.isActive7=false;
      }else if(type=="5"){
        this.isActive1=false;
        this.isActive=false;
        this.isActive2=false;
        this.isActive3=true;
        this.isActive4=false;
        this.isActive5=false;
        this.isActive6=false;
        this.isActive7=false;
      }else if(type=="3"){
        this.isActive1=false;
        this.isActive=false;
        this.isActive2=false;
        this.isActive3=false;
        this.isActive4=true;
        this.isActive5=false;
        this.isActive6=false;
        this.isActive7=false;
      }else if(type=="7"){
        this.isActive1=false;
        this.isActive=false;
        this.isActive2=false;
        this.isActive3=false;
        this.isActive4=false;
        this.isActive5=true;
        this.isActive6=false;
        this.isActive7=false;
      }else if(type=="4"){
        this.isActive1=false;
        this.isActive=false;
        this.isActive2=false;
        this.isActive3=false;
        this.isActive4=false;
        this.isActive5=false;
        this.isActive6=true;
        this.isActive7=false;
      }else if(type==""){
        this.isActive1=false;
        this.isActive=false;
        this.isActive2=false;
        this.isActive3=false;
        this.isActive4=false;
        this.isActive5=false;
        this.isActive6=false;
        this.isActive7=true;
      }
      this.$emit('handleSetLineChart', type)
    },
   getList() {
      this.loading = true;
      selectNumlList().then((response) => {
        console.log(response)
        this.total = Number(response.data.ownerCount);
        this.total1 = Number(response.data.goodsCount);
        this.total2 = Number(response.data.rkdCount);
        this.total3 = Number(response.data.addressCount);
        this.total4 = Number(response.data.wholeCount);
        this.total5 = Number(response.data.randomCount);
     });
    },
 
  },
  created() {
    this.getList();
    
  },
  mounted(){
     
  }
}
</script>

<style lang="scss" scoped>
.actives{
  background-color:#ff9933 !important;
}
.activefather{
  background-color:#ff9933 !important;
}
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      text-align: center;
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
@media (max-width:1400px) {
  .panel-group .card-panel .card-panel-icon-wrapper[data-v-0333a520] {
    margin: 14px 0 0 0px;
    padding:16px 5px
  }


}
@media (max-width:1400px) {
  .panel-group .card-panel .card-panel-icon-wrapper[data-v-0333a520] {
    margin: 14px 0 0 0px;
    padding:16px 5px
  }


}

</style>
