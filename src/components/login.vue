<template>
  <div class="background">
    <div class="login-box">
      <h3 class="Title">登录</h3>
      <el-form
        :model="loginFormData"
        :rules="loginRules"
        label-width="6vw"
        ref="form1">
        <el-form-item label="用户账号" prop="username">
          <el-input v-model="loginFormData.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input type="password" v-model="loginFormData.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <div style="display: flex;position:relative;width: 100%">
            <el-button type="primary" @click="Login" class="btn" style="position: relative;margin-left:5vw">登入</el-button>
            <el-button type="primary" @click="Register" class="btn" style="position: relative;margin-left:5vw">注册</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import router from '@/router/index.js'
export default {
  name: "login",
  data(){
    return{
      loginFormData:{
        username:"",
        password:""
      },
      loginRules:{
        username:[{required: true, message: '用户名不能为空', trigger: 'blur'}],
        password:[{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    }
  },
  methods:{
    Login(){
      console.log("try to login")
      this.$refs.form1.validate(valid => {
        if (valid) {
          this.$axios.post("http://localhost:8080/findUser",
              {username:this.loginFormData.username,password:this.loginFormData.password}).then((response) => {
                console.log(response)
            if (response.data.code === 200) {
              //跳转页面，replace表示不可以回退页面，push则可以回退页面
              this.$message.success("登录成功！")
              console.log("成功登录")
              console.log(response)
              localStorage.setItem("token",response.data.data)
              router.push('/home')
            }
            else {
              this.$message.error("登录失败！")
            }
          })
        }
        else{
          this.$message.error("请输入用户名和密码！");
          return false;
        }
      });
    },
    Register(){
      router.push("/register")
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