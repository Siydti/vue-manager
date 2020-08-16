<template>
  <div>
    <h2>添加账号</h2>
    <div class="input_div">
      <p>
        <span>账号</span>
        <el-input v-model="account" clearable></el-input>
      </p>
      <p>
        <span>密码</span>
        <el-input v-model="password" show-password></el-input>
      </p>
      <p>
        <span>用户组</span>
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in userGroup"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </p>
      <p>
        <span></span>
        <el-button type="primary" @click="useradd_btn">添加</el-button>
        <el-button plain @click="reset_btn">重置</el-button>
      </p>
    </div>
  </div>
</template>

<script>
import { usersadd } from "@/api/apis";

export default {
  data() {
    return {
      account: "",
      password: "",
      userGroup: [
        {
          value: "超级管理员",
          label: "超级管理员",
        },
        {
          value: "普通管理员",
          label: "普通管理员",
        },
      ],
      value: "",
    };
  },
  methods: {
    reset_btn() {
      this.account = "";
      this.password = "";
      this.value = "";
    },
    useradd_btn() {
      usersadd(this.account, this.password, this.value).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            message: this.account + " 此账号添加成功",
            type: "success",
          });

          this.account = "";
          this.password = "";
          this.value = "";
        }else{ 
          this.$message.error('添加失败，请稍后再试~');
        }
      });
    },
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
  > span {
    width: 70px;
    text-align: right;
    margin-right: 15px;
  }
  .el-input {
    width: 215px;
  }
}
</style>