<template>
    <div id="banner">
      <!--动态将图片轮播图的容器高度设置成与图片一致-->
      <el-carousel :height="300 + 'px'"  type="card" style="width:100%" arrow="always">
        <!--遍历图片地址,动态生成轮播图-->
        <el-carousel-item v-for="item in img_list" :key="item" :width="300+'px'">
          <img :src="item" alt="" style="height:300px;">
        </el-carousel-item>
      </el-carousel>
    </div>
</template>
 
<script>
    export default {
        name: "Banner",
        data(){
          return{
            // 图片地址数组
            // img_list:[
            //   "/static/image/111.png",
            //   "/static/image/222.png",
            //   "/static/image/333.png",
            //   "/static/image/444.png",
            // ],
            img_list: [
               "https://www.lczhuisu.cn:443/qdzq/images/a1.jpg",
               "https://www.lczhuisu.cn:443/qdzq/images/a2.jpg",
               "https://www.lczhuisu.cn:443/qdzq/images/a3.jpg",
                "https://www.lczhuisu.cn:443/qdzq/images/a4.jpg",
                "https://www.lczhuisu.cn:443/qdzq/images/a5.jpg",
              
               
      
        ],
            // 图片父容器高度
            bannerHeight :300,
            // 浏览器宽度
            screenWidth :0,
          }
        },
        methods:{
          setSize:function () {
            // 通过浏览器宽度(图片宽度)计算高度
          
            this.bannerHeight = 400 / 1920 * this.screenWidth;
          },
        },
      mounted() {
          // 首次加载时,需要调用一次
          this.screenWidth =  window.innerWidth;
          this.setSize();
          // 窗口大小发生改变时,调用一次
          window.onresize = () =>{
          this.screenWidth =  window.innerWidth;
          this.setSize();
        }
      }
    }
</script>
 
<style scoped>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }
 .el-carousel__item{
   width: 50% !important;
   text-align: center;
 

 }
 
 
  /* .el-carousel__item:nth-child(2n+1) {
      background-color: #d3dce6; 
  }  */
  img{
    /*设置图片宽度和浏览器宽度一致*/
    width: 55%;
    height: inherit;
  }
</style>