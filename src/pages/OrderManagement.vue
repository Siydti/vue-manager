<template>
  <div>
    <div class="input_div">
      <p>
        <span>订单号</span>
        <el-input placeholder="订单号" v-model="orderNo" clearable></el-input>
      </p>
      <p>
        <span>收货人</span>
        <el-input placeholder="收货人" v-model="consignee" clearable></el-input>
      </p>
      <p>
        <span>手机号</span>
        <el-input type="text" placeholder="手机号" v-model="phone" maxlength="11" show-word-limit></el-input>
      </p>
      <p>
        <span>订单状态</span>

        <el-select v-model="orderState" placeholder="订单状态">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </p>
    </div>

    <div class="time_div">
      <span>选择时间</span>
      <el-date-picker
        v-model="date"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      ></el-date-picker>
      <el-button type="primary" @click="orderlist_btn" size="small" style="margin-left:20px;">查询</el-button>
    </div>

    <!-- 订单 -->
    <div>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="isloading"
        element-loading-text="拼命加载中"
      >
        <el-table-column prop="orderNo" label="订单号"></el-table-column>
        <el-table-column prop="orderTime" label="下单时间"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="consignee" label="收货人"></el-table-column>
        <el-table-column prop="deliverAddress" label="配送地址"></el-table-column>
        <el-table-column prop="deliveryTime" label="送达时间"></el-table-column>
        <el-table-column prop="remarks" label="用户备注"></el-table-column>
        <el-table-column prop="orderAmount" label="订单金额"></el-table-column>
        <el-table-column prop="orderState" label="订单状态"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope)" type="text">查看</el-button>
            <el-button type="text" @click="redactClick(scope)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 弹框 -->
    <div  id="Dialog_div">
      <el-dialog title="订单详情-查询" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="点单id" :label-width="formLabelWidth">
            <el-input v-model="form.id" v-show="isshow"></el-input>
            <span v-show="!isshow">{{ form.id }}</span>
          </el-form-item>

          <el-form-item label="订单号" :label-width="formLabelWidth">
            <el-input v-model="form.orderNo" v-show="isshow"></el-input>
            <span v-show="!isshow">{{ form.orderNo }}</span>
          </el-form-item>

          <el-form-item label="下单时间" :label-width="formLabelWidth">
            <el-date-picker v-model="form.orderTime" type="datetime" :readonly="!isshow"></el-date-picker>
          </el-form-item>

          <el-form-item label="联系电话" :label-width="formLabelWidth">
            <el-input v-model="form.phone" v-show="isshow"></el-input>
            <span v-show="!isshow">{{ form.phone }}</span>
          </el-form-item>

          <el-form-item label="收货人" :label-width="formLabelWidth">
            <el-input v-model="form.consignee" v-show="isshow"></el-input>
            <span v-show="!isshow">{{ form.consignee }}</span>
          </el-form-item>

          <el-form-item label="送货地址" :label-width="formLabelWidth">
            <el-input v-model="form.deliverAddress" v-show="isshow"></el-input>
            <span v-show="!isshow">{{ form.deliverAddress }}</span>
          </el-form-item>

          <el-form-item label="送达时间" :label-width="formLabelWidth">
            <el-date-picker v-model="form.deliveryTime" type="datetime" :readonly="!isshow"></el-date-picker>
          </el-form-item>

          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input type="textarea" :rows="2" v-model="form.remarks" :readonly="!isshow"></el-input>
            <span v-show="!isshow">{{ form.remarks }}</span>
          </el-form-item>

          <el-form-item label="订单金额" :label-width="formLabelWidth">
            <el-input-number
              v-model="form.orderAmount"
              controls-position="right"
              :min="0.01"
              :disabled="!isshow"
            ></el-input-number>
          </el-form-item>

          <el-form-item label="订单状态" :label-width="formLabelWidth">
            <el-select v-model="form.orderState" :disabled="!isshow">
              <el-option label="已受理" value="已受理"></el-option>
              <el-option label="派送中" value="派送中"></el-option>
              <el-option label="已完成" value="已完成"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false" v-show="isshow">取 消</el-button>
          <el-button type="primary" @click="orderedit_btn" v-show="isshow">确 定</el-button>
          <el-button type="primary" @click="dialogFormVisible = false" v-show="!isshow">关 闭</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 分页 -->
    <div class="Pagination_div">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
//接口
import { orderlist, orderdetail, orderedit } from "@/api/apis";

//中国时区时间
import { getChinaTime } from "@/utils/gettime";

