<template>
  <div>
    <h2>
      <span>商品分类</span>
      <el-button type="primary" size="small" @click="dialogopen_btn">添加分类</el-button>
    </h2>

    <!--    弹框     -->
    <div id="dialog_box">
      <el-dialog title="添加分类" :visible.sync="dialogFormVisible" width="500px">
        <el-form :model="form">
          <el-form-item label="分类名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off" placeholder="分类名称"></el-input>
          </el-form-item>
          <el-form-item label="是否启用" :label-width="formLabelWidth">
            <el-switch v-model="isswitch" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addcatefalse_btn">取 消</el-button>
          <el-button type="primary" @click="addcate_btn">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 列表 -->
    <div class="list_div">
      <el-table :data="tableData" highlight-current-row style="width: 100%">
        <el-table-column type="index" width="120" label="序号"></el-table-column>

        <el-table-column label="分类名称" width="350">
          <template slot-scope="scope">
            <span v-show="scope.row.isshow">{{ scope.row.cateName }}</span>
            <el-input v-model="scope.row.cateName" v-show="!scope.row.isshow" />
          </template>
        </el-table-column>

        <el-table-column label="是否启用">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :disabled="scope.row.isdisabled"
            ></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleSet(scope.$index, scope.row)"
              plain
              :type="scope.row.setbtntype"
            >{{scope.row.setbtn}}</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
import { catelist, addcate, delcate, editcate } from "@/api/apis";

export default {
  data() {
    return {
      tableData: [],
      pagesize: 5, //没页显示条数
      currentPage: 1, //当前页数
      total: 0, //总条数
      dialogFormVisible: false, //弹框状态
      form: {
        name: "",
        region: "",
      },
      formLabelWidth: "120px",
      isswitch: true, //添加分类是否启用状态
    };
  },
  methods: {
    //打开弹框
    dialogopen_btn() {
      this.dialogFormVisible = true;
    },
    //添加分类取消按钮
    addcatefalse_btn() {
      this.dialogFormVisible = false;
      this.form.name = "";
      this.isswitch = true;
    },
    //添加分类确认按钮
    addcate_btn() {
      addcate(this.form.name, this.isswitch).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            message: "恭喜你，添加成功~",
            type: "success",
          });

          this.dialogFormVisible = false;
          this.form.name = "";
          this.isswitch = true;

          //获取商品列表
          this.getcatelist(this.currentPage);
        } else {
          this.$message("添加失败，请稍后再试!");
        }
      });
    },
    //删除按钮
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delcate(row.id).then((res) => {
            if (res.data.code == 0) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              //获取商品列表
              this.getcatelist(this.currentPage);
            } else {
              this.$message.error("删除失败，请稍后再试");
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
    //编辑按钮
    handleSet(index, row) {
      if (row.isshow) {
        row.isshow = false;
        row.setbtn = "保存";
        row.setbtntype = "success";
        row.isdisabled = false;
      } else {
        row.isshow = true;
        row.setbtn = "编辑";
        row.setbtntype = "";
        row.isdisabled = true;

        editcate(row.id, row.cateName, row.state).then((res) => {
          if (res.data.code == 0) {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            //获取商品列表
            this.getcatelist(this.currentPage);
          } else {
            this.$message({
              message: "修改失败，请稍后再试",
              type: "warning",
            });
          }
        });
      }
    },
    //当前页数改变时会触发
    handleCurrentChange(val) {
      this.currentPage = val;

      //获取商品列表
      this.getcatelist(this.currentPage);
    },

    //获取商品列表函数
    getcatelist(currentPage) {
      catelist(currentPage, this.pagesize).then((res) => {
        res.data.data.forEach((item) => {
          item.state = item.state === 1 ? true : false;
          item.isshow = true;
          item.setbtn = "编辑"; //编辑按钮文本
          item.setbtntype = ""; //编辑按钮样式   success-保存
          item.isdisabled = true; //是否禁用
        });

        this.tableData = res.data.data;

        if (res.data.data.length == 0) {
          this.getcatelist(currentPage - 1);
        }

        //总条数
        this.total = res.data.total;
      });
    },
  },
  created() {
    //获取商品列表
    this.getcatelist(this.currentPage);
  },
};
</script>

<style lang='less' scoped>
h2 {
  font-weight: normal;
  font-size: 16px;
  text-indent: 10px;
  border-bottom: 2px solid #f0f2f5;
  display: flex;
  justify-content: space-between;
  padding: 0px 20px 20px 0px;
}
.Pagination_div {
  margin-top: 20px;
}
</style>