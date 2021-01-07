<template>
    <div class="app-container">
            <baidu-map class="bm-view" ak="cGklIMXA6RuKkir9UobkakSE0QhwyuoO"  @ready="handler"  id="Map"
             :min-zoom="10"
             :max-zoom="17"
             :scroll-wheel-zoom="true"
             style="height:500px"
          >
          <bm-marker
                 v-for="item in center"
                  :key="item.lng"
                :position="{lng: item.lng, lat: item.lat}"
                :dragging="true"
                @click="infoWindowOpen"
              >
                <bm-info-window :show="show" @close="infoWindowClose" @open="infoWindowOpen">我爱北京天安门</bm-info-window>
              </bm-marker>
           
            </baidu-map>
    </div>
</template>
<script>
 var _that
import {BaiduMap, BmMarker,BmControl,BmAutoComplete,BmLocalSearch, BmView,BmInfoWindow} from 'vue-baidu-map'
 import iconCar from '@/assets/image/orange.png'; //以import的方式导入图片文件
export default {
     name: "Info",
  components: {
    BaiduMap,
    BmMarker,
    BmControl,
    BmAutoComplete,
    BmLocalSearch,
    BmView,
    BmInfoWindow
    // form: {
           
    //     markName: undefined,
    //     perationName: undefined,
    //     perationNature: undefined,
    //     socialCreditCode: undefined,
    //     markAddressCity: undefined,
    //     markAddressProvince: undefined,
    //     markAddressArea: undefined,
    //     markAddressDetail: undefined,
    //     markCreateTime: undefined,
    //     markMerchantsCount: undefined,
    //     markNote: undefined,
    //     createUser: undefined,
    //     markCode: undefined,
    //     createBy: undefined,
    //     createTime: undefined,
    //     updateBy: undefined,
    //     updateTime: undefined,
    //     remark: undefined,
    //      sampAddress: undefined, 
    //       sampAddressPerson: undefined,  
    //       sampaddressPersonTel: undefined, 
    //      sampBz: undefined,
    //       addressLat: undefined, 
    //       addressLng: undefined, 
      
    //       ckAddress: undefined,
    //       lat: undefined,
    //     lng: undefined,
    //     fileName:undefined
    // },
  },
  data(){
    return {
      center: [{lng: '115.986989', lat: '36.462411'},{lng: '115.486989', lat: '36.56211'},{lng: '115.286989', lat: '36.16'}],
      zoom: 15,
      showMap: true,
      keyword:'',
      BMap: null,
      map: null,
      show:false
    }
  },
  methods:{
      handler () {
      
        const map = new BMap.Map("Map");
        for(var i=0;i<this.center.length;i++){
          var lng=this.center[i].lng;
          var lat=this.center[i].lat;
            const point = new BMap.Point(lng,lat);
        map.centerAndZoom(point, 11);
        map.setCurrentCity("聊城");

        const deviceSize = new BMap.Size(50,50);
        console.log(iconCar)
        const deviceIcon = new BMap.Icon(iconCar, deviceSize, { //会以base64的方式传参iconCar
            imageSize: deviceSize
        });

        const marker = new BMap.Marker(point, {
            icon: deviceIcon
        });
     
        map.addOverlay(marker);
             
      }
      
    },
            // 地图点击事件
    infoWindowClose () {
      this.show = false
    },
     infoWindowOpen () {
      this.show = true
    }
  }
}
</script>