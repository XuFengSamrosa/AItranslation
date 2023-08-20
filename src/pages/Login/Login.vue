<template>
  <div class="content">
    <div class="login_container">
      <el-form v-model="loginData" class="demo-dynamic"   ref="formRef" >
        <el-col :span="24" :offset="8" style="margin-bottom: 40px" >
          <h2>系统登录</h2>
        </el-col>
        <el-form-item label="用户名">
          <el-col :span="24">
            <el-input v-model="username" placeholder="请输入用户名" clearable />
          </el-col>
        </el-form-item>
 
        <el-form-item label="密码">
          <el-col :span="23" :offset="1">
            <el-input
                v-model="password"
                type="password"
                placeholder="请输入密码"
                show-password
            />
          </el-col>
        </el-form-item>
 
        <el-col :span = "24">
          <div id="login_btn">
            <el-button type="primary" @click="loginBtn">登录</el-button>
          </div>
        </el-col> 
      </el-form> 
    </div> 
  </div>
</template>

<script>
export default {
  name: "login",
  data(){
    return {
      username:"",
      password:""
    }    
  },
  methods:{
    loginBtn() {
      if(this.username == 'admin'&& this.password == 'admin'){
        //this.$message.info('登录成功');
        this.$router.push('/home');          
      }else{
        //this.$message.error('用户名密码错误');
      }
    },
  }
}
</script>
<style>
.content{
  width: 100%;
  height: 100%;
  background-image: url('../../assets/login4.jpg');
  background-size:100% ;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.login_container{
  width: 500px;
  height: 450px;
  background: rgba(194, 180, 180, 0.2);
  border-radius: 5px;
  box-shadow: 0 25px 35px rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-input__wrapper{
  margin-bottom: 10px;
}
#login_btn{
  width: 86%;
  margin-left: 14%;
  margin-top: 10px;
  display: inline-grid;
}
.el-button el-button--primary{
  height: 55px !important;
}
.demo-dynamic{
  width: 80%;
  height: 80%;
}
</style>
