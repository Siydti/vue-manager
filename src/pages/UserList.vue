<template>
  <div>
    <h2>账号列表</h2>

    <div class="list_div">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column label="账号" width="150">
          <template slot-scope="scope">{{ scope.row.account }}</template>
        </el-table-column>

        <el-table-column prop="userGroup" label="用户组" width="120"></el-table-column>
        <el-table-column prop="ctime" label="创建时间" width="300"></el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- handleEdit(scope.$index, scope.row) -->
            <el-button size="mini" @click="openbox(scope.$index)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="Pagination_div">
      <el-pagination
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="listsum"
      ></el-pagination>
      <p>
        <el-button type="danger" @click="batchDel">批量删除</el-button>
        <el-button type="primary" @click="toggleSelection()">取消选择</el-button>
      </p>
    </div>

    <!-- 模态框 -->
    <div>
      <el-dialog title="编辑账号" :visible.sync="show">
        <el-form :model="form">
          <el-form-item label="修改账号" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off" style="width:215px"></el-input>
          </el-form-item>
          <el-form-item label="修改用户组" :label-width="formLabelWidth">
            <el-select v-model="form.region" placeholder="请选择用户组">
              <el-option label="超级管理员" value="超级管理员"></el-option>
              <el-option label="普通管理员" value="普通管理员"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="alterfalse">取 消</el-button>
          <el-button type="primary" @click="alterture">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
//接口
import { userlist, userdel, batchdel, edit } from "@/api/apis";
//中国时区时间
import { getChinaTime } from "@/utils/gettime";

export default {
  data() {
    return {
      tableData: [],
      currentPage: 1, //当前页
      listsum: 0, //总共账户数量
      pageSize: 5, //每页条数
      optarr: [], //选中的id数组
      delData: [],
      show: false,
      form: {
        name: "",
        region: "",
        editid: "", //要修改的账户id
      },
      formLabelWidth: "120px",
    };
  },
  methods: {
    //编辑按钮
    openbox(index) {
      this.show = true;
      this.editid = this.tableData[index].id;
    },
    //取消编辑
    alterfalse() {
      this.form.name = "";
      this.form.region = "";
      this.show = false;
    },
    //确认编辑
    alterture() {
      if (!this.form.name || !this.form.region) return false;
      edit(this.editid, this.form.name, this.form.region).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            message: "编辑成功",
            type: "success",
          });

          this.show = false;
          this.form.name = "";
          this.form.region = "";

          //获取当前页的用户列表
          this.getlist( this.currentPage );
        } else {
          this.$message.error("编辑失败，请稍后尝试。");
        }
      });
    },
    //删除按钮
    handleDelete(index, row) {
      // console.log(index, row);
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          userdel(row.id).then((res) => {
            if (res.data.code == 0) {
              //获取当前页的用户列表
              this.getlist( this.currentPage );

              this.$message({
                type: "success",
                message: "删除成功!",
              });
            } else {
              this.$message({
                type: "info",
                message: "删除失败，请稍后再试",
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
    //取消选中按钮
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    //处理选择改变
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log( val)
      this.delData = val;
      // console.log(this.tableData);
      for (let inddex in val) {
        this.optarr.push(val[inddex].id);
      }
    },
    //当前页跳转
    handleCurrentChange(val) {
      // console.log( val )

      this.currentPage = val;

      //获取当前页的用户列表
      this.getlist( this.currentPage );
    },
    //批量删除按钮
    batchDel() {
      //  console.log( this.delData )
      //  console.log( this.tableData )
      // for (let value of this.delData) {
      // }
      if( this.optarr.length == 0 ) return false
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          batchdel(JSON.stringify(this.optarr)).then((res) => {
            if (res.data.code == 0) {
              //改变tableData
              // this.tableData.splice(index, 1);

              //获取当前页的用户列表
              this.getlist( this.currentPage );

              this.$message({
                type: "success",
                message: "批量删除成功!",
              });
            } else {
              this.$message({
                type: "info",
                message: "删除失败，请稍后再试",
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

    //获取当前页的用户列表
    getlist( currentPage ) {
      userlist( currentPage , this.pageSize).then((res) => {
        res.data.data.forEach(item => item.ctime = getChinaTime(item.ctime));
        this.tableData = res.data.data;

        //总条数
        this.listsum = res.data.total;
        
      if( this.tableData.length == 0 ){
        this.getlist( currentPage-1 )
      }

      });

    },
  },
  //组件数据初始化完毕，访问数据前
  created() {
    //获取用户列表
    if (this.optarr) {
      //获取当前页的用户列表
      this.getlist( this.currentPage );
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
.list_div,
.Pagination_div {
  width: 95%;
  margin: 20px auto;
}
.Pagination_div {
  margin-bottom: 0px;

  > p {
    margin-top: 20px;
  }
}
</style>