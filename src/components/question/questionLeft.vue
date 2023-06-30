<template>
  <div style="width: 41.5vw">
    <el-container style="margin-top:0.5vh;height: auto;position:relative;border-bottom: 1px solid #ddd">
      <el-header id="header" style="top:-5vh;display: flex;height: auto;width:100%">
        <div class="title">
          {{questionInfoForm.pid}}. {{questionInfoForm.title}}
        </div>
        <el-button type="primary" @click="editQuestion" class="editBtn">编辑</el-button>
        <el-checkbox v-model="questionInfoForm.finish" style="position:relative;top:-1.5vh;left:8vw" @change="changeFinish">完成</el-checkbox>
      </el-header>
      <div class="subDescribe">
        掌握程度：<el-rate v-model="questionInfoForm.exp" disabled style="height:auto;font-size: 6vw"></el-rate>
      </div><div class="subDescribe">
      <div>
        创建时间:{{questionInfoForm.addTime}}
      </div>
      <div v-if="questionInfoForm.level >= 0" style="margin-left: 1.7vw">
        难度: <el-tag :style="activation(questionInfoForm.levelName)" class="levelDescribe">{{questionInfoForm.levelName ? questionInfoForm.levelName : "未知"}}</el-tag>
      </div>
    </div>
      <div class="subDescribe">
        <div class="companyDescribe">
          公司: <span style="color: #6187fa">{{questionInfoForm.cid ? questionInfoForm.cid : "未知"}} </span>
        </div>
        <div class="departmentDescribe fromDescribe">
          部门: <span style="color: #6187FAFF">{{questionInfoForm.did ? questionInfoForm.did : "未知"}} </span>
        </div>
        <div class="departmentDescribe fromDescribe">
          岗位: <span style="color: #6187FAFF">{{questionInfoForm.posID ? questionInfoForm.posID : "未知"}}</span>
        </div>
      </div>
    </el-container>
    <el-container style="top:1vh;position:relative;width:auto;border-bottom: 1px solid #ddd;overflow:auto">
      <div  class="describeContainer">
        <el-input disabled type="textarea" style="margin-left: 0.2vw;background-color:transparent;width:40.5vw" resize="none" :autosize="{ minRows: 20, maxRows: 20}" v-model="questionInfoForm.description"></el-input>
      </div>
    </el-container>
    <div style="width: 41.5vw">
      <span style="top:1.5vh;position: relative;left:-17.7vw;">相关标签:</span>
    </div>
    <div style="width:30vw;">
      <el-row style=" display: flex; margin-top: 2vh;margin-left: 1vw">
        <el-tag class="relationTag" v-if="questionInfoForm.typeName" style="background-color: rgba(97,135,250,0.7);color:white">{{questionInfoForm.typeName}}</el-tag>
        <el-tag class="relationTag" v-if="questionInfoForm.levelName" :style="activation(questionInfoForm.levelName)" style="color:white">{{questionInfoForm.levelName}}</el-tag>
        <el-tag class="relationTag" v-if="questionInfoForm.cateID" style="background-color: coral;color:white">{{questionInfoForm.cateID}}</el-tag>
        <el-tag class="relationTag" v-if="questionInfoForm.editTime" style="background-color: rgba(34,139,34,0.68);color:white">{{questionInfoForm.editTime}}</el-tag>
        <el-tag class="relationTag" v-if="questionInfoForm.isfinish" style="background-color: rgba(218,165,32,0.77);color:white">{{questionInfoForm.isfinish}}</el-tag>
        <el-tag class="relationTag" v-if="questionInfoForm.cid" style="background-color: rgba(142,30,224,0.73);color:white">{{questionInfoForm.cid}}</el-tag>
        <el-tag class="relationTag" v-if="questionInfoForm.did" style="background-color: rgba(16,100,232,0.75);color:white">{{questionInfoForm.did}}</el-tag>
        <el-tag class="relationTag" v-if="questionInfoForm.posID" style="background-color: rgba(7,133,91,0.8);color:white">{{questionInfoForm.posID}}</el-tag>
      </el-row>
    </div>
  </div>
  <el-dialog title="编辑题目信息" v-model="this.editShow" style="height:80vh;overflow:scroll">
    <el-form ref="editForm" :model="questionEditForm" :rules="rules" label-width="10vw">
      <el-form-item label="题目名称" prop="title">
        <el-input v-model="questionEditForm.title"></el-input>
      </el-form-item>
      <el-form-item label="题目描述" prop="description">
        <el-input type="textarea" v-model="questionEditForm.description" resize="none" :autosize="{ minRows: 15, maxRows: 15 }"
        style="white-space: pre-line; height:40vh;text-align: left;"></el-input>
      </el-form-item>
      <el-form-item label="掌握程度" prop="exp" min-width="18%">
          <el-rate v-model="questionEditForm.exp" style="font-size: 6vw"></el-rate>
      </el-form-item>
      <el-form-item label="题目类型" prop="typeName">
        <el-select v-model="questionEditForm.typeName" filterable clearable>
          <el-option v-for="item in typeList"  :key="item.id" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="题目难度" prop="levelName">
        <el-select v-model="questionEditForm.levelName" filterable clearable>
          <el-option v-for="item in levelList"  :key="item.id" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="题目类别" prop="cateID">
        <el-select v-model="questionEditForm.cateID" filterable clearable>
          <el-option v-for="item in categoryList"  :key="item.cateID" :value="item.cateName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="公司" prop="cid">
        <el-select v-model="questionEditForm.cid" @change="SelectCompany" filterable
                   :clearable="this.questionEditForm.did === ''">
          <el-option v-for="item in companyList"  :key="item.cid" :value="item.cname"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门" prop="did">
        <el-select v-if="this.isCompanySelected" v-model="questionEditForm.did" filterable clearable>
          <el-option v-for="item in departmentList"  :key="item.did" :value="item.dname"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="适应岗位" prop="posID">
        <el-select v-model="questionEditForm.posID" filterable clearable>
          <el-option v-for="item in positionList"  :key="item.posID" :value="item.posName"></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="submitEdit" style="left: -4vw;height:auto; position:relative">提交</el-button>
    </el-form>
  </el-dialog>
