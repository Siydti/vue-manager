<template>
  <div id="bac_div">
    <div class="login_div">
      <h2>系统登录</h2>
      <p>
        <el-input v-model="account" clearable prefix-icon="el-icon-user-solid"></el-input>
      </p>
      <p>
        <el-input v-model="password" show-password prefix-icon="el-icon-lock"></el-input>
      </p>
      <p class="errmsg_p" v-show="show">"登录失败，请检查用户名或密码"</p>
      <p>
        <el-button type="primary" @click="click_href">登 录</el-button>
      </p>
    </div>
  </div>
</template>

<script>
import { checkLogin } from "@/api/apis";

export default {
  data() {
    return {
      account: "",
      password: "",
      show: false,
    };
  },
  methods: {
    click_href() {
      // console.log(111);

      checkLogin(this.account, this.password).then((res) => {
        // console.log(res.code)
        // console.log(res)
        if (res.data.code == 0) {
          //储存
          localStorage.token = res.data.token;
          localStorage.role = res.data.role;
          localStorage.name = this.account;
          localStorage.id = res.data.id;

          this.$router.push("/index");

          //成功提示
          this.$notify({
            title: "欢迎您 " + this.account,
            // message: "欢迎您 " + this.account ,
            type: "success",
          });
        } else {
          this.show = true;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
@bacbac: #2d3a4b;

#bac_div {
  background-color: @bacbac;
  height: 100%;
  .login_div {
    width: 500px;
    height: 240px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    h2 {
      color: #fff;
      font-size: 20px;
      text-align: center;
    }
    p {
      margin: 20px;

      .el-button {
        width: 100%;
      }
    }
    .errmsg_p {
      text-align: center;
      color: tomato;
      font-size: 12px;
    }
  }
  /deep/input {
    background-color: transparent;
    color: #fff;
  }
}
</style>