<template>
<div class="father">
 <div class="shadow">
  <div class="login">
       <div class="login_main">
        <div class="main_left">
          <img src="../assets/image/888.jpg" style="height:240px;width:515px">
        </div>
        <div class="main_right">
            <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form username">
                <el-form-item prop="username" class="spp">
                  <span>用户</span>
                 <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
                  <!-- <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" /> -->
                  
                </el-input>
                    <p class="p1">周公河农贸城食安追溯平台</p>
                    <p class="p2">ZhouGongHe Farmer's Wholesale Marke Food safety platform</p>
              </el-form-item>
              <el-form-item prop="password" class="spp">
                      <span>口令</span>
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  auto-complete="off"
                  placeholder="密码"
                  @keyup.enter.native="handleLogin"
                >
                  <!-- <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" /> -->
                </el-input>
              </el-form-item>
                <el-form-item prop="code" class="spp">
                  <span style="left:35px">验证码</span>
                <el-input
                  v-model="loginForm.code"
                  auto-complete="off"
                  placeholder="验证码"
                  style="width:55%;float:left"
                  @keyup.enter.native="handleLogin"
                  class="special"
                >
                  <!-- <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" /> -->
                </el-input>
                <div class="login-code">
                  <img :src="codeUrl" @click="getCode"  style="width:100px;height:35px;margin-top:10px"/>
                </div> 
              </el-form-item>
              <!-- <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox> -->
              <el-form-item style="" class="yes_login spp">
                <el-button
                  :loading="loading"
                  size="medium"
                  type="primary"
                  style="width:100%;"
                  @click.native.prevent="handleLogin"
               
                >
                  <span v-if="!loading">
                    <img src="../assets/image/login.png" style=" width: 23px;height: 23px;margin-right: 5px;">
                    登 录</span>
                  <span v-else>登 录 中...</span>
                </el-button>
              </el-form-item>
              <div class="texter">
                       <p class="p3">山东盛世长城技术咨询有限公司</p>
                       <p class="p3">Copyright @ 聊城追溯 2020</p>
              </div>
            </el-form>
           
        </div>
    </div>

    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2018-2019 ruoyi.vip All Rights Reserved.</span>
    </div>
  </div>
  </div>
   </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "admin",
        password: "admin123",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" }
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" }
        ],
        code: [{ required: true, trigger: "change", message: "验证码不能为空" }]
      },
      loading: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        console.log(route);
        //默认跳首页
        this.redirect="/index"
        //跳转上次打开的界面
        //this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCode();
    this.getCookie();
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.codeUrl = "data:image/gif;base64," + res.img;
        this.loginForm.uuid = res.uuid;
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" });
            })
            .catch(() => {
              this.loading = false;
              this.getCode();
            });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.father{
  width:100%;
  height:100%;
  background: url("../assets/image/bg5.jpg");
  // background-size: cover;
  // background-repeat:repeat;
}
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  // background-image: url("../assets/image/login-background.jpg");
  // background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}
.spp{
  margin-bottom:0px
}
button{
  height:auto
}
.el-button--medium {
    padding:0;
    font-size: 14px;
    border-radius: 4px;
    width: 90px !important;
    height:35px
}
.special input{
  width: 140px !important;
}
// .login-form {
//   border-radius: 6px;
//   background: #ffffff;
//   width: 400px;
//   padding: 25px 25px 5px 25px;
//   .el-input {
//     height: 38px;
//     input {
//       height: 38px;
//     }
//   }
//   .input-icon {
//     height: 39px;
//     width: 14px;
//     margin-left: 2px;
//   }
// }
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 40%;
  height: 35px;
  float: left;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
// 后加的
/*css 初始化 */
html, body, ul, li, ol, dl, dd, dt, p, h1, h2, h3, h4, h5, h6, form, fieldset, legend, img {
    margin: 0;
    padding: 0;

}
html,body{
       width: 100%;
    height: 100%;

}

// #app{
//         background: url("../assets/image/bg5.jpg");
//       // /*background-size: cover;*/
//         background-repeat:repeat;
//       //  background-color: #fff !important
// }
/*将标签原有的默认内外边距去掉*/

fieldset, img, input, button {
    border: none; /*去掉边框*/
    padding: 0;
    margin: 0;
    outline-style: none; /*去掉环绕边框*/
}
.shadow{
    width: 100%;
    height: 200px;
    background-color:#d7d7d7;
   
     background-size: cover;
    position: absolute;
    left:0%;
    top:0%;
    bottom: 0;
    right: 0;
    margin: auto;
    background-repeat: no-repeat;
    background-position: center;
}
ul, ol {
    list-style: none; /*去掉原样式中的小黑点*/
    /*ctrl+alt+l*/
}

input {
    padding-top: 0;
    padding-bottom: 0;

}

select, input {
    vertical-align: middle; /*输入字居中显示*/
}

select, input, textarea {
    font-size: 14px;
    margin: 0;
}



img {
    border: 0;
    vertical-align: middle; /*  去掉图片底部默认的3像素空白缝隙*/
}

table {
    border-collapse: collapse; /*合并外边线*/
}

body {
    font-family:  Microsoft YaHei, Arial, "\5b8b\4f53";
    /*background: #0058ac;*/
}

.clearfix:before, .clearfix:after {
    content: "";
    display: table;
}

.clearfix:after {
    clear: both;
}

