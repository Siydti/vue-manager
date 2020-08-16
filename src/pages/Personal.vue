<template>
  <div>
    <p style="font-siza:18px;">管理员信息</p>
    <p>管理员ID：{{ id }}</p>
    <p>账户： {{ account }}</p>
    <p>用户组： {{ userGroup }}</p>
    <p>创建时间：{{ctime }}</p>
    <p>
      管理员头像：
      <span>
        <el-upload
          class="avatar-uploader"
          action="http://127.0.0.1:5000/users/avatar_upload"
          :on-success="handleAvatarSuccess"
          :data="dataid"
        >
          <img :src="imgUrl" v-if="imgUrl" class="headimg" />
        </el-upload>
      </span>
    </p>
  </div>
</template>

<script>
//接口
import { accountinfo } from "@/api/apis";

//中国区时间
import { getChinaTime } from "@/utils/gettime";
export default {
  data() {
    return {
      id: "",
      account: "",
      userGroup: "",
      ctime: "",
      imgUrl: "",
      dataid: {},
    };
  },
  created() {
    accountinfo(localStorage.id).then((res) => {
      for (let key in res.data.accountInfo) {
        this[key] = res.data.accountInfo[key];
      }
      this.ctime = getChinaTime(this.ctime);
    });
    this.dataid = { id: localStorage.id };
  },
  methods: {
    handleAvatarSuccess(res) {
      //发送bus通知
      this.$bus.$emit("headimgchange", res.imgUrl);

      this.imgUrl = "http://127.0.0.1:5000/upload/imgs/acc_img/" + res.imgUrl;
    },
  },
};
</script>

<style lang="less" scoped>
p {
  font-size: 16px;
  line-height: 60px;
  border-bottom: 2px solid #f2f3f6;
  > span {
    display: inline-block;
    border: 1px solid #ccc;
    margin: 10px;
  }
}
.headimg {
  width: 200px;
  height: 200px;
}

.avatar-uploader {
  width: 200px;
  height: 200px;
}
</style>