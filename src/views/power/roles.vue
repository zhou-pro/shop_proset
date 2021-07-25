<template>
<div>
  
  <!--面包屑导航-->
 <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

<!--卡片视图-->
<el-card>
  <!--添加按钮区-->
  <el-row>
    <el-col>
      <el-button type="primary">添加用户</el-button>
    </el-col>
  </el-row>

    <!--列表区-->
    <el-table :data="rolesList" stripe border>
      <!--展开列-->
      <el-table-column type="expand">
        <template slot-scope="scope">   
          <el-row :class="['bdbottom',i1 == 0?'bdtop':'','rowCenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id"> 
      
            <!--渲染一级权限-->
            <el-col :span='5'>
              <el-tag>{{item1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!--渲染二和三级权限-->
            <el-col :span='19'>
              <!--嵌套循环-->
              <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="[i2 == 0 ?'':'bdtop','rowCenter']">
                <el-col :span='6'>
                  <el-tag type="success">
                    {{item2.authName}}
                  </el-tag>
                   <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag v-for="(item3, i3) in item2.children" :key="item3.id" type="warning" closable @close="removeRightByid(scope.row, item3.id)">{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>  
          </template>
      </el-table-column>

      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
        <el-button type='primary' icon="el-icon-edit">编辑</el-button>                      
        <el-button type='danger' icon="el-icon-delete">删除</el-button>                      
        <el-button type='warning' icon="el-icon-share" @click="setRightsdialogVisiblel(scope.row)">分配权限</el-button>                      
        </template>
      </el-table-column>
    </el-table>

</el-card>

<!--分配权限对话框-->
<el-dialog
  @close="setCloseDefKeys"
  title="分配权限"
  :visible.sync="setRightsdialogVisible"
  width="30%">
  <!--树形控件-->
  <el-tree default-expand-all
   node-key="id"
    show-checkbox
     :data="rightList" 
     :props="treeProps"
     :default-checked-keys="defKeys"
     ref="treeRef"
     ></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightsdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allToRights">确 定</el-button>
  </span>
</el-dialog>

  </div>  
</template>

<script>
export default {
  name:'roles',
  data() {
    return {
      rolesList:[],
      setRightsdialogVisible:false,
      //权限数据
      rightList:[],
      //树形控件的绑定对象
      treeProps:{
        label: 'authName',
        children:'children'
      },
       //默认选中的节点id值数组
        defKeys:[],
        //当前分配角色id
        roleId:''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList(){
     const{data: res} = await this.$http.get('roles')
     if(res.meta.status !== 200) return this.$message.error('获取角色列表失败')
     //console.log(res);
     this.rolesList = res.data
    },
    //根据id删除对应的权限
    async removeRightByid(role, rightId){
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'}).catch(err=>err)
          if(confirmResult !== 'confirm') return this.$message.info('已经取消删除')
          //发起删除请求
        const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if(res.meta.status !== 200) return this.$message.error('删除失败')
       // this.getRolesList()
       role.children = res.data
    },
    //显示分配权限对话框
   async setRightsdialogVisiblel(role){
     this.roleId = role.id
     //获取所有权限列表
      const {data: res} = await this.$http.get('rights/tree')
      //console.log(res);
      if(res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.rightList = res.data
      //递归调用
      this.getLeafKeys(role, this.defKeys)
      this.setRightsdialogVisible = true
    },
    //通过递归的形式，获取角色下所有的三级权限的id，并保存到defKeys中
    getLeafKeys(node, array){
      if(!node.children){
        return array.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, array)
      })
    },
    setCloseDefKeys(){
      this.defKeys = []
    },
    //点击为角色分配对话框
   async allToRights(){
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
   const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})
     if(res.meta.status !== 200) return this.$message.error('获取分配权限失败')
     this.$message.success('分配权限成功')
     this.getRolesList()
     this.setRightsdialogVisible = false
    }
  },

}
</script>

<style scoped>
.el-tag{
  margin: 6px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom:1px solid #eee ;
}
.rowCenter{
  display: flex;
  align-items: center;
}
</style>