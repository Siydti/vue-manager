<template>
  <el-container>
    <!-- 侧栏 -->
    <el-aside width="200px">
      <h1 style="color:#fff;text-align:center;margin:20px 0px">外卖商家中心</h1>

      <el-menu
        :default-active="activepage"
        class="el-menu-vertical-demo"
        background-color="#304156"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
        unique-opened
      >
        <!-- 循环 -->
        <div v-for="item in power" :key="item.url">
          <el-menu-item :index="item.url" v-if=" !item.children ">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>

          <el-submenu :index="item.url" v-else>
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{ item.name }}</span>
            </template>

            <el-menu-item
              :index="child.url"
              v-for="child in item.children"
              :key="child.url"
            >{{ child.name }}</el-menu-item>
          </el-submenu>
        </div>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 顶栏 -->
      <el-header>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="item in breadcrumblist" :key="item">{{ item }}</el-breadcrumb-item>
        </el-breadcrumb>
        <div @click="like_div" class="personal">
          欢迎您 - {{ name }}
          <span class="headimg_span">
            <img :src="imgUrl" />
          </span>
        </div>
      </el-header>

      <el-main>
        <el-card class="box-card">
          <!--  变更内容  -->
          <router-view></router-view>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { checktoken, accountinfo } from "@/api/apis";

export default {
  data() {
    return {
      name: "请登录",
      powerlist: [
        {
          url: "/index",
          icon: "el-icon-house",
          name: "后台首页",
          power: ["super", "normal"],
        },
        {
          url: "/index/OrderManagement",
          icon: "el-icon-document",
          name: "订单管理",
          power: ["super", "normal"],
        },
        {
          url: "1",
          icon: "el-icon-shopping-bag-1",
          name: "商品管理",
          children: [
            { url: "/index/commodityList", name: "商品列表" },
            { url: "/index/addCommodity", name: "商品添加" },
            { url: "/index/classify", name: "商品分类" },
          ],
          power: ["super", "normal"],
        },
        {
          url: "/index/store",
          icon: "el-icon-s-promotion",
          name: "店铺管理",
          power: ["super"],
        },
        {
          url: "2",
          icon: "el-icon-user",
          name: "账号管理",
          children: [
            { url: "/index/userList", name: "账号列表" },
            { url: "/index/adduser", name: "添加账号" },
            { url: "/index/amendPwd", name: "修改密码" },
          ],
          power: ["super"],
        },
        {
          url: "3",
          icon: "el-icon-pie-chart",
          name: "销售统计",
          children: [
            { url: "/index/commodity", name: "商品统计" },
            { url: "/index/orderform", name: "订单统计" },
          ],
          power: ["super"],
        },
      ],
      imgUrl: "",
      activepage: "/index",
      breadcrumblist: [] ,
    };
  },

  methods: {
    like_div() {
      this.$router.push("/index/personal");
    },
  },

  created() {
    //aside修复
    this.activepage = this.$route.path;
    //初始化给二级导航赋值
    this.breadcrumblist = this.$route.meta.containerheader

    //验证token是否过期
    checktoken(localStorage.token).then((res) => {
      // console.Flog(res.data.code);
      if (res.data.code == 0) {
        this.name = localStorage.name;

        //获取头像
        accountinfo(localStorage.id).then((res) => {
          this.imgUrl = res.data.accountInfo.imgUrl;
        });
      } else {
        this.name = "请登录";
      }
    });

    //监听bus的传递事件
    this.$bus.$on("headimgchange", (imgUrl) => {
      this.imgUrl = "http://127.0.0.1:5000/upload/imgs/acc_img/" + imgUrl;
    });
  },

  computed: {
    //权限
    power() {
      return this.powerlist.filter((item) =>
        item.power.includes(localStorage.role)
      );
    },
  },

  //监听属性
  watch:{
      $route( to ) {
        this.breadcrumblist = to.meta.containerheader
      }
  }
};
</script>

<style lang="less">
@import url("../assets/fonts/iconfont.css");
@backAside: #304156;
@backHeader: #fff;
@backMain: #f0f2f5;

* {
  margin: 0;
  padding: 0;
}
html,
body {
  height: 100%;
}

.el-container {
  height: 100%;
}
.el-header {
  background-color: @backHeader;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid @backMain;
}

.el-aside {
  background-color: @backAside;
}

.el-main {
  background-color: @backMain;
}

.el-menu {
  border-right: none !important;
}

.headimg_span > img {
  width: 50px;
  height: 50px;
  margin: 5px;
  border-radius: 50%;
}

.personal{
  display: flex;
  align-items: center;
}
</style>
