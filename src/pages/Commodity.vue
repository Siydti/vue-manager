<template>
  <div>
    <div class="time_div">
      <span>时间范围</span>
      <el-date-picker
        v-model="date"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      ></el-date-picker>
      <el-button type="primary" @click="visit_btn">查询</el-button>
    </div>

    <div id="myChart" :style="{width: '90%', height: '550px'}"></div>
  </div>
</template>

<script>
//引人echarts
import echarts from "echarts";

//引入插件
import { ordertotal } from "@/api/apis";

//引入中国区时间
import { getChinaTime } from '@/utils/gettime'

export default {
  data() {
    return {
      date: [ new Date('2020-01-01 00:00:00') , new Date() ],
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
      },
    };
  },
  //钩子函数
  mounted() {
    this.dow( JSON.stringify( this.date ) )
  },
  methods: {
    visit_btn() {
      let nowdate = [ getChinaTime(this.date[0]) ,  getChinaTime(this.date[1]) ]
      this.dow( JSON.stringify( nowdate ) )
    },
    dow(date) {
      ordertotal( date ).then((res) => {
          var orderTime = res.data.data.map( item => getChinaTime(item.orderTime) )
          var orderAmount = res.data.data.map( item => item.orderAmount )

        // 初始化echarts实例
        let myChart = echarts.init(document.getElementById("myChart"));
        // 绘制图表
        var option = {
          title: {
            text: "商品报表",
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              label: {
                backgroundColor: "#6a7985",
              },
            },
          },
          legend: {
            data: [ "订单金额"],
          },
          toolbox: {
            feature: {
              saveAsImage: {},
            },
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              boundaryGap: false,
              data: orderTime,
            },
          ],
          yAxis: [
            {
              type: "value",
            },
          ],
          series: [
            {
              name: "订单金额",
              type: "line",
              stack: "总量",
              areaStyle: {},
              data: orderAmount,
            }
          ],
        };
        myChart.setOption(option); //设置option
      });
    },
  },
};
</script>

<style lang="less" scoped>
.time_div {
  display: flex;
  align-items: center;
  margin: 20px 0px 60px 0px;
  padding-left: 10px;
  .el-range-editor.el-input__inner {
    margin: 0px 10px;
  }
}
</style>