.clearfix {
    *zoom: 1; /*IE/7/6*/
    /*兼容IE6下的写法*/
}
  input::-webkit-input-placeholder{
            color:#000;
        }
        input::-moz-placeholder{   /* Mozilla Firefox 19+ */
            color:#000;
        }
        input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
            color:#000;
        }
        input:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
            color:#000;
        }
h1, h2, h3, h4, h5, h6 {
    text-decoration: none; /**/
    font-weight: normal; /*不加粗*/
    font-size: 100%;
}

/*login 开始*/
.login{
    width: 1000px;
    height: 240px;
    /*background-color: yellowgreen;*/
    position: absolute;
    left:50%;
    top:50%;
    margin-left: -600px;
    margin-top: -120px;
}
.login>.login_title{
    height: 80px;
    text-align: center;
}
.login>.login_title>p{
    color:#daa411;
    font-size: 40px;
    font-weight: 600;
    margin-top: -8px;
    letter-spacing:5px;
    font-family: "Times New Roman", Times, serif
}
.login>.login_main{
    width: 1000px;
    height: 240px;
    /*margin-top: 20px*/
}
.login>.login_main>.main_left{
    height: 240px;
    width: 550px;
    float: left;
    -moz-border-top-left-radius: 10px;
    -webkit-border-top-left-radius: 10px;
    border-top-left-radius: 10px;
    -moz-border-bottom-left-radius: 10px;
    -webkit-border-bottom-left-radius: 10px;
    border-bottom-left-radius: 10px;
    position: relative;
    box-sizing: border-box;
    background-position: center;
}
.login>.login_main>.main_left>img{
    position: absolute;
    top: 0;left:0;
}
.login>.login_main>.main_right{
    height: 240px;
    width: 450px;
    float: right;
    display: table;
    -moz-border-top-right-radius: 10px;
    -webkit-border-top-right-radius: 10px;
    border-top-right-radius: 10px;

    -moz-border-bottom-right-radius: 10px;
    -webkit-border-bottom-right-radius: 10px;
    border-bottom-right-radius: 10px;
}
.username{
    display: table-cell;
    vertical-align: middle;
    position: relative;
}
.login>.login_main>.main_right>.right_title{
    color:#daa411;
    font-size: 23px;
    font-weight: normal;
    text-align: center;
    line-height: 60px;
    /*background: url("../img/border_img.png") repeat;*/
    margin-bottom: 5px;
    letter-spacing: 2px
}
.login>.login_main>.main_right>.username>div{
    position: relative;
}
.login>.login_main>.main_right>.username>div>img{
    position: absolute;
    left: 62px;
    top:7px;
    width: 20px;height: 20px;
    z-index: 999
}
.login>.login_main>.main_right>.username>div>div>span{
    position: absolute;
    left: 50px;
    top:10px;
    width: 50px;height: 20px;
    z-index: 999;
     display: inline-block;
     font-size: 16px
}
.login>.login_main>.main_right>.username input{
    background-color: #fff;
    height: 35px;
    width: 250px;
    line-height: 35px;
    border: 1px solid gray;
    box-sizing: border-box;
    margin: 10px 0px;
    margin-left: 100px;
    -moz-border-radius: 10px;
    -webkit-border-radius: 10px;
    border-radius: 10px;
    color:#000;
    padding-left: 15px;
}

.login>.login_main>.main_right>.username>.code>input{
    width: 150px;
}
.login>.login_main>.main_right>.username>.code>.code_img{
    width: 90px;
    height: 35px;
    float: right;
    margin-right: 50px;
    cursor: pointer;
}
.login>.login_main>.main_right>.username input:focus{
    border: 1px solid #999;
}
.login>.login_main>.main_right>.username>.yes_login>a{
    display: block;
    width: 90px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    background-color: #199ad4;
    -moz-border-radius: 6px;
    -webkit-border-radius: 6px;
    border-radius: 6px;
    color:#fff;
    text-decoration: none;
    margin-left: 50px;
}
.login>.login_main>.main_right>.username>.yes_login>a:hover{
    /*background-color: #0058af;*/
    cursor: pointer;
}
.login>.login_footer{
    text-align: center;
    padding-top: 20px;
}
.login>.login_footer>p{
    font-size: 14px;
    color:#eee;
    line-height: 30px;
}
.left_title{
    /*background-color: red;*/
    height: 100%;
    border:1px solid #fff;
    box-sizing: border-box;
    padding:20px 20px;
    display: table;
    width: 100%
}
.fontss{
    color: #fff;
    font-size: 24px;
    text-align: center;
    display: block;
    padding:5px 0px 
}
.fonts1{
    color: #fff;
    font-size: 20px;
    padding:5px 0px;
}
.username .p1{
    margin: 1px;
     color:#000;
     font-size: 23px;
     font-weight: bold;
     position: absolute;
     top: -80px;left:100px;
     width: 300px
}
.username .p2{
    margin: 1px;
     color:#000;
     font-size: 16px;
     font-weight: bold;
     position: absolute;
     top: -55px;left:100px;
     width: 520px
}
.yes_login{
    position: absolute !important;
    right: -20px;
    top: 155px;
    height: 35px;
    line-height: 35px;;
}
.texter{
    position: absolute !important;
    left: 350px;
    bottom: -40px;
    width: 200px
}
.p3{
    color:#000;
     font-size: 14px;
     margin: 5px 0px
}
.spp .el-form-item__error {
    color: #ff4949;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 105px;
    top: 45px;
}
/*login 结束*/

</style>
