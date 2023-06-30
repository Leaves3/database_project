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
          </el-col>
            <el-select v-model="isName" placeholder="题目" style="margin-left: -4.5vw;width:8vw">
              <el-option label="编号" value="编号"></el-option>
              <el-option label="题目" value="题目"></el-option>
            </el-select>
          <div style="margin-left: 0.7vw;">
            <el-select v-model="sortBy" style="width:10vw">
              <el-option label="按编号排序" value="pid"></el-option>
              <el-option label="按难度排序" value="难度"></el-option>
              <el-option label="按添加时间排序" value="添加时间"></el-option>
              <el-option label="按编辑时间排序" value="编辑时间"></el-option>
              <el-option label="按掌握程度排序" value="掌握程度"></el-option>
            </el-select>
          </div>
        </el-row>
      </div>
      <div style="width: 85vw;left: 7vw;position: fixed">
        <el-form ref="queryFormData" :model="queryFormData" :rules="queryRules" label-width="80px">
          <el-row>
            <el-form-item label="类型" prop="type">
              <el-select v-model="queryFormData.type" clearable filterable default-first-option placeholder="选择类型">
                <el-option v-for="item in typeList" :key="item.id" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="难度" prop="level">
              <el-select v-model="queryFormData.level" clearable filterable placeholder="选择难度">
                <el-option v-for="item in levelList" :key="item.id" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="类别" prop="category">
              <el-select v-model="queryFormData.category" clearable filterable placeholder="选择类型">
                <el-option v-for="item in categoryList" :key="item.cateID" :value="item.cateName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="最近编辑时间" prop="editTime" label-width="9vw">
              <el-select v-model="queryFormData.editTime" filterable clearable placeholder="选择时间">
                <el-option v-for="item in editTimeList" :key="item.id" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="完成情况" prop="isfinish" label-width="7vw">
              <el-select v-model="queryFormData.isfinish" filterable clearable placeholder="选择状态">
                <el-option v-for="item in finishList" :key="item.id" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="公司" prop="company">
              <el-select v-model="queryFormData.company" clearable filterable placeholder="选择公司" @change="SelectCompany">
                <el-option v-for="item in companyList" :key="item.cid" :value="item.cname"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="部门" prop="department" >
              <el-select v-model="queryFormData.department" clearable filterable placeholder="选择部门" :disabled="!isCompanySelected">
                <el-option v-for="item in departmentList" :key="item.did" :value="item.dname"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="岗位" prop="position">
              <el-select v-model="queryFormData.position" clearable filterable placeholder="选择岗位">
                <el-option v-for="item in positionList" :key="item.posID" :value="item.posName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="掌握程度" prop="exp" style="left: 1.8vw;position: relative">
              <el-rate v-model="queryFormData.exp"  @change="changeRate"></el-rate>
              <el-button @click="queryFormData.exp = 0" style="width: 0.5vw;height:0.5vw;">×</el-button>
            </el-form-item>
            <el-button type="primary" @click="addQuestion" size="small" class="addBtn">新增+</el-button>
          </el-row>
        </el-form>
      </div>
      <div style="top: 35vh;position: fixed;left: 7vw;width:80vw;">
        <el-table :data="questionList.slice((query.page - 1) * query.page_size, query.page * query.page_size)" stripe height="58vh">
          <el-table-column prop="pid" label="编号" align="center" min-width="10%"></el-table-column>
          <el-table-column prop="title" label="题目" align="center" min-width="30%"></el-table-column>
          <el-table-column prop="typeName" label="类型" align="center" min-width="15%"></el-table-column>
          <el-table-column prop="levelName" label="难度" align="center" min-width="17%"></el-table-column>
          <el-table-column prop="cateID" label="类别" align="center" min-width="17%"></el-table-column>
          <el-table-column prop="editTime" label="编辑时间" align="center" min-width="17%"></el-table-column>
          <el-table-column prop="isfinish" label="完成情况" align="center" min-width="17%"></el-table-column>
          <el-table-column label="掌握程度" align="center" min-width="18%">
            <template #default="scope">
              <el-rate v-model="scope.row.exp" disabled style="font-size: 6vw"></el-rate>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="30%">
            <template #default="scope">
              <el-button type="primary" @click="showQuestionDetail(scope.row)">详情</el-button>
              <el-button type="danger" @click="delQuestion(scope.row)">删除</el-button>
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

  <el-dialog title="新增题目信息" v-model="this.isAddShow" style="height:80vh;overflow:scroll">
    <el-form ref="addForm" :model="addForm" :rules="AddRules" label-width="10vw">
      <el-form-item label="题目名称" prop="name">
        <el-input v-model="addForm.name"></el-input>
      </el-form-item>
      <el-form-item label="题目描述" prop="describe">
        <el-input type="textarea" v-model="addForm.describe" resize="none" :autosize="{ minRows: 15, maxRows: 15 }"
                  style="white-space: pre-line; height:40vh;text-align: left;"></el-input>
      </el-form-item>
      <el-form-item label="题目类型" prop="type">
        <el-select v-model="addForm.type" clearable filterable>
          <el-option v-for="item in typeList"  :key="item.id" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="题目难度" prop="level">
        <el-select v-model="addForm.level" clearable filterable>
          <el-option v-for="item in levelList"  :key="item.id" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="题目类别" prop="category">
        <el-select v-model="addForm.category" clearable filterable>
          <el-option v-for="item in categoryList"  :key="item.cateID" :value="item.cateName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="公司" prop="company">
        <el-select v-model="addForm.company" @change="AddSelectCompany" filterable clearable>
          <el-option v-for="item in companyList"  :key="item.cid" :value="item.cname"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门" prop="department">
        <el-select v-if="this.isAddCompanySelected" v-model="addForm.department" filterable clearable>
          <el-option v-for="item in departmentList"  :key="item.did" :value="item.dname"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="适应岗位" prop="position">
        <el-select v-model="addForm.position" filterable clearable>
          <el-option v-for="item in positionList"  :key="item.posID" :value="item.posName"></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="submitAdd" style="left: -4vw;height:auto; position:relative">提交</el-button>
    </el-form>
  </el-dialog>

