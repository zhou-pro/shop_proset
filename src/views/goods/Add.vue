<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区-->
    <el-card>
      <!--警告区-->
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        center
        :closable="false"
      >
      </el-alert>

      <!--步骤条区-->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!--tab栏区域-->
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabsLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price" type="num">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader 
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <!--复选框组-->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>

          <!--上传图片-->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
            :on-success="handleSuccess"
            :headers="headerObj"
              class="upload-demo"
              :action="upLoadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>

          <el-tab-pane label="商品内容" name="4">
            <!--富文本编辑器组件-->
            <quill-editor v-model="addForm.goods_introduce">
            </quill-editor>
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!--图片预览-->
    <el-dialog
  title="图片预览"
  :visible.sync="previewVisible"
  width="50%"
>
  <img :src="previewPath" alt="" class="previewimg">
</el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: "Add",
  data() {
    return {
      activeIndex: "0",
      //商品分类列表
      cateList: [],
      //添加表单数据对象
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        //商品分类的所属数组
        goods_cat: [],
        //图片数组
        pics: [],
        //商品详情
        goods_introduce:'',
        attrs: []
      },
        upLoadURL:'https://www.liulongbin.top:8888/api/private/v1/upload',
        //图片上传组件的请求头
        headerObj:{
          Authorization:window.sessionStorage.getItem('token')
        },
        previewPath: '',
        previewVisible:false,
      //动态参数列表
      manyTableData: [],
      //静态属性列表
      onlyTableData: [],
      cateProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      addFormrules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请输入商品分类", trigger: "blur" },
        ],
      },
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获取所有商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      //console.log(res);
      if (res.meta.status !== 200)
        return this.message.error("获取分类数据失败");
      //console.log(res)

      this.cateList = res.data
    },
    //级联选择器选项变化触发
    handleChange() {
      console.log(this.addForm.goods_cat)
      //选中的不是三级分类
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabsLeave(activeName, oldActiveName) {
      if (activeName !== "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类！")
        return false
      }
    },
    //tabs点击事件
    async tabClicked() {
      //console.log(this.activeIndex);
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" },
          }
        );
        if (res.meta.status !== 200)
          return this.$message.error("获取动态参数数据失败");
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ")
        });
        console.log(res)
        this.manyTableData = res.data
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" },
          }
        );
        if (res.meta.status !== 200)
          return this.$message.error("获取静态属性数据失败")
                 this.onlyTableData = res.data
        
      }
    },
    //处理图片预览效果
    handlePreview(file){
     this.previewPath = file.response.data.url
     this.previewVisible = true
    },
    //处理移除图片的操作
    handleRemove(file){
        const filePath = file.response.data.tmp_path
      const i =  this.addForm.pics.findIndex(x => {
          x.pic === filePath
        })
        this.addForm.pics.splice(i, 1)
    },
    //图片上传成功的回调
    handleSuccess(response){
      console.log(response)
      //拼接一个数组对象
      const picInfo = {
        pic: response.data.tmp_path
      }
      //将图片信息push到pics数组中去
      this.addForm.pics.push(picInfo)
    },
    //添加商品
    addGoods(){
      this.$refs.addFormRef.validate(async vali => {
        if(!vali){
          return this.$message.error('请填写必要的表单项')
        }
        //lodash深拷贝
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        //处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        //处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)
        //发起请求
        const {data: res} = await this.$http.post('goods', form)
        if(res.meta.status !== 201) return this.$message.error('创建商品失败')
        this.$message.success('创建商品成功')
        this.$router.push('/goods')
        this.getCateList()
      })
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
}
</script>

<style scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewimg{
  width: 100% !important;
}
.el-button{
  margin-top: 10px;
}
</style>