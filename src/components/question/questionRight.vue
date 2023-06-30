<template>
  <div>
    <el-container>
      <el-header style="display:flex;top:0;position: relative">
        <el-button v-if="questionInfoForm.typeName ==='算法题'" @click="showCode" :style="activate(true)" class="rightHead">
          代码
        </el-button>
        <el-button @click="showNote" :style="activate(false)" style="margin-left: 1.1vw" class="rightHead">
          笔记
        </el-button>
      </el-header>
      <el-form ref="questionInfoForm" :model="questionInfoForm" label-width="80px">
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
import emitter from "@/utils/mittter";

export default {
  name: "questionRight",
  data(){
    return{
      isCode: true,
      questionId:localStorage.getItem("questionId"),
      content:"",
      questionInfoForm:{
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
        this.$axios.post("http://localhost:8080/updateCode",
            {
              code:this.content,
              pid:parseInt(this.questionInfoForm.pid)
            }).then((response) => {
          if(response.data.code === 200){
            this.$message.success("代码修改成功！")
            this.questionInfoForm.code = this.content
            emitter.emit("changeData",this.questionInfoForm)
          }
          else{
            console.log(response.data)
            this.$message.error("代码修改失败QAQ")
          }
        })
      }
      else{
        //提交更改后的note
        console.log("提交note" + this.content)
        this.$axios.post("http://localhost:8080/updateNote",
            {
              note:this.content,
              pid:parseInt(this.questionInfoForm.pid)
            }).then((response) => {
              if(response.data.code === 200){
                this.$message.success("笔记修改成功！")
                this.questionInfoForm.note = this.content
                emitter.emit("changeData",this.questionInfoForm)
              }
              else{
                console.log(response.data)
                this.$message.error("笔记修改失败QAQ")
              }
        })
      }
    }
  },
  created() {
    emitter.on('changeProblem',(res) =>{
      console.log(res)
      this.questionInfoForm = res
    })
    this.$axios.get("http://localhost:8080/findProblem/"+ localStorage.getItem("pid")).then(
        (response)=>{
          console.log(response.data)
          if(response.data.code === 200){
            console.log("成功获取题目信息")
            this.questionInfoForm = response.data.data
            if(this.questionInfoForm.type === 1){
              this.questionInfoForm.typeName = "文字题"
            }else{
              this.questionInfoForm.typeName = "算法题"
            }
            if(this.questionInfoForm.level === 0){
              this.questionInfoForm.levelName = "简单"
            }
            else if (this.questionInfoForm.level === 1){
              this.questionInfoForm.levelName = "中等"
            }
            else {
              this.questionInfoForm.levelName = "困难"
            }
            if(this.questionInfoForm.finish){
              this.questionInfoForm.isfinish = "已完成"
            }
            else{
              this.questionInfoForm.isfinish = "未完成"
            }
          }
        }
    )
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