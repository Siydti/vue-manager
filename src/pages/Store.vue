<template>
  <div class="centent">
    <div class="top">
      <h2>店铺管理</h2>
      <el-button type="primary" v-show="isshow" @click="modification">编 辑</el-button>
      <el-button type="success" v-show="!isshow" @click="edit">保 存</el-button>
    </div>

    <div class="main">
      <el-form ref="form" :model="form">
        <p>
          <span>店铺名称</span>
          <el-input v-model="form.name" clearable :disabled="isshow"></el-input>
        </p>
        <p>
          <span>店铺公告</span>
          <el-input v-model="form.bulletin" clearable type="textarea" :disabled="isshow" :rows="7"></el-input>
        </p>
        <p>
          <span>店铺头像</span>
          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:5000/shop/upload"
            :show-file-list="false"
            :on-success="headAvatarSuccess"
            :disabled="isshow"
          >
            <img :src="form.avatar" class="avatar" />
          </el-upload>
        </p>
        <!-- <p>
          <span>店铺照片</span>
          <el-avatar shape="square" :size="100" :src="item" v-for="item in form.pics" :key="item"></el-avatar>
        </p>-->
        <p>
          <span>店铺照片</span>
          <el-upload
            action="http://127.0.0.1:5000/shop/upload"
            list-type="picture-card"
            :on-success="picsAvatarSuccess"
            :on-remove="picsAvatarRemove"
            :disabled="isshow"
            :file-list="fileList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog>
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </p>
        <p>
          <span>配送费</span>
          <el-input-number v-model="form.deliveryPrice" :min="0" :disabled="isshow"></el-input-number>
        </p>
        <p>
          <span>配送时间</span>
          <el-input-number v-model="form.deliveryTime" :min="0" :disabled="isshow"></el-input-number>
        </p>
        <p>
          <span>配送描述</span>
          <el-input v-model="form.description" clearable :disabled="isshow"></el-input>
        </p>
        <p>
          <span>店铺评分</span>
          <el-rate
            v-model="form.score"
            :disabled="isshow"
            show-score
            text-color="#ff9900"
            score-template="{value}"
          ></el-rate>
        </p>
        <p>
          <span>销量</span>
          <el-input-number v-model="form.sellCount" :min="0" :disabled="isshow"></el-input-number>
        </p>
        <p>
          <span>活动</span>
          <el-checkbox-group v-model="form.supports" :disabled="isshow">
            <el-checkbox label="在线支付满28减5"></el-checkbox>
            <el-checkbox label="VC无限橙果汁全场8折"></el-checkbox>
            <el-checkbox label="单人精彩套餐"></el-checkbox>
            <el-checkbox label="特价饮品8折抢购"></el-checkbox>
            <el-checkbox label="单人特色套餐"></el-checkbox>
          </el-checkbox-group>
        </p>
        <p>
          <span>营业时间</span>
          <el-time-picker
            is-range
            v-model="form.date"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            :disabled="isshow"
          ></el-time-picker>
        </p>
        <p>
          <span>起送价格</span>
          <el-input-number v-model="form.minPrice" :min="0" :disabled="isshow"></el-input-number>
        </p>
      </el-form>
    </div>
  </div>
</template>

<script>
//引入接口
import { shopinfo , shopedit } from "@/api/apis";

//引入中国区时间
import { getChinaTime } from "@/utils/gettime";

//图片地址
let locimgurl = "http://127.0.0.1:5000/upload/shop/";

export default {
  data() {
    return {
      isshow: true,
      form: {
        name: "", //店铺名称
        bulletin: "", //公告
        avatar: "", //店铺头像
        pics: [], //店铺照片
        deliveryPrice: "", //配送费
        deliveryTime: "", //配送时间
        description: "", //描述
        score: 0, //评分
        sellCount: "", //销量
        supports: [], //活动
        date: null, //营业时间
        minPrice: "", //起送价格
      },
      dialogImageUrl: "",
      fileList: [], //店铺图片
    };
  },
  methods: {
    //编辑按钮
    modification() {
      this.isshow = false;
    },
    //修改按钮
    edit() {
      this.$confirm("此操作将永久修改店铺信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let obj = { ...this.form };

        obj.date = JSON.stringify([
          getChinaTime(obj.date[0]),
          getChinaTime(obj.date[1]),
        ]);

        var avatarindex = obj.avatar.lastIndexOf("/");
        obj.avatar = obj.avatar.slice(avatarindex + 1);

        obj.pics = JSON.stringify(obj.pics);

        obj.supports = JSON.stringify(obj.supports);

          shopedit(obj).then((res) => {
            console.log(res);
            if (res.data.code == 0) {
              this.$notify({
                title: "成功",
                message: "恭喜您，修改成功",
                type: "success",
              });

              this.isshow = true;
            } else {
              this.$notify({
                title: "警告",
                message: "修改失败，请稍后再次尝试",
                type: "warning",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消修改",
          });

          this.isshow = true;
      });
    },
    //头像上传
    headAvatarSuccess(file) {
      this.form.avatar = locimgurl + file.imgUrl;
    },
    //照片上传
    picsAvatarSuccess(res) {
      this.form.pics.push( res.imgUrl )
      },
    //照片删除
    picsAvatarRemove(res) {
      if( 'response' in res ){
        this.form.pics.splice( this.form.pics.indexOf( res.response.imgUrl ) , 1 )
      }else{
         this.form.pics.splice( this.form.pics.indexOf( res.name ), 1 )
      }

    },
  },
  created() {
    shopinfo().then((res) => {
      
      res.data.data.avatar = locimgurl + res.data.data.avatar;

      this.form = res.data.data;

      this.fileList = res.data.data.pics.map(item => {
        return {
          name : item , 
          url : locimgurl + item,
        }
      });
    });
  },
};
</script>

<style lang="less" scoped>
p {
  margin: 0;
}
.centent {
  margin: 10px 5px 10px 10px;
  border-radius: 5px;
  padding: 0px 10px;
  .top {
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    margin-bottom: 3px;
    margin-bottom: 30px;
    h2 {
      font-size: 18px;
      font-weight: normal;
    }
  }

  .main {
    background-color: #fff;
    padding: 10px 0px 20px 15px;
    .el-form {
      > p {
        display: flex;
        min-height: 50px;
        padding: 10px 0px;
        line-height: 30px;
        font-size: 14px;
        > span {
          width: 90px;
          text-align: right;
          margin-right: 15px;
        }
        > .el-input {
          height: 30px;
          width: 400px;
        }
        > .el-textarea {
          width: 600px;
        }
      }
    }
  }
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader-icon[data-v-539f8c61] {
  border: 1px solid #ccc;
}
</style>