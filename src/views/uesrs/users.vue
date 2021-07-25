<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!--搜索区-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible=!dialogVisible"> 添加用户</el-button>
        </el-col>
      </el-row>

      <!--列表区-->
      <el-table stripe border :data="userList" style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch @change="userStateChange(scope.row)" v-model="scope.row.mg_state"  active-color="#13ce66"  inactive-color="#ff4949"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作"> 
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="removeUserByid(scope.row.id)"></el-button>            
             <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable='false'>
               <el-button type="warning" icon="el-icon-setting" @click="setUserdialog(scope.row)"></el-button>
                </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      
      <!--分页区-->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 3, 4, 5, 6, 7]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>

    <!--添加用户对话框-->
    <el-dialog
    @close="addDialogclosed"
  title="添加用户"
  :visible.sync="dialogVisible"
  width="50%">
  <!--主题区-->
  <el-form ref="addFormRef" :model="addForm" label-width="70px" :rules="addFormRules">
  <el-form-item label="用户名" prop='username' >
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop='password' >
    <el-input v-model="addForm.password" type="password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop='email' >
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop='mobile' >
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>
  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="adduser">确 定</el-button>
  </span>
</el-dialog>

<!--修改用户对话框-->
  <el-dialog
  @close="editFormClosed"
  title="修改用户信息"
  :visible.sync="editDialogVisible"
  width="50%">
  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="editForm.username" disabled></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="editForm.email" ></el-input>
  </el-form-item>
  <el-form-item label="用户名" prop="mobile">
    <el-input v-model="editForm.mobile" ></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
</el-dialog>

<!--分配角色的对话框-->
<el-dialog
  title="分配角色"
  :visible.sync="setUserdialogVisible"
  width="50%">
  <div>
    <p>当前用户：{{userInfo.username}}</p>
    <p>当前角色：{{userInfo.role_name}}</p>
    <p>分配新角色：
      <el-select v-model="selectRolesId" placeholder="请选择">
    <el-option
      v-for="item in rolesList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
    </p>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setUserdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  name: "users",
  data() {
    //自定义验证邮箱
    var checkEmail = (rule, value, cb)=>{
      const regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
      if(regEmail.test(value)){
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    //自定义验证手机号
    var checkMobile = (rule, value, cb)=>{
      const regMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if(regMobile.test(value)){
        return cb()      
        }
        cb(new Error('请输入合法的手机号'))
    }
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      //需要被分配角色的用户信息
      userInfo:{},
      //所有角色数据列表
      rolesList:[],
      //已选中的角色Id值
      selectRolesId:'',
      total: 0,
      dialogVisible:false,
      editDialogVisible:false,
      setUserdialogVisible:false,
      //添加到表单中的数据
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      editForm:{},
      editFormRules:{
        email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            {validator:checkEmail, trigger:'blur' }
          ],
        mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator:checkMobile, trigger:'blur'  }
          ],
      },
      addFormRules:{
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
          ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
          ],
        email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            {validator:checkEmail, trigger:'blur' }
          ],
        mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator:checkMobile, trigger:'blur'  }
          ],
      }
    };
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取列表失败")
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    //监听pagesize改变的函数
    handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
        this.getUserList()
    },
    //监听页码值改变的回调函数
    handleCurrentChange(newNum){
      this.queryInfo.pagenum = newNum
      this.getUserList()
    },
    async userStateChange(userInfo){
     // console.log(userInfo)
      const {data: res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if(res.meta.status !== 200){
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新状态失败')
      }
      this.$message.success('更新状态成功')
    },
    addDialogclosed(){
      this.$refs.addFormRef.resetFields()
    },
    adduser(){
      this.$refs.addFormRef.validate(async (vali)=>{
        if(!vali) return
        //校验通过发送请求
       const {data: res} = await this.$http.post('users', this.addForm)
       if(res.meta.status !== 201){
         this.$message.error('添加用户失败')
       }
       this.$message.success('添加用户成功')
       //关闭对话框
       this.dialogVisible = false
       //更新数据
       this.getUserList()
     })
    },
    async showEditDialog(id){
      //console.log(id);
     const {data:res} = await this.$http.get('users/'+ id)
     //console.log(res)
     this.editForm = res.data
      this.editDialogVisible = true
    },
    //重置表单
    editFormClosed(){
      this.$refs.editFormRef.resetFields()
    },
    //修改信息预验证
    editUserInfo(){
      this.$refs.editFormRef.validate(async vali=>{
        if(!vali)return
        //发起请求
        const {data: res} = await this.$http.put('users/'+this.editForm.id,{
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if(res.meta.status !== 200) return this.$message.error('更新用户信息失败')
       //关闭对话框
       this.editDialogVisible = false
       //更新数据
        this.getUserList()
        this.$message.success('更新用户数据成功')
      })
    },
    //根据id删除用户
    async removeUserByid(id){
      //console.log(id);
    const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'}).catch(err=>err)
         // console.log(confirmResult);
         //点击确认返回字符串confirm
         //点击取消返回cancle
         if(confirmResult !== 'confirm') return this.$message.info('已经取消删除')
        const {data:res} = await this.$http.delete('users/' + id)
        if(res.meta.status !== 200) return this.$message.error('删除失败！')
         this.$message.success("已经删除该用户")
         this.getUserList()
    },
    //显示分配角色的回调
   async setUserdialog(userInfo){
      this.userInfo = userInfo
      //在展示对话框之前获取角色列表
    const {data: res} = await this.$http.get('roles')
    //console.log(res);
    if(res.meta.status !== 200) return this.$message.error('获取失败')
      this.rolesList = res.data
      this.setUserdialogVisible = true
    },
    //点击按钮分配角色
   async saveRoleInfo(){
      if(!this.selectRolesId) return this.$message.error('请选择')
    const {data: res} = await this.$http.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectRolesId
      })
     // console.log(res);
     if(res.meta.status !== 200) return this.$message.error('更新角色失败')
    this.$message.success('更新角色成功')
    this.setUserdialogVisible = false
    this.getUserList()
    }

  },
};
</script>

<style scoped>
</style>