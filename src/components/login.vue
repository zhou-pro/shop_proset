B<template>
  <div class="login-contaniner">
    <div class="login-box">
      <!--头部区域-->
      <div class="img-box">
        <img src="../assets/img/ava.jpg" alt="">
      </div>
     <el-form ref="LonginFormRef" label-width="0px" class="form-box" :model="loginform" :rules="rules">
  <el-form-item prop="username">
    <el-input prefix-icon='el-icon-user' v-model="loginform.username"></el-input>
  </el-form-item>
  <el-form-item prop="password">
    <el-input type="password" prefix-icon='el-icon-lock' v-model="loginform.password"></el-input>
  </el-form-item>
  <el-form-item class="btn">
     <el-button type="primary" @click="login">登录</el-button>
      <el-button type="info" @click="LoginFrom">重置</el-button>
  </el-form-item>
  </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name:'login',
  data() {
    return {
      loginform: {
        username:'',
        password:''        
      },
      rules:{
          username: [
            { required: true, message: '请输入用户名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
        }
    }
  },
  methods: {
    LoginFrom(){
      this.$refs.LonginFormRef.resetFields()
    },
    login(){
      this.$refs.LonginFormRef.validate(async vali=>{
        if(!vali)return;
        const {data: result} =await this.$http.post('login',this.loginform)
        if(result.meta.status !==200 )
          return this.$message.error('登录失败');
        this.$message.success('登陆成功');
        //保存token
        window.sessionStorage.setItem("token", result.data.token)
        this.$router.push('/home')
      })
    }
  },

}
</script>

<style  scoped>
.login-contaniner{
  background-color: #2b4b6b;
  height: 100%;
  position: relative;
}
.login-box{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  height: 300px;
  width: 450px;
  border-radius: 3px;
  background-color: #fff;
  padding: 5px;
}
.img-box{
  height: 100px;
  width: 100px;
  border-radius: 50%;
  box-shadow: 0 0 10px #333;
  padding: 1px;
  position: absolute;
  left: 50%;
  transform: translate(-50%,-50%);
  background-color: #fff;
}
.img-box img{
  height: 100%;
  width: 100%;
  border-radius: 50%;
}
.form-box{
  position: absolute;
  bottom: 0;
  left: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 90%;
}
.btn{
  display: flex;
  justify-content: flex-end;

}
</style>