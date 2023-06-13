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
      </el-header>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "head",
  data(){
    return{
      userInfo:{
        username:"yss",
        password:"123456"
      }
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
</style>