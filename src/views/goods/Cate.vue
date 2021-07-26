<template>
<div>
  <!--面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type='primary' @click="isAddCatdialogVisible">
            添加商品
          </el-button>
        </el-col>
      </el-row>
      <!--表格区-->
      <tree-table
      class="tree" 
       stripe
       border
       index-text="#"
       show-index
       :expand-type="false"
       :data="cateList"
       :columns="columns"
       :selection-type="false">
       <!--第一个模板-->
       <template slot-scope="scope" slot="isok">      
           <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
           <i class="el-icon-error" v-else style="color: red"></i>         
       </template>

    <!--排序-->
    <template slot="order" slot-scope="scope">
         <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
         <el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
         <el-tag type="warning" v-else>三级</el-tag>    
    </template>

    <!--操作列-->
    <template slot-scope="scope" slot="control">
    <el-button type="primary" icon="el-icon-edit">编辑</el-button>
    <el-button type="danger" icon="el-icon-delete">删除</el-button>
      </template>
      </tree-table>

      <!--分页区-->
       <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[4, 6, 8, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>

    <!--添加分类的对话框-->
    <el-dialog
    @close="addCateClose"
  title="添加分类"
  :visible.sync="addCatdialogVisible"
  width="50%">

<!--添加表单分类区-->
  <el-form :model="addCatForm" :rules="addCatFormRules" ref="addCateFormRef" label-width="100px" class="demo-ruleForm">
  
  <el-form-item label="分类名称：" prop="cat_name">
    <el-input v-model="addCatForm.cat_name"></el-input>
  </el-form-item>

  <el-form-item label="父级分类：">
    <!--options用来指定数据源-->
    <el-cascader
    change-on-select
    clearable
    class="cascader"
    v-model="selectParentKeys"
    :options="parentList"
    :props="cascaderParentProps"
    @change="ParenthandleChange"></el-cascader>
  </el-form-item>
    </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="addCatdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>

  </div>  
</template>

<script>
export default {
  name:'Cate',
  data() {
    return {
      cateList: [],
      //查询条件
      total:0,
      //是否显示对话框
      addCatdialogVisible:false,
      columns:[
        {
          label:'分类名称',
          prop:'cat_name'
        },
        {
          label: '是否有效',
          //表示当前列定义为模板列
          type:'template',
          //表示当前列使用的模板名称
          template: 'isok'
        },
        {
          label: '排序',
          //表示当前列定义为模板列
          type:'template',
          //表示当前列使用的模板名称
          template: 'order'
        },
        {
          label: '操作',
          //表示当前列定义为模板列
          type:'template',
          //表示当前列使用的模板名称
          template: 'control'
        },
      ],
      //查询条件
      queryInfo:{
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //添加分类
      addCatForm:{
        cat_name:'',
        //父类分级的id
        cat_id: 0,
        //分类的等级，默认为一级分类
        cat_level: 0
      },
      addCatFormRules:{
        cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            { min: 1, max: 10, message: '长度在 1到 10个字符', trigger: 'blur' }
          ],
      },
      //f父级分类列表
      parentList:[],
      //指定级联选择器的配置对象
      cascaderParentProps:{
         expandTrigger: 'hover',
         value: 'cat_id',
         label: 'cat_name',
         children: 'children'
      },
      //选中父级分类的id数组
      selectParentKeys:[]
    }
  },
  created() {
    this.getCateList()
    
  },
  methods: {
    //获取商品分类数据
   async getCateList(){
     const {data: res} = await this.$http.get('categories', { params: this.queryInfo})
     //console.log(res)
     if(res.meta.status !== 200) return this.$message.error('获取商品分类失败')
     this.cateList = res.data.result
     this.total = res.data.total
    },
    //监听pagesize的改变
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    //监听pagenum的改变
    handleCurrentChange(newNum){
      this.queryInfo.pagenum = newNum
      this.getCateList()

    },
    //添加分类对话框
    isAddCatdialogVisible(){
      //先获取父级数据
      this.getParentCateList()
      this.addCatdialogVisible = true
    },
    //获取父级分类的列表
    async getParentCateList(){
     const {data: res} = await this.$http.get('categories', {params:
      { type: 2}})
      //console.log(res);
      if(res.meta.status !== 200) return this.$message.error('获取分类列表失败')
      this.parentList = res.data
    },
    ParenthandleChange(){
      //console.log(this.selectParentKeys);
      if(this.selectParentKeys.length > 0){
        this.addCatForm.cat_id = this.selectParentKeys[this.selectParentKeys.length - 1]
        this.addCatForm.cat_level = this.selectParentKeys.length
        return
     }
       this.addCatForm.cat_id = 0
        this.addCatForm.cat_level = 0

    },
    addCateClose(){
      this.$refs.addCateFormRef.resetFields()
      this.selectParentKeys = []
      this.addCatForm.cat_level = 0
      this.addCatForm.cat_name = 0

    },
    //添加分类
    addCate(){
      //console.log(this.addCatForm);
      this.$refs.addCateFormRef.validate(async vali => {
        if(!vali) return
      const {data: res} = await this.$http.post('categories',this.addCatForm)
     if(res.meta.status !== 201) return this.$message.error('添加失败')
     this.$message.success('添加成功')
     this.getCateList()
     this.addCatdialogVisible = false
      })
    }
  },

}
</script>

<style scope>
.tree{
  margin-top: 15px;
}
.cascader{
  width: 100%;
}
</style>