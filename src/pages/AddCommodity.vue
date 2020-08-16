<template>
  <div>
    <h2>添加商品</h2>
    <div class="main_div">
      <p>
        <span>商品名称</span>
        <el-input placeholder="商品名称" v-model="name" clearable></el-input>
      </p>
      <p>
        <span>商品分类</span>
        <el-select v-model="category" placeholder="商品分类">
          <el-option
            v-for="item in options"
            :key="item.cateName"
            :label="item.cateName"
            :value="item.cateName"
          ></el-option>
        </el-select>
      </p>
      <p>
        <span>商品价格</span>
        <el-input-number
          v-model="price"
          controls-position="right"
          :min="0.01"
          :precision="2"
          :step="0.01"
        ></el-input-number>
      </p>
      <p>
        <span>商品图片</span>
        <el-upload
          action="http://127.0.0.1:5000/goods/goods_img_upload"
          list-type="picture-card"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img :src="'http://127.0.0.1:5000/upload/imgs/goods_img/' + imgUrl" v-if="imgUrl" />
          <i class="el-icon-plus" v-else></i>
        </el-upload>
      </p>
      <p>
        <span>商品描述</span>
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="goodsDesc"></el-input>
      </p>
      <p>
        <span></span>
        <el-button type="primary" @click="goodsadd_btn">添加商品</el-button>
      </p>
    </div>
  </div>
</template>

<script>
//接口
import { categories, goodsadd } from "@/api/apis";

export default {
  data() {
    return {
      name: "",
      options: [],
      price: 1,
      imgUrl: "",
      goodsDesc: "",
      category: "",
    };
  },
  methods: {
    handleAvatarSuccess(res) {
      // console.log( res.imgUrl )
      this.imgUrl = res.imgUrl;
    },
    goodsadd_btn() {
      this.price = String(this.price);

      goodsadd(
        this.name,
        this.category,
        this.price,
        this.imgUrl,
        this.goodsDesc
      ).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            message: "添加成功，请前往商品列表查看",
            type: "warning",
          });
        } else {
          this.$message({
            message: "添加失败，请稍后再试",
            type: "warning",
          });
        }
      });
    },
  },
  created() {
    categories().then((res) => {
      this.options = res.data.categories;
      this.category = this.options[0];
    });
  },
};
</script>

<style lang="less" scoped>
h2 {
  font-weight: normal;
  font-size: 16px;
  text-indent: 10px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f2f5;
}
.main_div {
  > p {
    display: flex;
    align-items: center;
    margin: 20px 0px;
    font-size: 14px;
    > span {
      width: 80px;
      text-align: right;
      padding-right: 20px;
    }
    .el-input,
    .el-textarea {
      width: 300px;
    }
    .el-input-number {
      width: 120px;
    }
  }
  img {
    width: 146px;
    height: 146px;
  }
}
</style>