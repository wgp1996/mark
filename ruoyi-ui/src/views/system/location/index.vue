<template>
  <div class="app-container" style="min-height: calc(100vh - 84px)">
    <baidu-map
      class="bm-view"
      ak="cGklIMXA6RuKkir9UobkakSE0QhwyuoO"
      @ready="handler"
      id="Map"
      :min-zoom="10"
      :max-zoom="17"
      :scroll-wheel-zoom="true"
      style="height: calc(100vh - 124px)"
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
        { lng: "115.986989", lat: "36.562411" },
        { lng: "115.486989", lat: "36.57211" },
        { lng: "116.286989", lat: "36.36" },
        { lng: "115.880989", lat: "36.56" },
         { lng: "115.752", lat: "36.426" },
        { lng: "115.30989", lat: "36.16" },
         { lng: "115.452", lat: "36.326" },
          { lng: "116.21", lat: "36.336" },
        { lng: "114.70", lat: "36.556" },
         { lng: "114.89", lat: "36.5426" },
        { lng: "115.38", lat: "36.596" },
         { lng: "115.385", lat: "36.526" },
      ],
      data: [
        { carNumber: "鲁P M1854", wd: "12℃",shd:"5%rh",sd:'62km/h',wz:'山东省聊城市官庄村' },
        { carNumber: "鲁P 85S57", wd: "25℃",shd:"4%rh",sd:'78km/h',wz:'山东省聊城市店子镇' },
        { carNumber: "鲁P 21OP1", wd: "13℃",shd:"2%rh",sd:'54km/h',wz:'山东省聊城市东阿县' },
        { carNumber: "鲁P D8421", wd: "11.5℃",shd:"2.5%rh",sd:'58km/h',wz:'山东省聊城市阎寺镇' },
        { carNumber: "鲁P T1M71", wd: "10℃",shd:"2.9%rh",sd:'52km/h',wz:'山东省聊城市郭庄村' },
         { carNumber: "鲁P D2564", wd: "12.5℃",shd:"2.4%rh",sd:'53km/h',wz:'山东省聊城市西付集乡' },
        { carNumber: "鲁P T734U", wd: "11℃",shd:"2.2%rh",sd:'50km/h',wz:'山东省聊城市王奉镇' },
          { carNumber: "鲁U DO601", wd: "11.5℃",shd:"2.5%rh",sd:'58km/h',wz:'山东省聊城市阎寺镇' },
        { carNumber: "鲁U T1171", wd: "10℃",shd:"2.9%rh",sd:'52km/h',wz:'山东省聊城市大寺上镇' },
         { carNumber: "鲁V D8864", wd: "12.5℃",shd:"2.4%rh",sd:'53km/h',wz:'山东省聊城市谢村' },
        { carNumber: "鲁V T74PU", wd: "11℃",shd:"2.2%rh",sd:'50km/h',wz:'山东省聊城市北童庄村' },
        { carNumber: "鲁U T234U", wd: "11℃",shd:"2.2%rh",sd:'50km/h',wz:'山东省聊城市吉固村' },
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
        let infoWindow=new BMap.InfoWindow("<div style='line-height: 25px;margin-top: 10px;'>车辆:"+this.data[i].carNumber+"<br/>温度:"+this.data[i].wd+"<br/>湿度:"+this.data[i].shd+"<br/>速度:"+this.data[i].sd+"<br/>位置:"+this.data[i].wz+"<br/></div>",opts);//创建信息窗口对象  
        map.addOverlay(marker);
        map.enableScrollWheelZoom()
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