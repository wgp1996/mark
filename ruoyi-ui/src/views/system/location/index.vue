<template>
  <div class="app-container">
    <baidu-map
      class="bm-view"
      ak="cGklIMXA6RuKkir9UobkakSE0QhwyuoO"
      @ready="handler"
      id="Map"
      :min-zoom="10"
      :max-zoom="17"
      :scroll-wheel-zoom="true"
      style="height: 500px"
    >
      <bm-marker
        v-for="item in center"
        :key="item.lng"
        :position="{ lng: item.lng, lat: item.lat }"
        :dragging="true"
        @click="infoWindowOpen"
      >
        <bm-info-window :show="show" @close="infoWindowClose"
          >我爱北京天安门</bm-info-window
        >
      </bm-marker>
    </baidu-map>
  </div>
</template>
<script>
var _that;
import {
  BaiduMap,
  BmMarker,
  BmControl,
  BmAutoComplete,
  BmLocalSearch,
  BmView,
  BmInfoWindow,
} from "vue-baidu-map";
import iconCar from "@/assets/image/orange.png"; //以import的方式导入图片文件
export default {
  name: "Info",
  components: {
    BaiduMap,
    BmMarker,
    BmControl,
    BmAutoComplete,
    BmLocalSearch,
    BmView,
    BmInfoWindow,
  },
  data() {
    return {
      center: [
        { lng: "115.986989", lat: "36.462411" },
        { lng: "115.486989", lat: "36.56211" },
        { lng: "115.286989", lat: "36.16" },
      ],
      data: [
        { carNumber: "鲁P M1854", wd: "12℃",sd:"5%rh",sd:'62km/h',wz:'山东省聊城市' },
        { carNumber: "鲁P 85S57", wd: "25℃",sd:"4%rh",sd:'78km/h',wz:'山东省聊城市' },
        { carNumber: "鲁P 21OP1", wd: "13℃",sd:"2%rh",sd:'54km/h',wz:'山东省聊城市' },
      ],
      zoom: 15,
      showMap: true,
      keyword: "",
      BMap: null,
      map: null,
      show: false,
    };
  },
  methods: {
    handler() {
      const map = new BMap.Map("Map");
      for (var i = 0; i < this.center.length; i++) {
        var lng = this.center[i].lng;
        var lat = this.center[i].lat;
        const point = new BMap.Point(lng, lat);
        map.centerAndZoom(point, 11);
        map.setCurrentCity("聊城");
        const deviceSize = new BMap.Size(50, 50);
        console.log(iconCar);
        const deviceIcon = new BMap.Icon(iconCar, deviceSize, {
          //会以base64的方式传参iconCar
          imageSize: deviceSize,
        });
        const marker = new BMap.Marker(point, {
          icon: deviceIcon,
        });
        let opts={  
                width:250,
                height:170,
                title:"车辆信息"
        };  
        let infoWindow=new BMap.InfoWindow("<div style='line-height: 25px;margin-top: 10px;'>车辆:"+this.data[i].carNumber+"<br/>温度:"+this.data[i].wd+"<br/>湿度:"+this.data[i].sd+"<br/>速度:"+this.data[i].sd+"<br/>位置:"+this.data[i].wz+"<br/></div>",opts);//创建信息窗口对象  
        map.addOverlay(marker);
        marker.addEventListener("click",function(){  
            map.openInfoWindow(infoWindow,point);//打开信息窗口  
        }); 
      }
    },
    // 地图点击事件
    infoWindowClose() {
      this.show = false;
    },
    infoWindowOpen() {
      alert("s");
      this.show = true;
    },
  },
};
</script>
<style >
  .app-container{
    height: 100%;
  }
</style>