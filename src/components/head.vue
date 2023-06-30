<template>
  <div style="height: 7vh">
    <el-container style="height: 7vh">
      <el-header id="header">
        <div class="title">
          面试管理大神
        </div>
        <router-link to="/home" active-class="active" class="pageTitle questionLib" >
          题库
        </router-link>
        <router-link to="/tag" active-class="active" class="pageTitle tagLib">
          标签库
        </router-link>
        <el-button type="text" class="editPassword" @click="editPwd">
          修改密码
        </el-button>
        <el-button type="text" class="exit" @click="logout">
          退出登录
        </el-button>
      </el-header>
    </el-container>
    <el-dialog title="修改密码" v-model="editPwdShow">
      <el-form ref="form" :model="form" :rules="rules" label-width="10vw">
        <el-form-item label="请输入旧密码" prop="oldPwd">
          <el-input
              type="password"
              v-model="form.oldPwd"
              placeholder="请输入旧密码"
              autocomplete="off"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="请输入新密码" prop="newPwd">
        <el-input
            type="password"
            v-model="form.newPwd"
            placeholder="请输入新密码"
            autocomplete="off"
        ></el-input>
      </el-form-item>
        <el-form-item label="请再次输入新密码" prop="newPwd2">
          <el-input
              type="password"
              v-model="form.newPwd2"
              placeholder="保证两次密码一样"
              autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
              type="primary"
              @click="submit(form)"
              style="background-color:rgba(90,148,148,0.99);color:white;"
          >
            提交
          </el-button>
        </el-form-item>
      </el-form>
  </el-dialog>
  </div>
</template>

<script>
import router from '@/router/index.js';
export default {
  name: "head",
  data(){
    var validateOldPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入旧密码'));
      }
      else {

        //向后端发送数据，确认密码正确
        callback();
        }
    };
    var validateNewPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      }
      else if(value.length > 18 || value.length < 6){
        callback(new Error('密码长度应该为6-18位'));
      }
      else {
        callback();
      }
    };
    var checkPwd = (rule, value, callback) =>{
      if (value === '') {
        callback(new Error('请输入密码'));
      }
      else if(value !== this.form.newPwd){
        callback(new Error('两次密码不一致'));
      }
      else {
        callback();
      }
    }
    return {
      editPwdShow: false,
      showOldPassword: false,
      showNewPassword: false,
      showNewPassword2: false,
      form: {
        oldPwd: "",
        newPwd: "",
        newPwd2: ""
      },
      userId:localStorage.getItem('token'),
      rules: {
        oldPwd: [{required: true, validator: validateOldPwd, trigger: 'blur'}],
        newPwd: [{required:true, validator:validateNewPwd, trigger:'blur'}],
        newPwd2: [{required:true, validator:checkPwd, trigger:'blur'}]
      }
    }
  },
  methods:{
    logout(){
      localStorage.removeItem("token");
      router.push('/');
    },
    editPwd(){
      this.editPwdShow = true;
    },
    submit(){
      console.log("提交用户token: "+localStorage.getItem('token') + '\n' + "提交表单form数据: "+ this.form)
      this.$refs.form.validate(valid => {
        if(valid){
          this.$axios.post("http://localhost:8080/changePassword",{
            newPassword:this.form.newPwd,
            password:this.form.oldPwd,
            uid:parseInt(this.userId)
          }).then((response) => {
            console.log(response.data)
            if(response.data.code === 200){
              this.$message.success("成功修改密码！")
              this.editPwdShow = false
            }
            else{
              this.$message.error("修改失败QAQ")
            }
          })
        }
      })
      this.editPwdShow = false;
    }
  }
}
</script>

<style scoped>
#header{
  background-color: white;
  border-bottom: 1px solid #dddddd;
  height: 7vh;
  top: 0;
  width: 100%;
  position: fixed;
  display: flex;
}
.title{
  font-size: 2vw;
  font-family: "华文琥珀";
  color: #6a99f1;
  top: 1.5vh;
  left: 2vw;
  position: fixed;
}
.pageTitle{
  font-family: "华文黑体";
  color: black;
  height: 4.2vh;
  font-size: 2.5vh;
  position: fixed;
  top: 2vh;
  text-decoration: none;
}
.active{
  text-decoration: none;
  color: #6a99f1;
  border-bottom: 2px solid #be4b4f;
}
.pageTitle:hover{
  color: #6a99f1;
}
.questionLib{
  left:18vw;
}
.tagLib{
  left:24vw;
}
.editPassword{
  font-family: "华文黑体";
  color: #6a99f1;
  height: 4.2vh;
  font-size: 2.5vh;
  position: fixed;
  top: 2vh;
  text-decoration: none;
  right:110px;
}

.exit{
  right:20px;
  font-family: "华文黑体";
  color: #6a99f1;
  height: 4.2vh;
  font-size: 2.5vh;
  position: fixed;
  top: 2vh;
  text-decoration: none;
}
</style>