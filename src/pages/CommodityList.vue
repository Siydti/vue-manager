<template>
  <div>
    <h2>商品列表</h2>
    <div class="list_div">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="商品ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="商品名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="所属分类">
                <span>{{ props.row.category }}</span>
              </el-form-item>
              <el-form-item label="商品价格">
                <span>{{ props.row.price }}</span>
              </el-form-item>
              <el-form-item label="商品图片">
                <!-- <span>{{ props.row.imgUrl }}</span> -->
                <img :src="props.row.imgUrl" class="samllimg" />
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ props.row.ctime }}</span>
              </el-form-item>
              <el-form-item label="商品评价">
                <span>{{ props.row.rating }}</span>
              </el-form-item>
              <el-form-item label="商品销量">
                <span>{{ props.row.sellCount }}</span>
              </el-form-item>
              <el-form-item label="商品描述">
                <span>{{ props.row.goodsDesc }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="name"></el-table-column>
        <el-table-column label="所属分类" prop="category"></el-table-column>
        <el-table-column label="商品价格" prop="price"></el-table-column>
        <el-table-column label="商品图片" prop="imgUrl">
          <template slot-scope="scope">
            <img :src="scope.row.imgUrl" class="samllimg" />
          </template>
        </el-table-column>
        <el-table-column label="商品描述" prop="goodsDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="opendialog( scope.row )">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 弹框 -->
    <div>
      <el-dialog title="编辑商品" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="商品名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" :label-width="formLabelWidth">
            <el-select v-model="form.category" placeholder="请选择商品分类">
              <el-option
                v-for="item in options"
                :key="item.cateName"
                :label="item.cateName"
                :value="item.cateName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品价格" :label-width="formLabelWidth">
            <el-input-number
              v-model="form.price"
              controls-position="right"
              :min="0.01"
              :precision="2"
              :step="0.01"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="商品图片" :label-width="formLabelWidth">
            <!-- <el-input v-model="form.imgUrl" autocomplete="off"></el-input> -->
            <el-upload
              class="avatar-uploader"
              action="http://127.0.0.1:5000/goods/goods_img_upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
            >
              <img :src="form.imgUrl" />
            </el-upload>
          </el-form-item>
          <el-form-item label="商品描述" :label-width="formLabelWidth">
            <el-input v-model="form.goodsDesc" autocomplete="off" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="setfalse">取 消</el-button>
          <el-button type="primary" @click="settrue">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 分页 -->
    <div class="Pagination_div">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
//接口
import { goodslist, categories, goodsedit, goodsdel } from "@/api/apis";

//中国时区时间
import { getChinaTime } from "@/utils/gettime";

export default {
  data() {
    return {
      tableData: [],
      currentPage: 1, //当前页码
      pagesize: 5, //每页条数
      total: 0, //总条数
      dialogFormVisible: false,
      form: {
        name: "",
        category: "",
        price: 1,
        imgUrl: "",
        goodsDesc: "",
      },
      formLabelWidth: "120px",
      options: [1, 2], //分类列表
    };
  },
  methods: {
    //图片上传后
    handleAvatarSuccess(res) {
      this.form.imgUrl =
        "http://127.0.0.1:5000/upload/imgs/goods_img/" + res.imgUrl;
    },
    //打开弹框
    opendialog(row) {
      //实现深拷贝
      this.form = {  ...row  };
      this.dialogFormVisible = true;

      //获取分类列表
      categories().then((res) => {
        this.options = res.data.categories;
      });
    },
    //取消编辑
    setfalse() {
      this.dialogFormVisible = false;
    },
    //确认编辑
    settrue() {
      let { name, category, price, imgUrl, goodsDesc, id } = this.form;
      let index = imgUrl.lastIndexOf("/");
      imgUrl = imgUrl.slice(index + 1);

      price = String(price);

      goodsedit( name, category, price, imgUrl, goodsDesc, id).then(
        (res) => {
          if (res.data.code == 0) {
            this.dialogFormVisible = false;
            this.$message({
              message: "修改成功",
              type: "success",
            });

            //获取商品列表
    this.getgoodslisst(this.currentPage)
          } else {
            this.$message({
              message: "修改失败，请稍后再试",
              type: "warning",
            });
          }
        }
      );
    },
    //删除按钮
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          goodsdel(row.id).then((res) => {
            if (res.data.code == 0) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              //获取商品列表
              this.getgoodslisst(this.currentPage);
            } else {
              this.$message({
                type: "warning",
                message: "删除失败，请稍后再试!",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //当前页码改变
    handleCurrentChange(val) {
      this.currentPage = val;
      //获取商品列表
      this.getgoodslisst(this.currentPage);
    },

    //获取商品列表函数
    getgoodslisst(currentPage) {
      goodslist(currentPage, this.pagesize).then((res) => {
        //总数
        this.total = res.data.total;

        res.data.data.forEach((item) => {
          item.ctime = getChinaTime(item.ctime);
          item.imgUrl =
            "http://127.0.0.1:5000/upload/imgs/goods_img/" + item.imgUrl;
        });

        this.tableData = res.data.data;

        if (res.data.data.length == 0) {
          this.getgoodslisst(currentPage - 1);
        }
      });
    },
  },
  created() {
    //获取商品列表
    this.getgoodslisst(this.currentPage);
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
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.Pagination_div {
  margin-top: 20px;
}
.samllimg {
  width: 60px;
  height: 60px;
}
.el-input {
  width: 40%;
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
</style>