</template>

<script>
import router from '@/router/index.js';
export default {
  name: "home",
  data(){
    return{
      sortBy:"pid",
      AddRules:{
        name:[{required:true,message:"题目标题不能为空",trigger:'blur'}],
        describe:[{required:true,message:"题目描述不能为空",trigger:'blur'}]
      },
      query:{
        page:1,
        page_size:10
      },
      addForm:{},
      isAddShow:false,
      kb_content:"",
      isName:"题目",
      isCompanySelected:false,
      isAddCompanySelected:false,
      userId:localStorage.getItem("token"),
      questionList:[],
      queryFormData: {
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
          name:"已完成"
        }
      ],
      companyList:[],
      departmentList:[],
      positionList:[]
    }
  },
  methods:{
    delQuestion(row){
        this.$confirm("确定要删除吗?", "删除提示", {
          confirmButtonText: "确认", //确认按钮文字
          cancelButtonText: "取消", //取消按钮文字
          showClose: true, //是否显示右上角关闭按钮
          type: "warning", //提示类型  success/info/warning/error
        }).then(()=> {  //选择确认按钮进入此方法
          //确认操作
          alert('确认')
          console.log(row.pid)
          this.$axios.delete("http://localhost:8080/deleteProblem",{data:{pid:parseInt(row.pid)}}).then((response) => {
            console.log(response.data)
            if(response.data.code === 200){
              console.log("成功删除")
              this.$message.success("成功删除！")
              this.$axios.get("http://localhost:8080/findProblemTagStringDtos/" + parseInt(this.userId)).then((response) => {
                console.log(response.data)
                if (response.data.code === 200) {
                  this.questionList = response.data.data
                  console.log(this.questionList)
                  this.questionList.map((item) => {
                    if (item.type === 1) {
                      item.typeName = "文字题"
                    } else {
                      item.typeName = "算法题"
                    }
                    if (item.level === 0) {
                      item.levelName = "简单"
                    } else if (item.level === 1) {
                      item.levelName = "中等"
                    } else {
                      item.levelName = "困难"
                    }
                    if (item.finish) {
                      item.isfinish = "已完成"
                    } else {
                      item.isfinish = "未完成"
                    }
                  })

                } else {
                  this.$message.error("获取题目列表失败！")
                }
              })

            }
            else{
              this.$message.error("删除失败QAQ")
            }
          })
        }).catch(() => { //选择取消按钮进入此方法
        });
    },
    handleSizeChange(val) {
      this.query.page = 1
      this.query.page_size = val
    },
    handleCurrentChange(val) {
      this.query.page = val
    },
    getAllKb(){
      let myCateId = null;
      let myCid = null;
      let myDid = null;
      let myPosId = null;
      let myLevelId = null;
      let myTypeId = null;
      let myFinishId = null;
      let myEditTime = null;
      if(this.queryFormData.isfinish === "已完成") {
        myFinishId = true;
      }
      else if (this.queryFormData.isfinish === "未完成"){
        myFinishId = false;
      }
      if(this.queryFormData.category){
        this.categoryList.map((item) => {
          if(item.cateName === this.queryFormData.category){
            myCateId = item.cateID;
          }
        })
      }
      if(this.queryFormData.department){
        this.departmentList.map((item) => {
          if(item.dname === this.queryFormData.department){
            myDid = item.did;
          }
        })
      }
      if(this.queryFormData.position){
        this.positionList.map((item) => {
          if(item.posName === this.queryFormData.position){
            myPosId = item.posID;
          }
        })
      }
      if(this.queryFormData.level){
        this.levelList.map((item) => {
          if(item.name === this.queryFormData.level){
            myLevelId = item.id;
          }
        })
      }
      if(this.queryFormData.type){
        this.typeList.map((item) => {
          if(item.name === this.queryFormData.type){
            myTypeId = item.id;
          }
        })
      }
      if(this.queryFormData.editTime){
        this.editTimeList.map((item) => {
          if(item.name === this.queryFormData.editTime){
            myEditTime = item.id;
          }
        })
      }
      if(this.queryFormData.cid){
        this.editTimeList.map((item) => {
          if(item.cname === this.queryFormData.company){
            myCid = item.cid;
          }
        })
      }
      if (this.isName === "题目"){
        //通过title进行模糊搜索
        this.$axios.get("http://localhost:8080/findProblemTagDtosByTag", {
          params:{
            cateID:myCateId,
            cid:myCid,
            did:myDid,
            editTime:myEditTime,
            exp:this.queryFormData.exp,
            finish:myFinishId,
            level:myLevelId,
            posID:myPosId,
            sort:this.sortBy,
            title:this.kb_content,
            type:myTypeId,
            uid:this.userId
            }}).then((response) => {
          console.log(response.data)
          if (response.data.code === 200) {
            this.questionList = response.data.data
            console.log(this.questionList)
            this.questionList.map((item) => {
              if (item.type === 1) {
                item.typeName = "文字题"
                item.typeName = "文字题"
              } else {
                item.typeName = "算法题"
              }
              if (item.level === 0) {
                item.levelName = "简单"
              } else if (item.level === 1) {
                item.levelName = "中等"
              } else {
                item.levelName = "困难"
              }
              if (item.finish) {
                item.isfinish = "已完成"
              } else {
                item.isfinish = "未完成"
              }
            })
          } else {
            this.$message.error("获取题目列表失败！")
          }
        })
      }
      else{
        this.$axios.get("http://localhost:8080/findProblem/" + parseInt(this.kb_content)).then((response) => {
          console.log(response.data)
          if (response.data.code === 200) {
            this.questionList = []
            this.questionList.push(response.data.data)
            console.log(this.questionList)
            this.questionList.map((item) => {
              if (item.type === 1) {
                item.typeName = "文字题"
              } else {
                item.typeName = "算法题"
              }
              if (item.level === 0) {
                item.levelName = "简单"
              } else if (item.level === 1) {
                item.levelName = "中等"
              } else {
                item.levelName = "困难"
              }
              if (item.finish) {
                item.isfinish = "已完成"
              } else {
                item.isfinish = "未完成"
              }
            })
            if(this.queryFormData.type && this.questionList[0].type !== this.queryFormData.type ||
                this.queryFormData.category && this.questionList[0].category !== this.queryFormData.category ||
                this.queryFormData.campany && this.questionList[0].campany !== this.queryFormData.campany ||
                this.queryFormData.department && this.questionList[0].department !== this.queryFormData.department ||
                this.queryFormData.editTime && this.questionList[0].editTime !== this.queryFormData.editTime ||
                this.queryFormData.position && this.questionList[0].position !== this.queryFormData.position ||
                this.queryFormData.finish && this.questionList[0].finish !== this.queryFormData.finish ||
                this.queryFormData.exp && this.questionList[0].exp !== this.queryFormData.exp ||
                this.queryFormData.level && this.questionList[0].level !== this.queryFormData.level
            ){
              this.questionList = []
            }
          } else {
            this.$message.error("获取题目列表失败！")
          }
        })
      }
    },
    changeRate(value) {
      console.log(value);
    },
    SelectCompany(value){
      console.log(value);
      if(value !== ""){
        this.isCompanySelected = true;
      }
      let companyID = 0;
      this.companyList.map((item) => {
        if(this.queryFormData.company === item.cname){
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
    },
    AddSelectCompany(value){
      console.log(value);
      if(value !== ""){
        this.isAddCompanySelected = true;
      }
      let companyID = 0;
      this.companyList.map((item) => {
        if(this.addForm.company === item.cname){
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
      localStorage.setItem("pid",question.pid)
      router.push("/question")
    },
    addQuestion(){
      this.addForm=[]
      this.isAddShow = true;
    },
    submitAdd(){
      console.log(this.addForm);
      this.$refs.addForm.validate(valid => {
        let myCateId = -1;
        let myDid = -1;
        let myPosId = -1;
        let myLevelId = -1;
        let myTypeId = -1;
        if(valid) {
          if(this.addForm.category){
            this.categoryList.map((item) => {
              if(item.cateName === this.addForm.category){
                myCateId = item.cateID;
              }
            })
          }
          if(this.addForm.department){
            this.departmentList.map((item) => {
              if(item.dname === this.addForm.department){
                myDid = item.did;
              }
            })
          }
          if(this.addForm.position){
            this.positionList.map((item) => {
              if(item.posName === this.addForm.position){
                myPosId = item.posID;
              }
            })
          }
          if(this.addForm.level){
            this.levelList.map((item) => {
              if(item.name === this.addForm.level){
                myLevelId = item.id;
              }
            })
          }
          if(this.addForm.type){
            this.typeList.map((item) => {
              if(item.name === this.addForm.type){
                myTypeId = item.id;
              }
            })
          }
          console.log("提交新建题目表单")
          this.$axios.post("http://localhost:8080/addProblem",
              {cateID:myCateId, description:this.addForm.describe, did:myDid, level: myLevelId, posID:myPosId,
                title:this.addForm.name, type:myTypeId, uid:parseInt(this.userId)}).then((response) => {
            console.log(response.data)
            if(response.data.code === 200){
              console.log("cateID is " + myCateId +"\ndescription is " + this.addForm.describe + "\ndid is "
                  + myDid + "\nlevel is " +myLevelId +"\nposID is " + myPosId + "\n title is" + this.addForm.name
                  + "\n type is " + myTypeId + "\nuid is " + parseInt(this.userId))
              console.log("成功添加题目")
              this.$message.success("添加成功！")
              this.getAllKb();
              this.isAddShow = false;
            }
            else{
              this.$message.error("添加失败")
            }
          })
        }
        else{
          this.$message.error("请填写题目标题及描述")
        }
      })
    }
  },
  created() {
    //获取题目列表
    this.$axios.get("http://localhost:8080/findProblemTagStringDtos/" + parseInt(this.userId)).then((response) => {
      console.log(response.data)
      if (response.data.code === 200) {
        this.questionList = response.data.data
        console.log(this.questionList)
        this.questionList.map((item) => {
          if (item.type === 1) {
            item.typeName = "文字题"
          } else {
            item.typeName = "算法题"
          }
          if (item.level === 0) {
            item.levelName = "简单"
          } else if (item.level === 1) {
            item.levelName = "中等"
          } else {
            item.levelName = "困难"
          }
          if (item.finish) {
            item.isfinish = "已完成"
          } else {
            item.isfinish = "未完成"
          }
        })

      } else {
        this.$message.error("获取题目列表失败！")
      }
    })
    //获取标签列表
    //获取类别
    this.$axios.get("http://localhost:8080/findCategories/" + this.userId
    ).then((response) => {
      console.log(response.data)
      if (response.data.code === 200) {
        this.categoryList = response.data.data
      } else {
        this.$message.error("获取类别列表失败！")
      }
    })
    //获取岗位列表
    this.$axios.get("http://localhost:8080/findPositions/" + this.userId).then((response) => {
      console.log(response.data)
      if (response.data.code === 200) {
        this.positionList = response.data.data
      } else {
        this.$message.error("获取岗位列表失败！")
      }
    })
    //获取公司列表
    this.$axios.get("http://localhost:8080/findCompanies/" + this.userId).then((response) => {
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
.addBtn{
  top:0.5vh;
  left:4vw;
  position:relative;
  color:#6a99f1;
  font-family: 华文黑体;
  font-size: 1.8vh;
  background-color:transparent;
  margin-left: 5vw;
}
</style>