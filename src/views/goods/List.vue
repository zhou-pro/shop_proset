<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @clear="getGoodsList">
                <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                  </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!--table表格区-->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="100px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="100px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="190px">
          <template slot-scope="scope">   
            {{scope.row.add_time | dateFormat}}         
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">         
            <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
          <el-button type="danger" size='mini' icon="el-icon-delete" @click="removeById(scope.row.goods_id)"></el-button>
            
          </template>
        </el-table-column>
      </el-table>

      <!--分页区-->
       <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[4, 6, 8, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total" background>
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name:'List',
  data() {
    return {
      queryInfo:{
        query:'',
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [],
      total: 0
      
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    //根据分页获取对应的商品列表
   async getGoodsList(){
     const {data: res} = await this.$http.get('goods',{params:this.queryInfo})
     if(res.meta.status !== 200) return this.$message.error('获取商品列表失败')
    // this.$message.success('获取商品列表成功')
     this.goodsList = res.data.goods
     this.total = res.data.total
     console.log(res);
    },
    //监听pagesize的改变
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    //监听页码的改变
    handleCurrentChange(newNum){
      this.queryInfo.pagenum = newNum
      this.getGoodsList()

    },
    //根据ID删除商品
   async removeById(id){
    const confirmResult = await  this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(confirmResult !== 'confirm') return this.$message.info('已取消删除')
        //发送删除请求
      const {data: res} = await this.$http.delete(`goods/${id}`)
      if(res.meta.status !== 200) return this.$message.error('删除商品失败')
      this.$message.success('删除商品成功')
      this.getGoodsList()
    //console.log(res);
    },
    //条状到添加商品页面
    goAddPage(){
      this.$router.push('/goods/add')
    }
    
  },

}
</script>

<style scoped>

</style>