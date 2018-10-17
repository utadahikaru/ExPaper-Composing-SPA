<template>
  <!-- 试卷头部 -->
  <div class="sjtb">
    <!-- 保密标记 -->
    <div class="secrecy-mark" v-if="secrecyMarkVisible">绝密★启用前</div>
    <!-- 主标题 -->
    <div class="headline" v-if="headlineVisible">
      <div v-if="itemToEdit != 'headline'" @click="itemToEdit = 'headline'">{{sjtb.headlineText}}</div>
      <input v-else style="font-size: 24px;width: 100%;text-align: center;color: gray;outline: none;" type="text" v-model="sjtb.headlineText" :placeholder="sjtb.headlineText">
    </div>
    <!-- 副标题 -->
    <div class="subhead" v-if="subheadVisible">
      <div v-if="itemToEdit != 'subhead'" @click="itemToEdit = 'subhead'">{{sjtb.subheadText}}</div>
      <input v-else style="font-size: 22px;width: 100%;text-align: center;color: gray;outline: none;" type="text" v-model="sjtb.subheadText" :placeholder="sjtb.subheadText">
    </div>
    <!-- 试题信息 -->
    <div class="paper-info" v-if="paperInfoVisible">
      <span v-if="itemToEdit != 'paperInfo'" @click="itemToEdit = 'paperInfo'">{{sjtb.paperInfoText}}</span>
      <input v-else style="font-size: 16px;width: 100%;text-align: center;color: gray;outline: none;" type="text" v-model="sjtb.paperInfoText" :placeholder="sjtb.paperInfoText">
    </div>
    <!-- 考生信息 -->
    <div class="student-info" v-if="studentInfoVisible">
      <span v-if="itemToEdit != 'studentInfo'" @click="itemToEdit = 'studentInfo'">{{sjtb.studentInfoText}}</span>
      <input v-else style="font-size: 16px;width: 100%;text-align: center;color: gray;outline: none;" type="text" v-model="sjtb.studentInfoText" :placeholder="sjtb.studentInfoText">
    </div>
    <!-- 分数栏 -->
    <table v-if="scoreTableVisible">
      <tbody>
        <tr>
          <td>题号</td>
          <td v-for="index in exerciseTypeCount" :key="index">{{getValue(global.indexInChinese, index)}}</td>
          <td>总分</td>
        </tr>
        <tr>
          <td>得分</td>
          <td v-for="index in exerciseTypeCount" :key="index"></td>
          <td></td>
        </tr>
      </tbody>
    </table>
    <!-- 注意事项 -->
    <div class="announcements" v-if="announcementsVisible">
      <span v-if="itemToEdit != 'announcements'" @click="itemToEdit = 'announcements'">{{sjtb.announcementsText}}</span>
      <input v-else style="font-size: 14px;" type="text" v-model="sjtb.announcementsText" :placeholder="sjtb.announcementsText">
    </div>

    <el-button class="save-button" v-if="itemToEdit !== ''" type="text" @click="updatePaperHead">保存更改</el-button>
  </div>

</template>

<script>
export default {
  name: "paperHeader",
  data () {
    return {
      itemToEdit: ''
    }
  },
  computed: {
    sjtb () {
      let t = JSON.parse(JSON.stringify(this.$store.state.paper.paperHead))
      t.headlineText = this.$store.state.paper.paper.paperTitle
      return t
    },
    secrecyMarkVisible () {
      return this.$store.state.paperStruct.paperStructCustom.indexOf('secrecyMark') !== -1
    },
    headlineVisible () {
      return this.$store.state.paperStruct.paperStructCustom.indexOf('headline') !== -1
    },
    subheadVisible () {
      return this.$store.state.paperStruct.paperStructCustom.indexOf('subhead') !== -1
    },
    paperInfoVisible () {
      return this.$store.state.paperStruct.paperStructCustom.indexOf('paperInfo') !== -1
    },
    studentInfoVisible () {
      return this.$store.state.paperStruct.paperStructCustom.indexOf('studentInfo') !== -1
    },
    exerciseTypeCount () {
      return this.$store.state.paper.exerciseListClassified.length
    },
    scoreTableVisible () {
      return this.$store.state.paperStruct.paperStructCustom.indexOf('scoreTable') !== -1
    },
    announcementsVisible () {
      return this.$store.state.paperStruct.paperStructCustom.indexOf('announcements') !== -1
    }
  },
  methods: {
    updatePaperHead () {
      this.itemToEdit = ''
      this.$store.commit('setPaperHead', this.sjtb)
      this.$store.dispatch('updatePaper')
    }
  }
}
</script>

<style lang="scss" scoped>
.sjtb {
  position: relative;
  padding-bottom: 50px;
}

span,
td {
  color: black;
  font-family: STSong;
}

.headline {
  text-align: center;
  line-height: 50px;

  font-size: 24px;
}

.subhead {
  line-height: 50px;

  text-align: center;

  font-size: 22px;
}

.paper-info {
  line-height: 25px;

  text-align: center;
}

.student-info {
  line-height: 25px;

  text-align: center;
}

table {
  margin: 0 auto;

  border-spacing: 0;

  border-top: 1px solid #777;
  border-left: 1px solid #777;
  height: 50px;
}

td {
  width: 72px;
  height: 24px;

  text-align: center;

  border-right: 1px solid #777;
  border-bottom: 1px solid #777;
}

.announcements {
  line-height: 25px;

  font-size: 14px;
}

input {
  width: 100%;

  text-align: center;

  color: gray;
  outline: none;
}

.save-button {
  position: absolute;
  right: 0;
  top: 0;
}
</style>

