<template>
  <!-- 试卷头部 -->
  <div style="position: relative; margin-bottom: 25px;color: black;font-size: 12px;font-family: STSong;line-height:20px;">
    <!-- 主标题 -->
    <div style="text-align: center;line-height: 50px;font-size: 18px;" v-if="headlineVisible">
      <div v-if="itemToEdit != 'headline'" @click="itemToEdit = 'headline'">{{sjtb.headlineText}}</div>
      <input v-else style="font-size: 18px;" type="text" v-model="sjtb.headlineText" :placeholder="sjtb.headlineText">
    </div>
    <!-- 副标题 -->
    <div style="line-height: 40px;text-align: center;font-size: 16px;" v-if="subheadVisible">
      <div v-if="itemToEdit != 'subhead'" @click="itemToEdit = 'subhead'">{{sjtb.subheadText}}</div>
      <input v-else style="font-size: 16px;" type="text" v-model="sjtb.subheadText" :placeholder="sjtb.subheadText">
    </div>
    <!-- 试题信息 -->
    <div style="text-align: center;" v-if="paperInfoVisible">
      <span v-if="itemToEdit != 'paperInfo'" @click="itemToEdit = 'paperInfo'">{{sjtb.paperInfoText}}</span>
      <input v-else  type="text" v-model="sjtb.paperInfoText" :placeholder="sjtb.paperInfoText">
    </div>
    <!-- 考生信息 -->
    <div style="text-align: center;" v-if="studentInfoVisible">
      <span v-if="itemToEdit != 'studentInfo'" @click="itemToEdit = 'studentInfo'">{{sjtb.studentInfoText}}</span>
      <input v-else  type="text" v-model="sjtb.studentInfoText" :placeholder="sjtb.studentInfoText">
    </div>
    <!-- 分数栏 -->
    <table style="margin: 0 auto;border-spacing: 0;border-top: 1px solid #777; border-left: 1px solid #777; height: 50px;" v-if="scoreTableVisible">
      <tbody>
        <tr>
          <td style="width: 50px;height: 20px;text-align: center;border-right: 1px solid #777;border-bottom: 1px solid #777;">题号</td>
          <td style="width: 50px;height: 20px;text-align: center;border-right: 1px solid #777;border-bottom: 1px solid #777;" v-for="index in exerciseTypeCount" :key="index">{{global.indexInChinese[index - 1]}}</td>
          <td style="width: 50px;height: 20px;text-align: center;border-right: 1px solid #777;border-bottom: 1px solid #777;color:black;font-size: 14px;font-family: STSong;">总分</td>
        </tr>
        <tr>
          <td style="width: 50px;height: 20px;text-align: center;border-right: 1px solid #777;border-bottom: 1px solid #777;">得分</td>
          <td style="width: 50px;height: 20px;text-align: center;border-right: 1px solid #777;border-bottom: 1px solid #777;" v-for="index in (exerciseTypeCount + 1)" :key="index"></td>
        </tr>
      </tbody>
    </table>
    <!-- 注意事项 -->
    <div v-if="announcementsVisible">
      <span v-if="itemToEdit != 'announcements'" @click="itemToEdit = 'announcements'">{{sjtb.announcementsText}}</span>
      <input v-else type="text" v-model="sjtb.announcementsText" :placeholder="sjtb.announcementsText">
    </div>

    <el-button style="position: absolute;right: 0;top: 0;" v-if="itemToEdit !== ''" type="text" @click="updatePaperHead">保存更改</el-button>
  </div>

</template>

<script>

export default {
  name: "paperHeaderStyled",
  data () {
    return {
      itemToEdit: ''
    }
  },
  computed: {
    sjtb () {
      let t = this.$store.state.paper.paperHead
      return JSON.parse(JSON.stringify(t))
    },
    secrecyMarkVisible() {
      return this.$store.state.paperStruct.paperStructCustom.indexOf('secrecyMark') !== -1
    },
    headlineVisible() {
      return this.$store.state.paperStruct.paperStructCustom.indexOf('headline') !== -1
    },
    subheadVisible() {
      return this.$store.state.paperStruct.paperStructCustom.indexOf('subhead') !== -1
    },
    paperInfoVisible() {
      return this.$store.state.paperStruct.paperStructCustom.indexOf('paperInfo') !== -1
    },
    studentInfoVisible() {
      return this.$store.state.paperStruct.paperStructCustom.indexOf('studentInfo') !== -1
    },
    exerciseTypeCount() {
      return this.$store.state.paper.exerciseListClassified.length
    },
    scoreTableVisible() {
      return this.$store.state.paperStruct.paperStructCustom.indexOf('scoreTable') !== -1
    },
    announcementsVisible() {
      return this.$store.state.paperStruct.paperStructCustom.indexOf('announcements') !== -1
    }
  },
  methods: {
    updatePaperHead () {
      this.itemToEdit = ''
      this.$store.commit('setPaperHead', this.sjtb)

      // 更新组卷
      let params = this.$store.state.paper.paper
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

