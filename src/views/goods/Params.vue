<template>
<div>
  <!--面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

  <!--卡片视图区-->
  <el-card>
    <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false" show-icon></el-alert>

    <!--选择商品分类区-->
    <el-row class="choose_row">
      <el-col>
        <span>选择商品分类： </span>

        <!--选择商品的级联选择框-->
         <el-cascader
    v-model="selectCateKeys"
    :options="allCateList"
    :props="cateProps"
    @change="handleChange"></el-cascader>
      </el-col>
    </el-row>

    <!--页签区-->
     <el-tabs v-model="activeName" @tab-click="handleTabClick">

    <el-tab-pane label="动态参数" name="many">
      <el-button type="primary" size="mini" :disabled="isButtonDisabled" @click="addDialogVisible=true"> 添加参数</el-button>
      
      <!--动态参数表格-->
      <el-table :data="manyTableData" border stripe>
        <!--展开行-->
        <el-table-column type='expand'>
             <!--循环渲染tag标签-->     
            <template slot-scope="scope">           
              <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">
                  {{item}}
              </el-tag>
              <!--输入文本框-->
               <el-input
  class="input-new-tag"
  v-if="scope.row.inputVisible"
  v-model="scope.row.inputValue"
  ref="saveTagInput"
  size="small"
  @keyup.enter.native="handleInputConfirm(scope.row)"
  @blur="handleInputConfirm(scope.row)">
</el-input>

<!--添加按钮-->
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
            </template>

        </el-table-column>
        <el-table-column type='index' label="#"></el-table-column>
        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">        
              <el-button size="mini" icon="el-icon-edit" type="primary" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>            
              <el-button size="mini" icon="el-icon-delete" type="danger" @click="removeParams(scope.row.attr_id)">删除</el-button>            
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>

    <el-tab-pane label="静态属性" name="only">
     <el-button type="primary" size="mini" :disabled="isButtonDisabled" @click="addDialogVisible=true"> 添加属性</el-button>
     
      <!--静态属性表格-->
      <el-table :data="onlyTableData" border stripe>
        <!--静态属性展开行-->
         <el-table-column type='expand'>
             <!--循环渲染tag标签-->     
            <template slot-scope="scope">           
              <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">
                  {{item}}
              </el-tag>
              <!--输入文本框-->
               <el-input
  class="input-new-tag"
  v-if="scope.row.inputVisible"
  v-model="scope.row.inputValue"
  ref="saveTagInput"
  size="small"
  @keyup.enter.native="handleInputConfirm(scope.row)"
  @blur="handleInputConfirm(scope.row)">
</el-input>

<!--添加按钮-->
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
            </template>

        </el-table-column>
        <el-table-column type='index' label="#"></el-table-column>
        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope"> 
             
              <el-button size="mini" icon="el-icon-edit" type="primary" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>            
              <el-button size="mini" icon="el-icon-delete" type="danger" @click="removeParams(scope.row.attr_id)">删除</el-button>            
          </template>
        </el-table-column>
      </el-table>
      </el-tab-pane>
  </el-tabs>
  </el-card>

  <!--添加参数的对话框-->
  <el-dialog
  @close="addFormclosed"
  :title=" '添加' + textTitle"
  :visible.sync="addDialogVisible"
  width="30%"
  >

 <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
  <el-form-item :label="textTitle" prop="attr_name">
    <el-input v-model="addForm.attr_name"></el-input>
  </el-form-item>
  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
</el-dialog>

  <!--修改参数的对话框-->
  <el-dialog
  @close="editFormclosed"
  :title=" '修改' + textTitle"
  :visible.sync="editDialogVisible"
  width="30%"
  >

 <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
  <el-form-item :label="textTitle" prop="attr_name">
    <el-input v-model="editForm.attr_name"></el-input>
  </el-form-item>
  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
</el-dialog>
</div>
  
</template>

