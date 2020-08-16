<template>
  <div>
    <div class="top_div">
      <div class="top-list_div">
        <div>
          <i class="el-icon-notebook-2" style="color:#1296DB"></i>
        </div>
        <div>
          <h5>总订单</h5>
          <p>{{ totalOrder }}</p>
        </div>
      </div>

      <div class="top-list_div">
        <div>
          <i class="el-icon-sell" style="color:#D4237A"></i>
        </div>
        <div>
          <h5>总销售额</h5>
          <p> ￥: {{ totalAmount }}</p>
        </div>
      </div>

      <div class="top-list_div">
        <div>
          <i class="el-icon-tickets" style="color:#1296DB"></i>
        </div>
        <div>
          <h5>今日订单数</h5>
          <p>{{ todayOrder }}</p>
        </div>
      </div>

      <div class="top-list_div">
        <div>
          <i class="el-icon-shopping-cart-full" style="color:#1AFA29"></i>
        </div>
        <div>
          <h5>今日销售额</h5>
          <p> ￥: {{ totayAmount }}</p>
        </div>
      </div>
    </div>

    <div id="myChart" style="width:90%;height:600px;margin-top: 30px;"></div>
  </div>
</template>

<script>
//引入echarts
import echarts from "echarts";

//引入接口
import { totaldata } from '@/api/apis'

export default {
  data() {
    return {
      totalOrder : '',//总订单
      totalAmount : '',//总销售额
      todayOrder : '',//今日订单
      totayAmount : '',//今日销售额
    };
  },

  //钩子函数
  mounted() {
    totaldata().then( res => {
      this.totalOrder = res.data.totalOrder
      this.totalAmount = res.data.totalAmount
      this.totayAmount = res.data.totayAmount
      this.todayOrder = res.data.todayOrder
    

    let eobj = echarts.init(document.querySelector("#myChart"));

     var option = {
    title: {
        text: '首页报表'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['订单数据', '金额数据']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: res.data.xData
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: '订单数据',
            type: 'line',
            stack: '总量',
            data: res.data.orderData
        },
        {
            name: '金额数据',
            type: 'line',
            stack: '总量',
            data: res.data.amountData
        }
    ]
};


    eobj.setOption( option )
    } )

  },
};
</script>

<style lang="less" scoped>
@backtop: #f5f4f4;
@coltoph: #afadad;

.top_div {
  display: flex;
  justify-content: space-between;
  .top-list_div {
    width: 20%;
    height: 80px;
    background: @backtop;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 3px;
    i {
      font-size: 50px;
      padding-left: 30px;
    }
    h5 {
      font-size: 16px;
      color: @coltoph;
      font-weight: normal;
      padding-right: 30px;
      text-align: center;
    }
    p {
      font-size: 16px;
      font-weight: bold;
      padding-right: 30px;
      text-align: center;
    }
  }
}
</style>