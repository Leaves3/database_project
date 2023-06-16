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
        <div>
          创建时间:{{questionInfoForm.addTime}}
        </div>
        <div style="margin-left: 1.7vw">
          难度: <el-tag :style="activation(questionInfoForm.level)" class="levelDescribe">{{questionInfoForm.level}}</el-tag>
        </div>
      </div>
      <div class="subDescribe">
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
  <el-dialog title="编辑题目信息" v-model="this.editShow" :before-close="beforeClose" style="height:80vh;overflow:scroll">
    <el-form ref="editForm" :model="questionEditForm" :rules="rules" label-width="10vw">
      <el-form-item label="题目名称" prop="name">
        <el-input v-model="questionEditForm.name"></el-input>
      </el-form-item>
      <el-form-item label="题目描述" prop="describe">
        <el-input type="textarea" v-model="questionEditForm.describe" resize="none" :autosize="{ minRows: 15, maxRows: 15 }"
        style="white-space: pre-line; height:40vh;text-align: left;"></el-input>
      </el-form-item>
      <el-form-item label="题目类型" prop="type">
        <el-select v-model="questionEditForm.type">
          <el-option v-for="item in typeList"  :key="item.id" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="题目难度" prop="level">
        <el-select v-model="questionEditForm.level">
          <el-option v-for="item in levelList"  :key="item.id" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="题目类别" prop="category">
        <el-select v-model="questionEditForm.category">
          <el-option v-for="item in categoryList"  :key="item.id" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="公司" prop="company">
        <el-select v-model="questionEditForm.company" @change="SelectCompany">
          <el-option v-for="item in companyList"  :key="item.id" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门" prop="department">
        <el-select v-if="this.isCompanySelected" v-model="questionEditForm.department">
          <el-option v-for="item in departmentList"  :key="item.id" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="适应岗位" prop="position">
        <el-select v-model="questionEditForm.position">
          <el-option v-for="item in positionList"  :key="item.id" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="submitEdit" style="left: -4vw;height:auto; position:relative">提交</el-button>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: "questionLeft",
  data(){
    return{
      isCompanySelected:true,
      editShow:false,
      userToken:localStorage.getItem("token"),
      dialogShow:false,
      questionId:localStorage.getItem("questionId"),
      questionEditForm:{},
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
        addTime:"2023-06-17 06:33"
      },
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
      categoryList:[{
        id:0,
        name:"数组"
      },
        {
          id:1,
          name:"排序"
        },{
          id:2,
          name:"操作系统"
        }],
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
        name:"已完成"
      },{
        id:1,
        name: "未完成"
      }],
      companyList:[{
        id:0,
        name:"普华永道"
      },{
        id:1,
        name:"字节跳动"
      },{
        id:2,
        name: "阿里巴巴"
      },{
        id:3,
        name: "腾讯"
      }],
      departmentList:[{
        id:0,
        name:"视频组"
      },{
        id:1,
        name: "项目组"
      },{
        id:2,
        name: "游戏组"
      }],
      positionList:[{
        id:0,
        name:"前端"
      },{
        id:1,
        name:"后端"
      }],
      rules:{
          name:[{required:true}],
          describe:[{required:true}],
          type:[{required:true}]
      }
    }
  },
  methods:{
    beforeClose(done){
      this.$confirm('您取消了修改密码，是否继续？', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认取消',
        cancelButtonText: '放弃取消'
      })
          .then(() => {
            this.$refs.form.resetFields(); // 重置表单
            done()
          })
          .catch(()=>{
            done(false)
          })
    },
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
      this.editShow = true;
      this.questionEditForm=this.questionInfoForm;
      console.log(this.questionEditForm);
    },
    SelectCompany(value){
      console.log(value);
      if(value != ""){
        this.isCompanySelected = true;
      }
      //想后端获取部门列表
    },
    submitEdit(){
      //向后端传数据更改
      console.log("传给后端 "+ this.questionEditForm)
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