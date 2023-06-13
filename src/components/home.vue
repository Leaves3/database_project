<template>
  <div>
    <div style="height: 4vh">
    <Head></Head>
    </div>
    <div ref="scrollDiv">
      <div>
        <el-row style="display: flex">
          <el-col :span="8" style=" margin-left:7vw;margin-bottom:10px;width: 10vw; height:6.5vh;">
            <el-input
                type="text"
                prefix-icon="el-icon-search"
                v-model="kb_content"
                placeholder="请输入关键字"
                style="width:20vw; cursor: pointer"
                @keyup.enter="getAllKb"
            >
              <template #suffix>
                <el-icon @click="getAllKb">
                  <Search />
                </el-icon>
              </template>
            </el-input>
            <el-select v-model="isName" placeholder="题目" style="margin-left: 1vw;width:8vw">
              <el-option label="编号" value=false></el-option>
              <el-option label="题目" value=true></el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
      <div style="width: 85vw;left: 7vw;position: fixed">
        <el-form ref="queryFormData" :model="queryFormData" :rules="queryRules" label-width="80px">
          <el-row>
            <el-form-item label="类型" prop="type">
              <el-select v-model="queryFormData.type" filterable default-first-option allow-create placeholder="选择类型">
                <el-option v-for="item in typeList" :key="item.id" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="难度" prop="level">
              <el-select v-model="queryFormData.level" filterable placeholder="选择难度">
                <el-option v-for="item in levelList" :key="item.id" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="类别" prop="category">
              <el-select v-model="queryFormData.category" filterable placeholder="选择类型">
                <el-option v-for="item in categoryList" :key="item.id" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="最近编辑时间" prop="editTime" label-width="9vw">
              <el-select v-model="queryFormData.editTime" filterable placeholder="选择时间">
                <el-option v-for="item in editTimeList" :key="item.id" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="完成情况" prop="finish" label-width="7vw">
              <el-select v-model="queryFormData.finish" filterable placeholder="选择状态">
                <el-option v-for="item in finishList" :key="item.id" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="公司" prop="company">
              <el-select v-model="queryFormData.company" filterable placeholder="选择公司" @change="SelectCompany">
                <el-option v-for="item in companyList" :key="item.id" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="部门" prop="department" >
              <el-select v-model="queryFormData.department" filterable placeholder="选择部门" :disabled="!isCompanySelected">
                <el-option v-for="item in departmentList" :key="item.id" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="岗位" prop="position">
              <el-select v-model="queryFormData.position" filterable placeholder="选择岗位">
                <el-option v-for="item in positionList" :key="item.id" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="掌握程度" prop="exp" style="left: 1.8vw;position: relative">
              <el-rate v-model="queryFormData.exp"  @change="changeRate"></el-rate>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <div style="top: 35vh;position: fixed;left: 7vw;width:80vw;">
        <el-table :data="questionList.slice((query.page - 1) * query.page_size, query.page * query.page_size)" stripe height="58vh">
          <el-table-column prop="id" label="编号" align="center" min-width="10%"></el-table-column>
          <el-table-column prop="name" label="题目" align="center" min-width="30%"></el-table-column>
          <el-table-column prop="type" label="类型" align="center" min-width="15%"></el-table-column>
          <el-table-column prop="level" label="难度" align="center" min-width="17%"></el-table-column>
          <el-table-column prop="category" label="类别" align="center" min-width="17%"></el-table-column>
          <el-table-column prop="editTime" label="编辑时间" align="center" min-width="17%"></el-table-column>
          <el-table-column prop="finish" label="完成情况" align="center" min-width="17%"></el-table-column>
          <el-table-column label="掌握程度" align="center" min-width="18%">
            <template #default="scope">
              <el-rate v-model="scope.row.exp" disabled style="font-size: 6vw"></el-rate>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="30%">
            <template #default="scope">
              <el-button type="primary" @click="showQuestionDetail(scope.row)">详情</el-button>
              <el-button type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :total="questionList.length"
          :page-size="query.page_size"
          :page-sizes="[5, 10, 20, 50, 100]"
          layout=" total, sizes, prev, pager, next"
          background
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
      ></el-pagination>
      </div>
    </div>
  </div>


</template>

<script>
import router from '@/router/index.js';
export default {
  name: "home",
  data(){
    return{
      query:{
        page:1,
        page_size:10
      },
      kb_content:"",
      isName:"",
      isCompanySelected:false,
      userInfo:localStorage.getItem("token"),
      questionList:[{
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
        describe:"",
        code:"",
        note:"",
        addTime:""
      },{
        id:1,
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
        describe:"",
        code:"",
        note:"",
        addTime:""
      },{
        id:2,
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
        describe:"",
        code:"",
        note:"",
        addTime:""
      },{
        id:3,
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
        describe:"",
        code:"",
        note:"",
        addTime:""
      },{
        id:4,
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
        describe:"",
        code:"",
        note:"",
        addTime:""
      },{
        id:5,
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
        describe:"",
        code:"",
        note:"",
        addTime:""
      },{
        id:6,
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
        describe:"",
        code:"",
        note:"",
        addTime:""
      },{
        id:7,
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
        describe:"",
        code:"",
        note:"",
        addTime:""
      },{
        id:8,
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
        describe:"",
        code:"",
        note:"",
        addTime:""
      },{
        id:9,
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
        describe:"",
        code:"",
        note:"",
        addTime:""
      },{
        id:10,
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
        describe:"",
        code:"",
        note:"",
        addTime:""
      },{
        id:11,
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
        describe:"",
        code:"",
        note:"",
        addTime:""
      },{
        id:12,
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
        describe:"",
        code:"",
        note:"",
        addTime:""
      }],
      queryFormData: {
        type:"",
        level:"",
        category:"",
        editTime:"",
        finish:"",
        company:"",
        department:"",
        position:"",
        exp:""
      },
      queryRules:{

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
      }]
    }
  },
  methods:{
    handleSizeChange(val) {
      this.query.page = 1
      this.query.page_size = val
    },
    handleCurrentChange(val) {
      this.query.page = val
    },
    getAllKb(){
      console.log("传给后端关键字 "+this.kb_content+" 以及搜索方式 " + this.isName)
    },
    changeRate(value) {
      console.log(value);
    },
    SelectCompany(value){
      console.log(value);
      if(value != ""){
        this.isCompanySelected = true;
      }
    },
    setStar(data){
      let arr=[];
      if(data === 0){
        for(let i=1;i<6;i++) {
          arr.push({
            index:i,
            value:'el-icon-star-off',
          });
          if(i+1 === data) return arr;
        }
      }else {
        for(let i=1;i<6;i++) {
          if(i > data) {
            arr.push({
              index:i,
              value:'el-icon-star-off',
              color:'color:rgba(0,0,0,0.15)',
            });
          }else {
            arr.push({
              index:i,
              value:'el-icon-star-on',
              color:'color:rgb(247, 186, 42)',
            });
          }
          if(i+1 === 6) return arr;
        }
      }
    },
    showQuestionDetail(question){
      console.log(question)
      localStorage.setItem("question.id",question.id)
      router.push("/question")
    }
  },
}
</script>

<style scoped>
.el-rate__icon {
  font-size: 10vw;
}
.el-select{
  width: 10vw;
}
.el-pagination{
  position: relative;
  top: 2vh;
  left: 28vw;
}
</style>