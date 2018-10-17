<template>
  <el-dropdown v-if="subjects.length > 0" style="margin-right:10px;" @command="selectSubject">
    <span class="el-dropdown-link" style="color:#2dabe2">
      {{subject.name}}
      <i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="subject in subjects" :key="subject.id" :command="subject">{{subject.name}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'subject-selector',
  data () {
    return {
      subjects: [],
      subject: {}
    }
  },
  mounted () {
    this.getSubjects()
  },
  methods: {
    getSubjects () {
      let subjectsString = localStorage.getItem('userSubjects')
      if (subjectsString === null) {
        this.subjects = []
      } else {
        this.subjects = JSON.parse(subjectsString)
      }

      let subjectString = localStorage.getItem('userSubject')
      if (subjectString === null) {
        this.subject = {}
      } else {
        this.subject = JSON.parse(subjectString)
      }
    },

    selectSubject (subject) {
      console.log(subject);

      if (subject.id !== this.subject.id) {
        this.subject = subject
        this.setLs('userSubject', subject)

        //科目换掉之后，与科目相关的配置信息也要重新获取

        //重新设置科目
        this.$store.commit('setupSubjects')
        //重新设置年级（知识点、章节不用重新获取，因为知识点、章节获取到的是全数据，教师在使用的时候每次会根据科目年级重新拿数据）
        this.$store.commit('setupGrades')
        this.$store.commit('clearExerciseType')
        this.$store.commit('clearTextbook')
        this.$store.commit('clearKnowledge')

        //跳到首页去，否则就需要频繁刷新当前页面
        this.$router.push('/home')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

