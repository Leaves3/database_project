<template>
  <div class="background">
    <div class="login-box">
      <h3 class="Title">注册</h3>
      <el-form
          :model="registerFormData"
          :rules="registerRules"
          label-width="6vw"
          ref="form1">
        <el-form-item label="用户账号" prop="username">
          <el-input v-model="registerFormData.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input type="password" v-model="registerFormData.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="againPassword">
          <el-input type="password" v-model="registerFormData.againPassword" placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <div style="display: flex;position:relative;width: 100%">
          <el-button type="primary" @click="backToLogin" class="btn" style="position: relative;margin-left:5vw">返回登录</el-button>
          <el-button type="primary" @click="register" class="btn" style="position: relative;margin-left:5vw">注册</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import router from '@/router/index.js'
export default {
  name: "register",
  data(){
    var validateCheckUsername = (rule, value, callback) =>{
      //向数据库确认用户是否存在
      console.log(value);
      callback();
    }
    var validateuserPassword = (rule, value, callback) => {
    console.log("新密码："+ value)
    if (value === "") {
      callback(new Error("请输入新密码"));
    } else if (value.toString().length < 6 || value.toString().length > 18) {
      callback(new Error("密码长度为6-18位"));
    } else {
      callback();
    }
  };
    var validateCheckuserPassword = (rule, value, callback) => {
      console.log("确认密码：" + value);
      if (value !== this.registerFormData.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        console.log("两次密码相同")
        callback();
      }
    };

    return{
      registerFormData:{
        username:"",
        password:"",
        againPassword: ""
      },
      registerRules:{
        username:[{required: true, message: '用户账号不能为空', trigger: 'blur'},
          {validator:validateCheckUsername, trigger: "blur" }],
        password:[{ required: true, message: "请输入密码", trigger: "blur" },
          {validator:validateuserPassword,trigger: "blur" }],
        againPassword:[{ required: true, message: "请输入密码", trigger: "blur" },
          {validator:validateCheckuserPassword, trigger: "blur"}]
      }
    }
  },
  methods:{
    backToLogin(){
      router.push('/')
    },

    register(){
      //向后端注册
      this.$refs.form1.validate(valid => {
        if (valid) {
          //向后端发出请求
          // this.$axios.post("/api/user/login?account="+this.loginFormData.username+"&password="+this.loginFormData.password).then((response) => {
          //   if (response) {
          //     //跳转页面，replace表示不可以回退页面，push则可以回退页面
          //     this.$router.replace('/home')
          //   }
          // })
          console.log("Register successfully")
          router.push('/')
        } else {
          this.$message.error("请输入正确的用户名和密码！");
          return false;
        }
      })
    }
  }
}
</script>

<style scoped>
.background{
  background: url("../assets/loginPicture.jpg");
  width:100vw;
  height:100vh;  /**宽高100%是为了图片铺满屏幕 */
  top: 0;
  left: 0;
  position: fixed;
  background-size: 100% 100%;
}
.login-box{
  border:1px solid #dccfcf;
  width: 350px;
  margin:180px auto;
  padding: 20px 50px 20px 50px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 25px #909399;
  background-color:rgba(255,255,255,0.7);
}

.btn{
  background-color: rgba(232, 188, 125, 0.7);
  border: rgba(232, 188, 125, 1);
}
.btn:hover{
  background-color: rgba(225, 150, 38, 0.7);
}
</style>