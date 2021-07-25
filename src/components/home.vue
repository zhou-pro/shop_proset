<template>    
 <el-container class="container">    
  <el-header> 
    <div class="headerStem">
      <img src="../assets/img/ava.jpg" alt="">
      <span>
        电商后台管理系统
      </span>
    </div>
    <el-button type="info" @click="exit">退出</el-button>
     </el-header>
  <el-container>
    <!--侧边栏-->
    <el-aside :width="isClose ? '64px' : '200px'">
      <div class="handtap" @click="handTapClose">|||</div>
      <el-menu
      :default-active="activePath"
      :router='true'
      :collapse-transition='false'
      :collapse="isClose"
      unique-opened
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409EFF">
       <!--一级菜单-->
      <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
        <template slot="title">
          <i :class="iconObject[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
        <!--二级菜单-->
           <el-menu-item
           @click="saveNavState('/' + subitem.path)" 
           :index=" '/' + subitem.path" 
           v-for="subitem in item.children" :key="subitem.id">
              <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{subitem.authName}}</span>
        </template>
        </el-menu-item>
        
      </el-submenu>
    </el-menu>
    </el-aside>
    <!--主体区-->
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  name:'home',
  data() {
    return {
      isClose:false,
      menuList: [],
      activePath:'',
      iconObject:{
        '125':'el-icon-s-custom active',
        '103':'el-icon-lock active',
        '101':'el-icon-sell active',
        '102':'el-icon-tickets active',
        '145':'el-icon-s-marketing active'

      }
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath') 
  },
  methods: {
    exit(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList(){
      const {data: res} = await this.$http.get('menus')
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      console.log(res);
    },
    handTapClose(){
      this.isClose = !this.isClose
    },
  //将链接状态保存到sessionstroge中
  saveNavState(activepath){
    window.sessionStorage.setItem('activePath',activepath)
    this.activePath = activepath
  }
  }

}
</script>

<style scoped>
.el-menu{
  border-right: none;
  transition: all 1s linear;
}
.el-header{
  background-color: #373d41;
}
.el-aside{
  background-color: #333744;
}
.el-main{
  background-color: #eaedf1;
}
.container{
  height: 100%;
}
.el-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.active{
  margin-right: 10px;
}
.handtap{
  color: #fff;
  background-color: #4A5064;
  text-align: center;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-header img{
  height: 100%;
  width: 60px;
  border-radius: 50%;
  margin-right:10px ;
}

.el-header .headerStem{
  display: flex;
  align-items: center;
}
</style>