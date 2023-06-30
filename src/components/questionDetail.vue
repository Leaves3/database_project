<template>
<div>
  <div>
    <Head></Head>
  </div>
  <div>
    <questionLeft style="height:90vh; width:41.5vw; top: 5vh; position: fixed;overflow: auto"></questionLeft>
  </div>
    <questionRight style="height:90vh; width: 58vw;right: 0; top:10vh; position: fixed; overflow: auto"></questionRight>
  </div>
</template>

<script>
export default {
  name: "questionDetail",
  data(){
    return{
      userToken:localStorage.getItem("token"),
      questionInfo:localStorage.getItem("question")
    }
  },
  methods:{
    show(){
      console.log(this.userToken)
      console.log(this.questionInfo)
    }
  }
}
</script>

<style scoped>

</style>