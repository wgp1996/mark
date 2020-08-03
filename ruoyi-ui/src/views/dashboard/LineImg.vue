<template>
    <div id="banner">
    <!--动态将图片轮播图的容器高度设置成与图片一致-->
    <el-carousel 
    type="card"
    :interval=4000
    >
      <el-carousel-item v-for="(img,index) in imgList" :key="index">
        <div class="grid-content">
							<div>
								<img :src="img.url" style="height:250px">
								<p class="italictext" style="text-align:center">{{img.price}}</p>
							</div>
					</div>
        <!-- <img :src="img.url">
        <span>1.2</span> -->
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
export default {
  name: "Banner",
  data() {
    return {
      // 图片地址数组
    imgList: [
        {
          url: "https://www.lczhuisu.cn:443/qdzq/images/a1.jpg",
          price:'2.55'
        },
        {
          url: "https://www.lczhuisu.cn:443/qdzq/images/a2.jpg",
           price:'3.50'
        },
        {
          url: "https://www.lczhuisu.cn:443/qdzq/images/a3.jpg",
           price:'2.78'
        },
        {
          url: "https://www.lczhuisu.cn:443/qdzq/images/a4.jpg",
           price:'2.89'
        },
        {
          url: "https://www.lczhuisu.cn:443/qdzq/images/a5.jpg",
           price:'1.85'
        },
        {
          url: "https://www.lczhuisu.cn:443/qdzq/images/a6.jpg",
           price:'2.54'
        },
        {
          url: "https://www.lczhuisu.cn:443/qdzq/images/a8.jpg",
           price:'2.5'
        }
      ],
    };
  },
  methods: {
    setSize: function() {
      // 通过浏览器宽度(图片宽度)计算高度
      this.bannerHeight = (400 / 1920) * this.screenWidth;
    }
  },
  mounted() {
    // 首次加载时,需要调用一次
    this.screenWidth = window.innerWidth;
    this.setSize();
    // 窗口大小发生改变时,调用一次
    window.onresize = () => {
      this.screenWidth = window.innerWidth;
      this.setSize();
    };
  }
};
</script>
 
<style scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
img {
  /*设置图片宽度和浏览器宽度一致*/
  width: 100%;
  height: inherit;
}
</style>