<script>
export default {
  name: 'Params',
  data() {
    return {
      //所有商品分类列表
      allCateList:[],
      //级联选择框配置
      cateProps:{
        expandTrigger: 'hover' ,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'

      },
      //级联选择框双向绑定的数组
      selectCateKeys:[],
      activeName:'many',
      //动态参数数据
      manyTableData:[],
      //静态参数数据
      onlyTableData:[],
      addDialogVisible:false,
      editDialogVisible: false,
      addForm:{
        attr_name:''
      },
      addFormRules:{
         attr_name: [
            { required: true, message: '请输入参数名称', trigger: 'blur' },
            { min: 1, max: 8, message: '长度在 1 到 8个字符', trigger: 'blur' }
          ],
      },
      editForm:{
        attr_name:''
      },
      editFormRules:{
        attr_name: [
            { required: true, message: '请输入参数名称', trigger: 'blur' },
            { min: 1, max: 8, message: '长度在 1 到 8个字符', trigger: 'blur' }
          ],
      }
      
    }
  },
  created() {
    this.getAllCateList()
    
  },
  methods: {
    //获取所有商品分类列表
   async getAllCateList(){
    const {data: res} = await this.$http.get('categories')
    if(res.meta.status !==200) return this.$message.error('获取分类用户列表失败')
    this.allCateList = res.data

    },
    //级联选择框发生改变触发
    handleChange(){
      this.getParamsData()

    },
    //tab页点击事件的处理函数
    handleTabClick(){
      //console.log(this.activeName);
      this.getParamsData()
    },
    //获取列表数据的回调
   async getParamsData(){
      //证明选中的不是三级分类
      if(this.selectCateKeys.length !== 3){
        this.selectCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      //console.log(this.selectCateKeys);
    const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
        params:{sel: this.activeName}
        })
        //console.log(res);
        if(res.meta.status !== 200){
          return this.$message.error('获取数据失败')
        }
       
       res.data.forEach(item => {
       item.attr_vals = item.attr_vals ? item.attr_vals.split(' '):[]
       //控制文本框的显示与隐藏
       item.inputVisible = false
       //文本框输入的值
       item.inputValue = ''
       })

       console.log(res)
        if(this.activeName === 'many'){
          this.manyTableData = res.data
        }else{
          this.onlyTableData = res.data
        }
    },
    addFormclosed(){
      this.$refs.addFormRef.resetFields()
    },
    //添加参数
  addParams(){
   this.$refs.addFormRef.validate(async vali => {
        if(!vali) return
   const {data: res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
       // console.log(res);
        if(res.meta.status !== 201) return this.$message.error('添加列表数据失败')
        this.$message.success('添加数据成功')
        this.getParamsData()
        this.addDialogVisible = false
      })
    },
    //显示修改对话框
   async showEditDialog(attr_id){
    const{data: res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{
        params:{ attr_sel: this.activeName}
      })
      //console.log(res);
      if(res.meta.status !== 200) return this.$message.error('获取参数信息失败')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    //重置修改表单
    editFormclosed(){
      this.$refs.editFormRef.resetFields()
    },
    //点击修改参数
    editParams(){
      this.$refs.editFormRef.validate( async vali => {
        if(!vali) return
      const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
        {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        if(res.meta.status !== 200) return this.$message.error('修改参数失败')
        this.$message.success('修改参数成功')
        this.getParamsData()
        this.editDialogVisible = false
      })

    },
    //删除参数的回调
   async removeParams(attr_id){
     const confirmResult = await  this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(confirmResult !== 'confirm'){
          return this.$message.info('已取消删除')
        }
        //删除的业务逻辑
       const {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
       if(res.meta.status !== 200) return this.$message.error('删除参数失败')
        this.$message.success('删除参数成功')
        this.getParamsData()
    },
    //文本框失去焦点，或者按下Enter触发
    handleInputConfirm(row){
      if(row.inputValue.trim().length === 0){
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      //输入内容，添加参数，后续操作
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      //发起请求保存这次操作
      this.saveAttrvals(row)
    },
    //点击按钮显示文本框
    showInput(row){
      row.inputVisible = true
       this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
        


    },
    //封装的保存数据方法
   async saveAttrvals(row){
       //发起请求保存这次操作
    const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name: row.attr_name,
        attr_sel: this.activeName,
        attr_vals: row.attr_vals.join(' ')
      })
      if(res.meta.status !== 200) return this.$message.error('修改参数失败')
      this.$message.success('修改参数成功')
    },
    //删除对应的数据可选项
    handleClose(i, row){
      row.attr_vals.splice(i, 1)
      this.saveAttrvals(row)
    }
    
  },
  computed:{
    //控制按钮是否被禁用
    isButtonDisabled(){
      return this.selectCateKeys.length !== 3
    },
    //当前三级分类的Id
    cateId(){
      if(this.selectCateKeys.length === 3){
        return this.selectCateKeys[2]
      }
      return null
    },
    //动态计算标题的文本
    textTitle(){
      if(this.activeName === 'many'){
        return '动态参数'
      }
       return '静态属性'
    }
   
  }

}
</script>

<style scoped>
.choose_row{
  margin: 10px 0;
}
.el-tag{
  margin: 10px;
}
.input-new-tag{
  width: 120px;
}

</style>