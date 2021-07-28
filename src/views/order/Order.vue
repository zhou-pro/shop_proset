<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">订单管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区-->
    <el-card>
      <el-row>
        <el-col :span='8'>
          <el-input placeholder="请输入内容">
    <el-button slot="append" icon="el-icon-search"></el-button>
  </el-input>
        </el-col>
      </el-row>

      <!--订单列表区-->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="130px"></el-table-column>

        <el-table-column label="订单是否付款" prop="pay_status" width="130px">
          <template slot-scope="scope">       
              <el-tag v-if="scope.row.pay_status === '1'" type="success">已付款</el-tag>
              <el-tag v-else type="danger">未付款</el-tag>            
          </template>
        </el-table-column>

        <el-table-column label="是否发货" prop="is_send" width="130px"></el-table-column>

        <el-table-column label="下单时间" prop="create_time" width="180px">
          <template slot-scope="scope">    
               {{scope.row.create_time | dateFormat}}            
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">              
             <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
            <el-button type="success" icon="el-icon-delete-location" size="mini" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页区-->
      <el-pagination
      @size-change="handleOrderSizeChange"
      @current-change="handleOrderCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[4, 6, 8, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>

    <!--修改地址对话框-->
    <el-dialog
    @close="addressClosed"
  title="修改地址"
  :visible.sync="addressDialogVisible"
  width="50%"
  >
 <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px" class="demo-ruleForm">

  <el-form-item label="省市区/县" prop="address1">
  <el-cascader
    v-model="addressForm.address1"
    :options="cityData"
    :props="orderProps"
   ></el-cascader>   
  </el-form-item>

  <el-form-item label="详细地址" prop="address2">
     <el-input v-model="addressForm.address2"></el-input>
  </el-form-item>
   </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addressDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
  </span>
</el-dialog>

<!--商品进度对话框-->
<el-dialog
  title="物流进度"
  :visible.sync="ProgressdialogVisible"
  width="50%"
  >
  <!--时间线-->
  <el-timeline>
    <el-timeline-item
      v-for="(activity, index) in progressInfo"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>

  <span slot="footer" class="dialog-footer">
    <el-button @click="ProgressdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="ProgressdialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'
export default {
  name:'Order',
  data() {
    return {
      queryInfo:{
        query:'',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList:[],
      addressDialogVisible:false,
      ProgressdialogVisible:false,
      addressForm: {
        address1:[],
        address2: ''
      },
      addressFormRules:{
        address1: [
            { required: true, message: '请选择省市区/县', trigger: 'blur' },
          ],
        address2: [
            { required: true, message: '请输入详细地址', trigger: 'blur' },
          ],
      },
      cityData: cityData,
      orderProps:{
        expandTrigger: 'hover',
        children: 'children'
      },
      progressInfo: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
  async  getOrderList(){
    const {data: res} = await this.$http.get('orders', { params: this.queryInfo})
    //console.log(res)
    if(res.meta.status !== 200) return this.$message.error('获取订单列表失败')
    this.orderList = res.data.goods
    this.total = res.data.total
    },
    handleOrderSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleOrderCurrentChange(newNum){
      this.queryInfo.pagenum = newNum
      this.getOrderList()
    },
    //修改地址
    showBox(){
      this.addressDialogVisible = true
    },
    addressClosed(){
      this.$refs.addressFormRef.resetFields()
    },
    //物流进度
   async showProgressBox(){
     const {data: res} = await this.$http.get(`/kuaidi/1106975712662`)
     //console.log(res);
     if(res.meta.status !== 200) return this.$message.error('获取物流信息失败')
      this.progressInfo = res.data
      this.ProgressdialogVisible = true
    }
  },

}
</script>

<style scoped>
.el-cascader{
  width: 100%;
}
</style>