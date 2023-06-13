<template>
  <div style="width: 41.5vw">
    <el-container style="margin-top:1.5vh;height: auto;position:relative;border-bottom: 1px solid #ddd;">
      <el-header id="header" style="display: flex;height: auto;width: 41.5vw">
        <div class="title">
          {{questionInfoForm.id}}. {{questionInfoForm.name}}
        </div>
        <el-button type="primary" @click="editQuestion" class="editBtn">编辑</el-button>
      </el-header>
      <div class="subDescribe">
        难度:<el-tag :style="activation(questionInfoForm.level)" class="levelDescribe">{{questionInfoForm.level}}</el-tag>
      </div>
      <div class="subDescribe">
        <div style="font-style: italic">
          来源：
        </div>
        <div class="companyDescribe">
          公司: <span style="color: #6187fa">{{questionInfoForm.company ? questionInfoForm.company : "未知"}} </span>
        </div>
        <div class="departmentDescribe fromDescribe">
          部门: <span style="color: #6187FAFF">{{questionInfoForm.department ? questionInfoForm.department : "未知"}} </span>
        </div>
        <div class="departmentDescribe fromDescribe">
          岗位: <span style="color: #6187FAFF">{{questionInfoForm.position ? questionInfoForm.position : "未知"}}</span>
        </div>
      </div>
    </el-container>
    <el-container style="top:1vh;position:relative;width:41.5vw; height: auto;border-bottom: 1px solid #ddd;">
      <div  class="describeContainer">
        <p style="margin: 0.5vw">{{questionInfoForm.describe}} </p>
      </div>
    </el-container>
    <div style="width: 41.5vw">
      <span style="left:1vw; border-bottom: 1px solid #ccc">相关标签</span>
    </div>
    <el-container style="width:30vw; display: flex; margin-top: 2vh;margin-left: 1vw">
      <el-tag class="relationTag" v-if="questionInfoForm.type !== ''" style="background-color: rgba(97,135,250,0.7);color:white">{{questionInfoForm.type}}</el-tag>
      <el-tag class="relationTag" v-if="questionInfoForm.level !== ''" :style="activation(questionInfoForm.level)" style="color:white">{{questionInfoForm.level}}</el-tag>
      <el-tag class="relationTag" v-if="questionInfoForm.category !== ''" style="background-color: coral;color:white">{{questionInfoForm.category}}</el-tag>
      <el-tag class="relationTag" v-if="questionInfoForm.editTime !== ''" style="background-color: rgba(34,139,34,0.68);color:white">{{questionInfoForm.editTime}}</el-tag>
      <el-tag class="relationTag" v-if="questionInfoForm.finish !== ''" style="background-color: rgba(218,165,32,0.77);color:white">{{questionInfoForm.finish}}</el-tag>
      <el-tag class="relationTag" v-if="questionInfoForm.company !== ''" style="background-color: rgba(142,30,224,0.73);color:white">{{questionInfoForm.company}}</el-tag>
      <el-tag class="relationTag" v-if="questionInfoForm.department !== ''" style="background-color: rgba(16,100,232,0.75);color:white">{{questionInfoForm.department}}</el-tag>
      <el-tag class="relationTag" v-if="questionInfoForm.position !== ''" style="background-color: rgba(7,133,91,0.8);color:white">{{questionInfoForm.position}}</el-tag>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "questionLeft",
  data(){
    return{
      userToken:localStorage.getItem("token"),
      dialogShow:false,
      questionId:localStorage.getItem("questionId"),
      questionInfoForm:{
        id:0,
        name:"B+树查询",
        type:"算法题",
        level:"困难",
        category:"B+树",
        editTime:"近一周",
        finish:"已完成",
        company:"字节跳动",
        department:"视频组",
        position:"后端",
        exp:3,
        describe:"给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度。\n" +
            "\n" +
            " \n" +
            "\n" +
            "示例 1:\n" +
            "\n" +
            "输入: s = \"abcabcbb\"\n" +
            "输出: 3 \n" +
            "解释: 因为无重复字符的最长子串是 \"abc\"，所以其长度为 3。\n" +
            "示例 2:\n" +
            "\n" +
            "输入: s = \"bbbbb\"\n" +
            "输出: 1\n" +
            "解释: 因为无重复字符的最长子串是 \"b\"，所以其长度为 1。\n" +
            "示例 3:\n" +
            "\n" +
            "输入: s = \"pwwkew\"\n" +
            "输出: 3\n" +
            "解释: 因为无重复字符的最长子串是 \"wke\"，所以其长度为 3。\n" +
            "     请注意，你的答案必须是 子串 的长度，\"pwke\" 是一个子序列，不是子串。\n" +
            " \n" +
            "\n" +
            "提示：\n" +
            "\n" +
            "0 <= s.length <= 5 * 104\n" +
            "s 由英文字母、数字、符号和空格组成\n",
        code:"",
        note:"",
        addTime:""
      }

    }
  },
  methods:{
    activation(level) {
        console.log(level)

        if (level === "简单"){
          return {'background-color':'green'}
        }
        else if (level === "中等"){
          return {'background-color':'#FC9603B2'}
        }
        else if (level === "困难"){
          return {'background-color':'rgba(253,44,44,0.62)'}
        }

    },
    editQuestion(){

    }
  }
}
</script>

<style scoped>
.title{
  top: -2vh;
  position: relative;
  font-family: 华文黑体;
  font-size: 3vh;
  color: #666666;
}
.editBtn{
  background-color: transparent;
  color: #6990b7;
  font-family: "华文黑体";
  height: 3.5vh;
  width: 4.5vw;
  border: 1px solid #6a99f1;
  left: 2vw;
  top: -1.5vh;
  position: relative;
}
.subDescribe{
  font-family: 华文黑体;
  font-size: 1.8vh;
  color: #888888;
  display: flex;
  left: 3vw;
  position: relative;
}
.levelDescribe{
  margin-top: 0.4vh;
  margin-left: 1vw;
  margin-bottom: 0.4vh;
  font-size: 1vh;
  width: 3vw;
  height: 2vh;
  color: white;
  border: transparent;
}
.fromDescribe{
  margin-left: 2vw;
  margin-bottom: 1vh;
}
.describeContainer{
  margin-top:1vh;
  margin-left: 0.4vw;
  width:95%;
  height: auto;
  margin-bottom: 2vh;
  background-color: #cccccc44;
  font-family: 华文黑体;
  border-bottom: 1px solid #ddd;
  white-space: pre-line;
  text-align: left;
}
.relationTag{
  width: auto;
  height: 3vh;
  font-size: 2vh;
  margin: 0.3vw;
}
</style>