export default {
  data() {
    return {
      orderNo: "", //订单号
      consignee: "", //收货人
      phone: "", //手机号
      options: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "派送中",
          label: "派送中",
        },
        {
          value: "已受理",
          label: "已受理",
        },
        {
          value: "已完成",
          label: "已完成",
        },
      ],
      date: null, //时间范围
      id: [], //订单id
      orderState: "", //订单状态
      tableData: [], //订单数据
      total: 1, //数据总条数
      pagesize: 5, //每页条数
      currentPage: 1, //当前页码
      isloading: false, //是否加载中
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      }, //时间查询的快捷键
      dialogFormVisible: false, //弹窗显示
      form: {
        //弹框列表
        id: "",
        orderNo: "",
        orderTime: null,
        phone: "",
        consignee: "",
        deliverAddress: "",
        deliveryTime: null,
        remarks: "",
        orderAmount: "",
        orderState: "",
      },
      formLabelWidth: "120px",
      isshow: true, //弹框内按钮 true编辑 false查看
    };
  },
  methods: {
    //查询按钮
    handleClick(scope) {
      this.dialogFormVisible = true;
      this.isshow = false;
      orderdetail(this.tableData[scope.$index].id).then((res) => {
        res.data.data.deliveryTime = getChinaTime(res.data.data.deliveryTime);
        res.data.data.orderTime = getChinaTime(res.data.data.orderTime);

        this.form = res.data.data;
      });
    },
    //编辑按钮
    redactClick(scope) {
      this.dialogFormVisible = true;
      this.isshow = true;

      let obj = { ...scope.row };
      this.form = obj;
    },
    //修改订单按钮
    orderedit_btn() {
      this.dialogFormVisible = false;

      this.form.orderAmount = String(this.form.orderAmount);
      this.form.orderTime = getChinaTime( this.form.orderTime )
      this.form.deliveryTime = getChinaTime( this.form.deliveryTime )

      let {
        id,
        orderNo,
        orderTime,
        phone,
        consignee,
        deliverAddress,
        deliveryTime,
        remarks,
        orderAmount,
        orderState,
      } = this.form;

      orderedit({
        id,
        orderNo,
        orderTime,
        phone,
        consignee,
        deliverAddress,
        deliveryTime,
        remarks,
        orderAmount,
        orderState,
      }).then((res) => {
        if (res.data.code == 0) {
         this.$message({
          message: '恭喜你，修改成功',
          type: 'success'
        });
          //获取订单列表
          this.getorderlist();
        } else {
          this.$message.error("修改失败，请稍后再试");
        }
      });
    },

    //顶部查询
    orderlist_btn() {
      //获取订单列表
      this.getorderlist();
    },

    handleSizeChange(val) {
      this.pagesize = val;
      //获取订单列表
      this.getorderlist();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      //获取订单列表
      this.getorderlist();
    },
    //获取列表函数
    getorderlist() {
      this.isloading = true;
      // setTimeout(() => {

      let params = {};

      if (this.orderNo != "") params.orderNo = this.orderNo;
      if (this.consignee != "") params.consignee = this.consignee;
      if (this.phone != "") params.phone = this.phone;
      if (this.orderState != "") params.orderState = this.orderState;
      if (this.date)
        params.date = JSON.stringify([
          getChinaTime(this.date[0]),
          getChinaTime(this.date[1]),
        ]);
      orderlist({
        currentPage: this.currentPage,
        pageSize: this.pagesize,
        ...params,
      }).then((res) => {
        res.data.data.forEach((item) => {
          item.orderTime = getChinaTime(item.orderTime);
          item.deliveryTime = getChinaTime(item.deliveryTime);
        });

        this.tableData = res.data.data;
        this.total = res.data.total;
        this.id = res.data.data.id;

        if (res.data.data.length == 0) {
          this.getorderlist(params.currentPage - 1);
        }
      });
      this.isloading = false;
      // }, 1500);
    },
  },
  created() {
    //获取订单列表
    this.getorderlist();
  },
};
</script>

<style lang="less" scoped>
.input_div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  > p {
    display: flex;
    > span {
      width: 80px;
      line-height: 40px;
      padding: 0px 10px;
    }
  }
}

.time_div {
  display: flex;
  align-items: center;
  margin: 20px 0px 40px 0px;
  padding-left: 10px;
  .el-range-editor.el-input__inner {
    margin: 0px 10px;
  }
}
.Pagination_div {
  margin-top: 20px;
}
#Dialog_div{
  .el-input{
    width: 270px;
  }
}
</style>