</template>

<script>
import emitter from "../../utils/mittter"
export default {
  name: "questionLeft",
  data(){
    return{
      isSuccess:true,
      isCompanySelected:true,
      editShow:false,
      userToken:localStorage.getItem("token"),
      dialogShow:false,
      questionId:localStorage.getItem("questionId"),
      questionEditForm:{},
      questionInfoForm:{},
      typeList:[{
        id:0,
        name:"算法题"
      },{
        id: 1,
        name: "文字题"
      }],
      levelList:[{
        id:0,
        name:"简单"
      },{
        id:1,
        name:"中等"
      },{
        id:2,
        name: "困难"
      }],
      categoryList:[],
      editTimeList:[{
        id:0,
        name:"近一周"
      },{
        id:1,
        name: "近一个月"
      },{
        id:2,
        name:"近半年"
      }],
      finishList:[{
        id:0,
        name:"未完成"
      },{
        id:1,
        name: "已完成"
      }],
      companyList:[],
      departmentList:[],
      positionList:[],
      rules:{
          title:[{required:true,message:"标题不能为空",trigger:'blur'}],
          description:[{required:true,message:"题目描述不能为空",trigger:'blur'}]
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
        else{
          return {'background-color':'#777777'}
        }
    },
    editQuestion(){
      this.editShow = true;
      this.questionEditForm=JSON.parse(JSON.stringify(this.questionInfoForm));
      console.log(this.questionEditForm);
    },
    SelectCompany(value){
      console.log(value);
      if(value !== ""){
        this.isCompanySelected = true;
      //想后端获取部门列表
      let companyID = null;
      this.companyList.map((item) => {
        if(this.questionEditForm.cid === item.cname){
          companyID = item.cid;
        }
      })
      this.$axios.get("http://localhost:8080/findDepartments/"+ companyID).then((response) =>{
        console.log(response.data);
        if(response.data.code === 200){
          this.departmentList = response.data.data
        }
        else{
          this.$message.error("获取部门列表失败！")
        }
      })
    }},
    updateTag(propertyName,newValue){
      console.log("修改属性："+ propertyName + " 赋值：" + newValue)
      if(newValue === null){
        console.log("为空了")
        this.$axios.put("http://localhost:8080/setTagPropertyNull",{
          pid:localStorage.getItem('pid'),
          property:propertyName
        }).then((response) =>{
          if(response.data.code === 200){
            console.log("清空"+propertyName+"成功")
            this.questionInfoForm = JSON.parse(JSON.stringify(this.questionEditForm));
            this.editShow = false;
            emitter.emit('changeProblem', this.questionInfoForm)
          }
          else{
            console.log("修改失败")
            this.$message.error(propertyName+"修改失败")
          }
        })
      }
      else{
        this.$axios.post("http://localhost:8080/updateTag",{
          newValue:newValue,
          pid:localStorage.getItem("pid"),
          propertyName:propertyName
        }).then((response) =>{
          console.log(response.data)
          if(response.data.code === 200){
            console.log("成功修改标签"+propertyName)
            this.questionInfoForm = JSON.parse(JSON.stringify(this.questionEditForm));
            this.editShow = false;
            emitter.emit('changeProblem', this.questionInfoForm)
          }
          else{
            this.$message.error("修改"+propertyName+"失败！")
            this.isSuccess = false;
          }
        })

      }

    },
    changeFinish(){
      console.log( "valuie" +this.questionInfoForm.finish)
      this.$axios.post("http://localhost:8080/updateTag",{
        newValue:this.questionInfoForm.finish,
        pid:localStorage.getItem("pid"),
        propertyName:"finish"
      }).then((response) =>{
        if(response.data.code === 200){
          console.log("成功修改完成情况")
          if(this.questionInfoForm.finish){
            this.questionInfoForm.isfinish = "已完成"
          }
          else{
            this.questionInfoForm.isfinish = "未完成"
          }
          console.log(response.data)
          emitter.emit('changeProblem', this.questionInfoForm)
        }
        else{
          this.$message.error("修改完成情况失败！")
          this.isSuccess = false;
        }
      })
    },
    submitEdit(){
      //向后端传数据更改
      this.$refs.editForm.validate(valid =>{
        if(valid) {
          console.log("传给后端 " + this.questionEditForm)
          if (this.questionEditForm.title !== this.questionInfoForm.title) {
            this.$axios.post("http://localhost:8080/updateTitle",
                {pid: parseInt(localStorage.getItem('pid')), title: this.questionEditForm.title}).then((response) => {
              console.log(response.data)
              if (response.data.code === 200) {
                console.log("成功修改标题")
                this.questionInfoForm = JSON.parse(JSON.stringify(this.questionEditForm));
                emitter.emit('changeProblem', this.questionInfoForm)
                this.editShow = false
              } else {
                this.$message.error("标题修改失败！")
                this.isSuccess = false;
              }
            })
          } else {
            console.log(this.questionEditForm.title !== this.questionInfoForm.title)
          }
          if (this.questionEditForm.description !== this.questionInfoForm.description) {
            this.$axios.post("http://localhost:8080/updateDescription",
                {
                  pid: parseInt(localStorage.getItem('pid')),
                  description: this.questionEditForm.description
                }).then((response) => {
              console.log(response.data)
              if (response.data.code === 200) {
                console.log("成功修改描述")
                this.questionInfoForm = JSON.parse(JSON.stringify(this.questionEditForm));
                emitter.emit('changeProblem', this.questionInfoForm)
              } else {
                this.$message.error("描述修改失败！")
                this.isSuccess = false;
              }
            })
          }

          let myCateId = null;
          let myDid = null;
          let myPosId = null;
          let myLevelId = null;
          let myTypeId = null;
          let myCompanyId = null;

          this.categoryList.map((item) => {
            if (item.cateName === this.questionEditForm.cateID) {
              myCateId = item.cateID;
            }
          })
          this.departmentList.map((item) => {
            if (item.dname === this.questionEditForm.did) {
              myDid = item.did;
            }
          })
          this.positionList.map((item) => {
            if (item.posName === this.questionEditForm.posID) {
              myPosId = item.posID;
            }
          })
          this.levelList.map((item) => {
            if (item.name === this.questionEditForm.levelName) {
              myLevelId = item.id;
            }
          })
          this.typeList.map((item) => {
            if (item.name === this.questionEditForm.typeName) {
              myTypeId = item.id;
            }
          })
          this.companyList.map((item) => {
            if (item.cname === this.questionEditForm.cid) {
              myCompanyId = item.cid;
            }
          })
          if (this.questionEditForm.exp !== this.questionInfoForm.exp) {
            this.updateTag("exp", this.questionEditForm.exp)
          }
          if (this.questionEditForm.typeName !== this.questionInfoForm.typeName) {
            this.updateTag("type", myTypeId)
          }
          if (this.questionEditForm.levelName !== this.questionInfoForm.levelName) {
            this.updateTag("level", myLevelId)
          }
          if (this.questionEditForm.cateID !== this.questionInfoForm.cateID) {
            this.updateTag("cateID", myCateId)
          }
          if (this.questionEditForm.cid !== this.questionInfoForm.cid) {
            this.updateTag("cid", myCompanyId)
          }
          if (this.questionEditForm.did !== this.questionInfoForm.did) {
            this.updateTag("did", myDid)
          }
          if (this.questionEditForm.posID !== this.questionInfoForm.posID) {
            this.updateTag("posID", myPosId)
          }
        }
        else{
          this.$message.error("请填写题目标题及描述")
        }
      })
      if(this.isSuccess){
        this.$message.success("修改成功")
      }
      else{
        this.$message.error("修改失败")
      }
      this.isSuccess = true;
      this.editShow=false;
  }},
  created() {
    emitter.on('changeData',(response) =>{
      console.log(response)
      this.questionInfoForm = response
    })
    this.$axios.get("http://localhost:8080/findProblem/"+ localStorage.getItem("pid")).then(
        (response)=>{
          console.log(response.data)
          if(response.data.code === 200){
            console.log("成功获取题目信息")
            this.questionInfoForm = response.data.data
            if (this.questionInfoForm.type === 1) {
              this.questionInfoForm.typeName = "文字题"
            } else {
              this.questionInfoForm.typeName = "算法题"
            }
            if (this.questionInfoForm.level === 0) {
              this.questionInfoForm.levelName = "简单"
            } else if (this.questionInfoForm.level === 1) {
              this.questionInfoForm.levelName = "中等"
            } else {
              this.questionInfoForm.levelName = "困难"
            }
            if (this.questionInfoForm.finish) {
              this.questionInfoForm.isfinish = "已完成"
            } else {
              this.questionInfoForm.isfinish = "未完成"
            }
          }
          else{
            this.$message.error("获取题目信息失败！")
          }
        })
    //获取标签列表
    //获取类别
    this.$axios.get("http://localhost:8080/findCategories/" + localStorage.getItem('token')
    ).then((response) => {
      console.log(response.data)
      if (response.data.code === 200) {
        this.categoryList = response.data.data
      } else {
        this.$message.error("获取类别列表失败！")
      }
    })
    //获取岗位列表
    this.$axios.get("http://localhost:8080/findPositions/" + localStorage.getItem('token')
    ).then((response) => {
      console.log(response.data)
      if (response.data.code === 200) {
        this.positionList = response.data.data
      } else {
        this.$message.error("获取岗位列表失败！")
      }
    })
    //获取公司列表
    this.$axios.get("http://localhost:8080/findCompanies/" + localStorage.getItem('token')
    ).then((response) => {
      console.log(response.data)
      if (response.data.code === 200) {
        this.companyList = response.data.data
      } else {
        this.$message.error("获取公司列表失败！")
      }
    })
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
  left: 4vw;
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
  display: flex;
}
</style>