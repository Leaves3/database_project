<template>
  <div>
    <Head></Head>
  </div>
  <div>
    <el-row style="display: flex">
      <el-col :span="8" style=" margin-left:15vw;margin-bottom:10px; height:6.5vh;">
        <el-input
            type="text"
            prefix-icon="el-icon-search"
            v-model="kbContent"
            placeholder="请输入关键字"
            style="width:20vw; cursor: pointer"
            :disabled="showTag === '类型' || showTag === '难度' || showTag === '最近编辑时间' || showTag === '完成情况'"
            @keyup.enter="getAllKb"
        >
          <template #suffix>
            <el-icon @click="getAllKb">
              <Search />
            </el-icon>
          </template>
        </el-input>
        <el-select v-model="this.showTag" placeholder="选择标签" filterable style="margin-left: 1vw;width:8vw"
                   @change="setShowTag">
          <el-option v-for="item in tagList" :key="item.id" :value="item.name"></el-option>
        </el-select>
        <el-select v-if="this.showTag === '部门'" v-model="selectCompany" placeholder="选择公司" filterable
                   style="top:-4vh;left:21vw;width:8vw" @change="getAllKb">
          <el-option v-for="item in companyList" :key="item.cid" :value="item.cname"></el-option>
        </el-select>
        <el-button type="primary" @click="addTag" size="small" class="addBtn">新增+</el-button>
      </el-col>
    </el-row>
  </div>
  <div>
    <el-table :data="showData.slice((query.page - 1) * query.page_size, query.page * query.page_size)"
              style="width:70%; left:13vw; height: 65vh">
      <el-table-column prop="id" label="编号" align="center" min-width="20%"></el-table-column>
      <el-table-column prop="name" label="名称" align="center" min-width="25%"></el-table-column>
      <el-table-column prop="type" label="标签类型" align="center" min-width="25%"></el-table-column>
      <el-table-column v-if="this.showTag === '部门'" label="所属公司" prop="cid" align="center" min-width="30%"></el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" @click="editTag(scope.row)" :disabled="showTag === '类型' || showTag === '难度' ||
              showTag === '最近编辑时间' || showTag === '完成情况'">编辑</el-button>
          <el-button type="danger" @click="del(scope.row)" :disabled="showTag === '类型' || showTag === '难度' ||
              showTag === '最近编辑时间' || showTag === '完成情况'">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        :total="showData.length"
        :page-size="query.page_size"
        :page-sizes="[5, 10, 20, 50, 100]"
        layout=" total, sizes, prev, pager, next"
        background
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
    ></el-pagination>
    <el-dialog v-model="editDialogShow" v-if="editDialogShow" :title="编辑" style="height: auto">
      <el-form ref="editFormData" :model="editFormData" :rules="rules" label-width="8vw"
               style="left: 4vw;position: relative;height: auto">
        <el-form-item label="标签id" prop="id">
          <el-input v-model="editFormData.id" :disabled=true style="width:25vw"></el-input>
        </el-form-item>
        <el-form-item label="标签名字" prop="title">
          <el-input v-model="editFormData.name" style="width:25vw"></el-input>
        </el-form-item>
        <el-form-item v-if="editFormData.type === '部门'" label="所属公司">
          <el-input v-model="editFormData.cid" style="width:25vw" disabled></el-input>
        </el-form-item >
        <el-form-item label="标签种类">
          <el-input v-model="editFormData.type" style="width:25vw" disabled></el-input>
        </el-form-item>
        <el-button type="primary" @click="submitEdit" style="left: -4vw;height:auto; position:relative">提交</el-button>
      </el-form>
    </el-dialog>
  </div>
  <div>
    <el-dialog v-model="showAdd" v-if="showAdd" :title="新增标签" style="height: auto">
      <el-form ref="addForm" :model="addFormData" :rules="addRules" label-width="8vw"
               style="left: 4vw;position: relative;height: auto">
        <el-form-item label="标签名字" prop="name">
          <el-input v-model="addFormData.name" style="width:25vw"></el-input>
        </el-form-item>
        <el-form-item label="标签种类" prop="type">
          <el-select v-model="addFormData.type" style="width:25vw">
            <el-option value="类别"></el-option>
            <el-option value="公司"></el-option>
            <el-option value="部门"></el-option>
            <el-option value="岗位"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="addFormData.type === '部门'" label="所属公司">
          <el-select v-model="addFormData.cid" style="width:25vw">
            <el-option v-for="item in companyList" :key="item.cid" :value="item.cname"></el-option>
          </el-select>
        </el-form-item >
        <el-button type="primary" @click="submitAdd" style="left: -4vw;height:auto; position:relative">提交</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tagManage",
  data(){
    return{
      rules: {
        name:[{required:true,message:"请输入标签名称",trigger:'blur'}]
      },
      query:{
        page:1,
        page_size:10
      },
      editFormData:{
        id:0,
        name:"",
        type:"",
        cid:""
      },
      addFormData:{
        name:"",
        type:"",
        cid:""
      },
      addRules:{
        name:[{required:true,message:"请输入标签名称",trigger:'blur'}],
        type:[{required:true,message:"请输入标签类别",trigger:'blur'}]
      },
      showAdd:false,
      selectCompany:"",
      editDialogShow:false,
      kbContent:"",
      showTag:"类型",
      tagType:0,
      tagList:[
        {id:0, name:"类型"},
        {id:1, name:"难度"},
        {id:2, name:"类别"},
        {id:3, name:"最近编辑时间"},
        {id:4, name:"完成情况"},
        {id:5, name:"公司"},
        {id:6, name:"部门"},
        {id:7, name: "岗位"}],
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
        name:"已完成"
      },{
        id:1,
        name: "未完成"
      }],
      companyList:[],
      departmentList:[],
      positionList:[],
      showData:[]
    }
  },
  methods:{
    del(row){
      this.$confirm("确定要删除吗?", "删除提示", {
        confirmButtonText: "确认", //确认按钮文字
        cancelButtonText: "取消", //取消按钮文字
        showClose: true, //是否显示右上角关闭按钮
        type: "warning", //提示类型  success/info/warning/error
      }).then(()=> {
        alert('确认')
        if(row.type === "类别"){
          console.log(row.id)
          this.$axios.delete("http://localhost:8080/deleteCategory",{
            data:{
              cateId:parseInt(row.id)}
          }).then((responds) =>{
            if(responds.data.code === 200){
              console.log("删除成功")
              this.$message.success("删除成功")
            }
            else{
              this.$message.error(responds.data.message)
            }
          })
        }
        else if(row.type === "公司"){
          this.$axios.delete("http://localhost:8080/deleteCompany",{
            data: {
              cid:parseInt(row.id)
            }
          }).then((responds) =>{
            if(responds.data.code === 200){
              console.log("删除成功")
              this.$message.success("删除成功")
            }
            else{
              this.$message.error(responds.data.message)
            }
          })
        }
        else if(row.type === "部门"){
          this.$axios.delete("http://localhost:8080/deleteDepartmentByDid",{
            data:{
              did:parseInt(row.id)}
          }).then((responds) =>{
            if(responds.data.code === 200){
              console.log("删除成功")
              this.$message.success("删除成功")
            }
            else{
              this.$message.error(responds.data.message)
            }
          })
        }
        else if(row.type === "岗位"){
          this.$axios.delete("http://localhost:8080/deletePosition",{
            data:{
              posId:parseInt(row.id)}
          }).then((responds) =>{
            if(responds.data.code === 200){
              console.log("删除成功")
              this.$message.success("删除成功")
            }
            else{
              this.$message.error(responds.data.message)
            }
          })
        }
        this.$forceUpdate()
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
      console.log("传给后端关键字 "+this.kbContent+" 以及搜索方式 " + this.showTag)
      this.showData = []
      if(this.showTag === "类型"){
        this.typeList.map((item) =>{
          let a = {}
          a.id = item.id
          a.name = item.name
          a.type = "类型"
          this.showData.push(a)
        })
      }
      else if(this.showTag === "难度"){
        this.levelList.map((item) =>{
          let a = {}
          a.id = item.id
          a.name = item.name
          a.type = "难度"
          this.showData.push(a)
        })
      }
      else if(this.showTag === "最近编辑时间"){
        this.editTimeList.map((item) =>{
          let a = {}
          a.id = item.id
          a.name = item.name
          a.type = "最近编辑时间"
          this.showData.push(a)
        })
      }
      else if(this.showTag === "完成情况"){
        this.finishList.map((item) =>{
          let a = {}
          a.id = item.id
          a.name = item.name
          a.type = "完成情况"
          this.showData.push(a)
        })
      }
      else if(this.showTag === "类别"){
        this.$axios.get("http://localhost:8080/findCategoriesByName",{
          params:{
            uid:localStorage.getItem('token'),
            cateName:this.kbContent
          }
        }).then((response) =>{
          console.log(response.data.data)
          if(response.data.code === 200){
            response.data.data.map((item) =>{
              let a = {}
              a.id = item.cateID
              a.name = item.cateName
              a.type = "类别"
              this.showData.push(a)
            })
          }
        })
      }
      else if(this.showTag === "公司"){
        this.$axios.get("http://localhost:8080/findCompaniesByName",{
          params:{
            uid:localStorage.getItem('token'),
            cname:this.kbContent
          }
        }).then((response) =>{
          console.log(response.data.data)
          if(response.data.code === 200){
            response.data.data.map((item) =>{
              let a = {}
              a.id = item.cid
              a.name = item.cname
              a.type = "公司"
              this.showData.push(a)
            })
          }
        })
      }
      else if(this.showTag === "部门"){
        if(this.selectCompany){
          let myCid = null;
          this.companyList.map((item) =>{
            if(item.cname === this.selectCompany){
              myCid = item.cid;
            }
          })
          this.$axios.get("http://localhost:8080/findDepartmentsByName",{
            params:{
              cid:myCid,
              dname:this.kbContent
            }
          }).then((response) =>{
            console.log(response.data.data)
            if(response.data.code === 200){
              response.data.data.map((item) =>{
                let a = {}
                a.id = item.did
                a.name = item.dname
                a.type = "部门"
                this.companyList.map((item2) =>{
                  if(item2.cid === item.cid){
                    a.cid = item2.cname
                  }
                })
                this.showData.push(a)
              })
            }
          })
        }
      }
      else{
        this.$axios.get("http://localhost:8080/findPositionsByName",{
          params:{
            uid:localStorage.getItem('token'),
            posName:this.kbContent
          }
        }).then((response) =>{
          console.log(response.data.data)
          if(response.data.code === 200){
            response.data.data.map((item) =>{
              let a = {}
              a.id = item.posID
              a.name = item.posName
              a.type = "岗位"
              this.showData.push(a)
            })
          }
        })
      }
      this.$forceUpdate()
    },
    setShowTag(value){
      console.log(value)
      this.showTag = value
      this.getAllKb()
    },
    editTag(row){
      console.log(row);
      this.editFormData = JSON.parse(JSON.stringify(row));
      this.editDialogShow = true;
      console.log(this.editFormData);
    },
    submitEdit(){
      //向后端传数据更改
      this.$refs.editFormData.validate(valid => {
        if (valid) {
          console.log("传给后端 " + this.editFormData)
          if (this.showTag === "类别") {
            this.$axios.post("http://localhost:8080/updateCategory", {
                cateId: parseInt(this.editFormData.id),
                newCateName: this.editFormData.name}
            ).then((responds) => {
              console.log(responds.data)
              if (responds.data.code === 200) {
                console.log("成功编辑")
                this.$message.success("成功编辑")
                this.$axios.get("http://localhost:8080/findCategories/" + localStorage.getItem('token')
                  ).then((response) => {if (response.data.code === 200) {this.categoryList = response.data.data}})
                this.editDialogShow = false
              } else {
                this.$message.error("编辑失败QAQ")
              }
            })
          } else if (this.showTag === "公司") {
            this.$axios.post("http://localhost:8080/updateCompany", {
                cid: parseInt(this.editFormData.id),
                newCname: this.editFormData.name}
            ).then((responds) => {
              console.log(responds.data)
              if (responds.data.code === 200) {
                console.log("成功编辑")
                this.$message.success("成功编辑")
                this.editDialogShow = false
              } else {
                this.$message.error("编辑失败QAQ")
              }
            })
          } else if (this.showTag === "部门") {
            this.$axios.post("http://localhost:8080/updateDepartment", {
                did: parseInt(this.editFormData.id),
                newDname: this.editFormData.name}
            ).then((responds) => {
              console.log(responds.data)
              if (responds.data.code === 200) {
                console.log("成功编辑")
                this.$message.success("成功编辑")
                this.editDialogShow = false
              } else {
                this.$message.error("编辑失败QAQ")
              }
            })
          } else {
            this.$axios.post("http://localhost:8080/updatePosition", {
                posId: parseInt(this.editFormData.id),
                newPosName: this.editFormData.name}
            ).then((responds) => {
              console.log(responds.data)
              if (responds.data.code === 200) {
                console.log("成功编辑")
                this.$message.success("成功编辑")
                this.editDialogShow = false
              } else {
                this.$message.error("编辑失败QAQ")
              }
            })
          }
        }
        else{
          console.log(this.editFormData)
          this.$message.error("请输入名称")
        }
      })
      this.$forceUpdate()
    },
    addTag(){
      this.addFormData=[];
      this.showAdd = true;
      console.log("添加标签")
    },
    submitAdd() {
      //向后端传数据更改
      console.log("传给后端 " + this.AddFormData)
      this.$refs.addForm.validate(valid => {
        if (valid) {
          if (this.addFormData.type === "类别") {
            this.$axios.post("http://localhost:8080/addCategory", {
              uid: parseInt(localStorage.getItem('token')),
              cateName: this.addFormData.name
            }).then((responds) => {
              console.log(responds.data)
              if (responds.data.code === 200) {
                console.log("成功添加")
                this.$message.success("成功添加")
                this.showAdd = false
              } else {
                this.$message.error("添加失败QAQ")
              }
            })
          } else if (this.addFormData.type === "公司") {
            this.$axios.post("http://localhost:8080/addCompany", {
              uid: parseInt(localStorage.getItem('token')),
              cname: this.addFormData.name
            }).then((responds) => {
              console.log(responds.data)
              if (responds.data.code === 200) {
                console.log("成功添加")
                this.$message.success("成功添加")
                this.$axios.get("http://localhost:8080/findCompanies/" + localStorage.getItem('token')
                  ).then((response) => {if (response.data.code === 200) {this.companyList = response.data.data}})
                this.showAdd = false
              } else {
                this.$message.error("添加失败QAQ")
              }
            })
          } else if (this.addFormData.type === "部门") {
            let myCid = null;
            this.companyList.map((item) => {
              if (item.cname === this.addFormData.cid) {
                myCid = item.cid;
              }
            })
            this.$axios.post("http://localhost:8080/addDepartment", {
              uid: parseInt(localStorage.getItem('token')),
              dname: this.addFormData.name,
              cid: myCid
            }).then((responds) => {
              console.log(responds.data)
              if (responds.data.code === 200) {
                console.log("成功添加")
                this.$message.success("成功添加")
                this.showAdd = false
              } else {
                this.$message.error("添加失败QAQ")
              }
            })
          } else {
            this.$axios.post("http://localhost:8080/addPosition", {
                  uid: parseInt(localStorage.getItem('token')),
                  posName: this.addFormData.name
                }
            ).then((responds) => {
              console.log(responds.data)
              if (responds.data.code === 200) {
                console.log("成功编辑")
                this.$message.success("成功添加")
                this.showAdd = false
              } else {
                this.$message.error("添加失败QAQ")
              }
            })
          }
        }
        else{
          this.$message.error("请输入名称并选择类别")
        }
      })
      this.$forceUpdate()
    }
  },
  created() {//获取标签列表
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
      }
      else {
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

    this.showData = []
    this.typeList.map((item) =>{
      let a = {}
      a.id = item.id
      a.name = item.name
      a.type = "类型"
      this.showData.push(a)
    })
  }
}
</script>

<style scoped>
.el-pagination{
  position: fixed;
  top: 2vh;
  left: 35vw;
  top:95vh;
}
.addBtn{
  top:-3vh;
  left:32vw;
  position:relative;
  color:#6a99f1;
  font-family: 华文黑体;
  font-size: 1.8vh;
  background-color:transparent;
}
</style>