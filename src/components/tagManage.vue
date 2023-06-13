<template>
  <div>
    <Head></Head>
  </div>
  <div>
    <el-row style="display: flex">
      <el-col :span="8" style=" margin-left:15vw;margin-bottom:10px;width: 10vw; height:6.5vh;">
        <el-input
            type="text"
            prefix-icon="el-icon-search"
            v-model="kbContent"
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
        <el-select v-model="showTag" placeholder="选择标签" filterable style="margin-left: 1vw;width:8vw" @change="setShowTag">
          <el-option v-for="item in tagList" :key="item.id" :value="item.name"></el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
  <div>
    <el-table :data="showData.slice((query.page - 1) * query.page_size, query.page * query.page_size)"
              style="width:70%; left:13vw; height: 65vh">
      <el-table-column prop="id" label="编号" align="center" min-width="20%"></el-table-column>
      <el-table-column prop="name" label="名称" align="center" min-width="25%"></el-table-column>
      <el-table-column prop="type" label="标签类型" align="center" min-width="25%"></el-table-column>
      <el-table-column v-if="showTag === '部门'" label="所属公司" align="center" min-width="30%"></el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" @click="editTag(scope.row)">编辑</el-button>
          <el-button type="danger" @click="del(scope.row)">删除</el-button>
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
        <el-form-item label="标签id">
          <el-input v-model="editFormData.id" :disabled=true style="width:25vw"></el-input>
        </el-form-item>
        <el-form-item label="标签名字">
        <el-input v-model="editFormData.name" style="width:25vw"></el-input>
        </el-form-item>
        <el-form-item v-if="showTag === '部门'" label="所属公司">
          <el-input v-model="editFormData.father" style="width:25vw"></el-input>
        </el-form-item >
        <el-form-item label="标签种类">
          <el-input v-model="editFormData.type" style="width:25vw"></el-input>
        </el-form-item>
        <el-button type="primary" @click="submitEdit" style="left: -4vw;height:auto; position:relative">提交</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tagManage",
  data(){
    return{
      query:{
        page:1,
        page_size:10
      },
      editFormData:{
        id:0,
        name:"",
        type:""
      },
      editDialogShow:false,
      kbContent:"",
      showTag:"",
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
      showData:[{
          id:0,
          name:"name1",
          type:"type1",
          father:""
        },{
        id:1,
        name:"name2",
        type:"type2",
        father:""
      },{
        id:2,
        name:"name1",
        type:"type3",
        father:""
      },
      ]
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
    setShowTag(value){
      this.showTag = value;
    },
    getAllKb(){
      console.log("传给后端关键字 "+this.kbContent+" 以及搜索方式 " + this.isName)
    },
    editTag(row){
      console.log(row);
      this.editFormData = row;
      this.editDialogShow = true;
      console.log(this.editFormData);
    },
    submitEdit(){
      //向后端传数据更改
      console.log("传给后端关键字 "+ this.editFormData)
    }
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
</style>