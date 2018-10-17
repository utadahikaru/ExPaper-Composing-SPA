<template>
  <!-- 教师管理页面 -->
  <div class="bqteam-main-wrap-inner">

    <!-- 该学科组的教师 -->
    <div class="mb" style="font-size:16px;">该学科组的教师</div>
    <el-table :data="teachersInSubject" style="width: 750px" border v-loading="loading">
      <el-table-column prop="name" label="教师姓名" width="100" align="center">
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="100" align="center">
      </el-table-column>
      <el-table-column prop="tel" label="电话" width="200" align="center">
      </el-table-column>
      <el-table-column prop="email" label="电子邮箱" width="200" align="center">
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope" fixed="right" label="操作" width="100">
          <button class="table-button" @click="moveTeacherOut(scope.row.userId)">移出学科组</button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 不在该学科组的教师 -->
    <el-switch class="mt mb" v-model="showAll" active-text="不在该学科组的教师"></el-switch>
    <el-table v-if="showAll" :data="teachersOutSubject" style="width: 750px" border>
      <el-table-column prop="name" label="教师姓名" width="100" align="center">
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="100" align="center">
      </el-table-column>
      <el-table-column prop="tel" label="电话" width="200" align="center">
      </el-table-column>
      <el-table-column prop="email" label="电子邮箱" width="200" align="center">
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope" fixed="right" label="操作" width="100">
          <button class="table-button" @click="moveTeacherIn(scope.row.userId)">移入学科组</button>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
export default {
  data () {
    return {
      showAll: false,
      teachersInSubject: [],
      teachersOutSubject: [],

      loading: false
    }
  },
  computed: {
    subjectId () {
      return this.$store.getters.getSubject()
    }
  },
  mounted () {
    this.getTeachers()
  },
  methods: {
    getTeachers () {
      this.loading = true
      let params = { subjectId: this.subjectId, roleId: 4 }
      this.getRequest(this.httpUrl.subjectMember, params)
        .then(response => {
          this.loading = false
          this.teachersOutSubject = []
          this.teachersInSubject = []
          response.data.list.forEach(element => {
            if (element.isMember === 0) {
              this.teachersOutSubject.push(element)
            } else {
              this.teachersInSubject.push(element)
            }
          })
        })
        .catch(error => {
          this.loading = false
        })
    },

    moveTeacherIn (userId) {
      let params = { subjectId: this.subjectId, userId: userId }
      this.postRequest(this.httpUrl.subjectMember, params).then(response => {
        this.getTeachers()
      })
    },

    moveTeacherOut (userId) {
      let params = { subjectId: this.subjectId, userId: userId }
      this.deleteRequest(this.httpUrl.subjectMember, params).then(response => {
        this.getTeachers()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

