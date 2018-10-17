<template>
  <div>
    <el-row>
      <el-col :span="24">
        <span>选择当前年级:</span>
        <el-select v-model="value" placeholder="请选择" size="mini" @change="updatechart">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <br>
    <el-row :gutter="1">
      <el-col :span="11">
        <h4>个人出卷数量情况统计</h4>
        <bar-normal :chartID="'chart_1'" ref="chart_1" :xAxisData="xAxis_data1" :seriesData="series_data1"></bar-normal>
      </el-col>
      <el-col :span="11">
        <h4>个人出卷难易度情况分析</h4>
        <bar-normal :chartID="'chart_2'" ref="chart_2" :xAxisData="xAxis_data2" :seriesData="series_data2"></bar-normal>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <h4>最近七天各学科试卷数</h4>
        <div>
          <pie :chartID="'chart_4'" ref="chart_4" :legendData="legendData1" :seriesData="seriesData1" :titleName="'应收租金分布图'"></pie>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "stats-personal",
  data() {
    return {
      options: [],
      value: "",
      series_data1: [0, 0, 0],
      xAxis_data1: ["已出试卷数", "教研组人均试卷数", "教研组总试卷数"],
      series_data2: [0, 0, 0],
      xAxis_data2: ["已出简单题", "已出中等题", "已出难题"],
      series_data3: [0, 0, 0, 0],
      xAxis_data3: ["单元测试", "期中考试", "期末考试", "课后作业"],
      legendData1: [
        "语文",
        "数学",
        "英语",
        "物理",
        "化学",
        "生命科学",
        "政治",
        "历史",
        "地理"
      ],
      seriesData1: [{ value: 0, name: "地理" }],
      data1: {}
    };
  },

  methods: {
    formatTime(date) {
      var year = date.getFullYear();
      var month = date.getMonth() + 1,
        month = month < 10 ? "0" + month : month;
      var day = date.getDate(),
        day = day < 10 ? "0" + day : day;
      return year + "-" + month + "-" + day;
    },
    updatepersonalpaperCount() {
      let params = {
        userSubject: this.$store.getters.getSubject(),
        userGrade: this.value,
        beginTime: this.getTheDate.startDate,
        endTime: this.getTheDate.currentDate
      };
      this.getRequest("paper/statistics", params).then(response => {
        this.series_data1[0] = response.data.myPaperCount;
        this.series_data1[1] = response.data.total / response.data.userCount;
        this.series_data1[2] = response.data.total;
        this.$refs.chart_1.changeOption();
      });
    },
    pushGrade() {
      let params = {
        userSubject: this.$store.getters.getSubject(),
        userGrade: this.value,
        beginTime: this.getTheDate.startDate,
        endTime: this.getTheDate.currentDate
      };
      this.getRequest("user/subject", params).then(response => {
        let grade = response.data[0].subjectGrade.split("@");
        grade.forEach(x => {
          this.options.push({
            label: x + "年级",
            value: x
          });
        });
      });
    },
    getTheDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      var lastdate = currentdate.split("-");
      lastdate = new Date(
        Number(lastdate["0"]),
        Number(lastdate["1"]) - 1,
        Number(lastdate["2"])
      );
      lastdate.setDate(lastdate.getDate() - 7);
      lastdate = this.formatTime(lastdate);
      return {
        startDate:
          year +
          seperator1 +
          (month === "08" || "09" || "10" || "11" || "12" || "01"
            ? "09"
            : "02") +
          seperator1 +
          "01",
        currentDate: currentdate,
        lastDate: lastdate
      };
    },
    updatechart() {
      this.updatepersonalpaperCount();
      let params = {
        userSubject: this.$store.getters.getSubject(),
        userGrade: this.value,
        beginTime: this.getTheDate.lastDate,
        endTime: this.getTheDate.currentDate
      };
      this.getRequest("paper/statistics", params).then(response => {
        response.data.list.forEach(x => {
          this.seriesData1.push({
            value: x.subjectPaperCount,
            name: x.subjectName
          });
        });
      });
    }
    // father(){
    //   this.$refs.chart_1.changeOption()
    //   this.$refs.chart_2.changeOption()
    //   this.$refs.chart_3.changeOption()
    //   this.$refs.chart_4.changeOption()

    // }
  },
  mounted() {
    this.updatepersonalpaperCount();
    this.updatechart();
    console.log(this.getTheDate());
    this.pushGrade();
    console.log("日期测试");
    console.log(this.getTheDate().currentDate);
    console.log(this.getTheDate().lastDate);
  }
};
</script>

<style>
</style>