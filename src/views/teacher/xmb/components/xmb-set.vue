<template>
  <div>
    <div class="search-box">
      <!-- 删选条件 -->
      <cus-radio v-model="xmbCondition.featureGrade" :values="radioGrades" title="年级：" defaultRadio="全部" />
      <cus-radio v-model="xmbCondition.featureType" :values="radioTypes" title="类型：" defaultRadio="全部" />
    </div>

    <!-- 搜索及重置按钮 -->
    <el-button-group class="mb">
      <el-button icon="el-icon-search" size="medium" @click="getXmbList">搜索</el-button>
      <el-button icon="el-icon-refresh" size="medium" @click="resetCondition">重置</el-button>
    </el-button-group>

    <!-- 细目表列表 -->
    <el-table :data="xmbList" style="width: 100%" v-loading="loading" empty-text="没有符合条件的细目表" border>
      <el-table-column prop="title" label="细目表名称" align="center">
        <template slot-scope="scope">
          <button class="table-button" @click="toEditXmb(scope.row.featureId)">{{scope.row.featureTitle}}</button>
        </template>
      </el-table-column>
      <el-table-column prop="grade" label="适用年级" width="90" align="center">
      </el-table-column>
      <el-table-column prop="type" label="细目类型" width="90" align="center">
      </el-table-column>
      <el-table-column prop="count" label="题目数量" width="90" align="center">
      </el-table-column>
      <el-table-column prop="useTimes" label="使用次数" width="90" align="center">
      </el-table-column>
      <el-table-column prop="time" label="最近修改时间" width="220" align="center">
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="mt">
      <el-pagination @current-change="pageChanged" :current-page="xmbCondition.pageNum" layout="total, prev, pager, next, jumper" :total="xmbTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'xmb-set',
  data () {
    return {
      xmbCondition: {
        featureSubject: this.$store.getters.getSubject(),
        featureGrade: 0,
        featureType: 0,
        isShare: 1,
        pageNum: 1,
        pageSize: 10
      },

      xmbList: [],

      xmbTotal: 10,

      loading: false
    }
  },
  computed: {
    radioGrades () {
      return this.$store.getters.getGrades()
    },

    radioTypes () {
      let paperTypes = this.$store.state.paperType.paperTypes
      if (paperTypes === null) {
        this.$store.dispatch('getPaperTypes')
        return []
      }
      return paperTypes
    },
  },
  watch: {
    xmbCondition: {
      handler (newVal, oldVal) {
        this.getXmbList()
      },
      deep: true
    }
  },
  mounted () {
    this.getXmbList()
  },
  methods: {
    getXmbList () {
      this.loading = true
      let params = this.deleteUselessAttribute(this.xmbCondition)
      this.getRequest(this.httpUrl.feature, params).then(response => {
        this.loading = false

        this.xmbTotal = response.data.total

        this.xmbList = response.data.list
        this.xmbList.forEach(xmb => {
          let count = 0
          let dt = JSON.parse(xmb.featureJson)
          dt.forEach(dt => {
            dt.xt.forEach(xt => {
              count++
            })
          })
          xmb.count = count
          xmb.grade = this.getValue(this.global.grades, xmb.featureGrade)
          xmb.type = this.getValue(this.radioTypes, xmb.featureType)
          xmb.time = this.readStandardDate(xmb.updateTime, 'minute')
        })
      }).catch(error => {
        this.loading = false
      })
    },

    pageChanged (page) {
      this.xmbCondition.pageNum = page
      this.getXmbList()
    },

    toEditXmb (id) {
      this.$router.push({ path: `/xmb/xmbPreview/${id}` })
    },

    resetCondition () {
      this.xmbCondition.featureGrade = 0
      this.xmbCondition.featureType = 0
      this.xmbCondition.pageNum = 1
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

