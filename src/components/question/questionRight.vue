<template>
  <div>
    <el-container>
      <el-header style="display:flex;top:0;position: relative">
        <el-button v-if="questionInfoForm.type ==='算法题'" @click="showCode" :style="activate(true)" class="rightHead">
          代码
        </el-button>
        <el-button @click="showNote" :style="activate(false)" style="margin-left: 1.1vw" class="rightHead">
          笔记
        </el-button>
      </el-header>
      <el-form ref="questionInfoForm" :model="questionInfoForm" :rules="questionInfoRule" label-width="80px">
        <el-form-item class="codeOrNoteContainer">
          <el-input type="textarea" class="dataShow" resize="none" :autosize="{ minRows: 26, maxRows: 26 }"
                    v-model="content"></el-input>
          <el-button type="primary" class="btn" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>

    </el-container>
  </div>
</template>

<script>
export default {
  name: "questionRight",
  data(){
    return{
      isCode: true,
      questionId:localStorage.getItem("questionId"),
      content:"",
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
        code:"class Solution {\n" +
            "public:\n" +
            "    int lengthOfLongestSubstring(string s) {\n" +
            "\n" +
            "    }\n" +
            "};",
        note:"作为一名软件工程专业的学生，找工作前的大量刷题是我们获得满意offer的必经之\n" +
            "路。正所谓“工欲善其事，必先利其器”，我们需要一个系统对题目进行整理和汇总，\n" +
            "从而帮助我们复习编程知识点，提高编码熟练度。\n" +
            "现请你采用关系型数据库实现一个面试题目管理网站，该网站中的试题主要包含两种\n" +
            "类型，分别是算法题和文字题，这些题目都包含了丰富的标签（Tag），该网站提供\n" +
            "对题目的增、删、改、查等功能。\n",
        addTime:""
      },
      questionInfoRule:{

      }
    }
  },
  methods:{
    showCode(){
      this.isCode = true;
      console.log("点击代码，iscode变成"+ this.isCode);
      this.$forceUpdate();

    },
    showNote(){
      this.isCode = false;
      console.log("点击笔记，iscode变成"+ this.isCode);
      this.$forceUpdate();
    },
    activate(flag){
      if(flag){
        if(this.isCode){
          this.content = this.questionInfoForm.code;
          return {'border': '0.3vh solid #6a99f1'};

        }
      }
      else{
        if(!this.isCode){
          this.content = this.questionInfoForm.note;
          return {'border': '0.3vh solid #6a99f1'};
        }
      }
    },
    submit(){
      if(this.isCode)
      {
        //提交更改后的code
        console.log("提交code" + this.content)
      }
      else{
        //提交更改后的note
        console.log("提交note" + this.content)
      }
    }
  },
  created() {
   if(this.questionInfoForm.type === "算法题") {
     this.content = this.questionInfoForm.code;
     this.isCode = true;
   }
   else {
     this.content = this.questionInfoForm.note;
     this.isCode = false;
   }
  }
}
</script>

<style scoped>
.rightHead{
  font-family: 华文黑体;
  width: 4.5vw;
  height: 4vh;
  font-size: 1.3vw;
  color: #666666;
  border-radius: 2vh;
  background-color: transparent;
  border: 0.3vh solid #dddddd;
}
.codeOrNoteContainer{
  margin-top:1vh;
  margin-left: 1vw;
  width: 95%;
  height: auto;
  margin-bottom: 2vh;
  background-color: #cccccc44;
  font-family: 华文黑体;
  border-bottom: 1px solid #ddd;
  white-space: pre-line;
  text-align: left;
}
.el-input__inner{
  background:transparent;
}
.dataShow{
  right: 2.7vw;
  margin-top:1vh;
}
.btn{
  background-color: white;
  color: #2c3e50;
  border: 0.1vw solid #6a99f1;
  margin-top: 1vh;
  margin-bottom: 1.5vh;
  left:40vw;
  position: relative;
}
</style>