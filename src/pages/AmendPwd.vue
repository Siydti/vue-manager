<template>
  <div>
    <h2>修改密码</h2>
    <div class="input_div">
      <p>
        <span>原密码</span>
        <el-input v-model="oldPwd" show-password></el-input>
      </p>
      <p>
        <span>新密码</span>
        <el-input v-model="newPwd" show-password></el-input>
      </p>
      <p>
        <span>确认新密码</span>
        <el-input v-model="newPwdAff" show-password></el-input>
      </p>
      <p v-show="show" class="errmasg_p">
        <span></span>
        两次密码不一致
      </p>
      <p>
        <span></span>
        <el-button type="primary" @click="editpwd_btn">确定</el-button>
        <el-button plain @click="reset_btn">重置</el-button>
      </p>
    </div>
  </div>
</template>

<script>
import { checkoldpwd, editpwd } from "@/api/apis";

export default {
  data() {
    return {
      oldPwd: "",
      newPwd: "",
      newPwdAff: "",
      show: false,
    };
  },
  methods: {
    editpwd_btn() {
      checkoldpwd(this.oldPwd, localStorage.id).then((res) => {
        if (res.data.code == 0) {
          if (this.newPwd !== this.newPwdAff) {
            this.show = true;
          } else {
            editpwd(this.newPwd, localStorage.id).then((res) => {
              if (res.data.code == 0) {
                this.$message({
                  message:"密码修改成功，请重新登录···",
                  type: "success",
                });

                window.setTimeout( () => {
                  this.$router.push('/')
                } ,2000) 
              }
            });
          }
        } else {
          this.$message.error("原密码错误！");
        }
      });
    },
    reset_btn() {
      this.oldPwd = "";
      this.newPwd = "";
      this.newPwdAff = "";
    }
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
.input_div > p {
  display: flex;
  align-items: center;
  margin: 20px 0px;
  font-size: 14px;
  > span {
    width: 90px;
    text-align: right;
    margin-right: 15px;
  }
  .el-input {
    width: 215px;
  }
}
.errmasg_p{
  color: tomato;
  font-size: 12pxF;
}
</style>