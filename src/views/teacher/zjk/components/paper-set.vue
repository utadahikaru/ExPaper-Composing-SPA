<template>
  <!-- 我的试卷 -->
  <div>
    <!-- 删选条件 -->
    <div class="search-box">
      <cus-radio v-model="paperCondition.paperGrade" :values="radioGrades" title="年级：" defaultRadio="全部" />
      <cus-radio v-model="paperCondition.paperType" :values="radioTypes" title="类型：" defaultRadio="全部" />
    </div>

    <!-- 搜索及重置按钮 -->
    <el-button-group class="mb">
      <el-button icon="el-icon-search" size="medium" @click="getPaperList">搜索</el-button>
      <el-button icon="el-icon-refresh" size="medium" @click="resetCondition">重置</el-button>
    </el-button-group>

    <!-- 组卷列表 -->
    <el-table :data="paperDataList" style="width: 100%" v-loading="loading" empty-text="没有符合条件的组卷" border>
      <el-table-column label="组卷名称" align="center">
        <template slot-scope="scope">
          <button class="table-button" @click="toPaperPreview(scope.row.paperId)">{{scope.row.paperTitle}}</button>
        </template>
      </el-table-column>
      <el-table-column prop="grade" label="适用年级" width="90" align="center">
      </el-table-column>
      <el-table-column prop="type" label="组卷类型" width="90" align="center">
      </el-table-column>
      <el-table-column prop="count" label="题目数量" width="90" align="center">
      </el-table-column>
      <el-table-column prop="useTimes" label="使用次数" width="90" align="center">
      </el-table-column>
      <el-table-column prop="date" label="最近修改时间" width="220" align="center">
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="mt">
      <el-pagination @current-change="handleCurrentChange" :current-page="paperCondition.pageNum" layout="total, prev, pager, next, jumper" :total="paperTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { SET_GRADE_KNOWLEDGE } from "@/store/mutation-types";

export default {
  name: "paper-set",
  data () {
    return {
      paperCondition: {
        paperSubject: this.$store.getters.getSubject(),
        paperGrade: 0,
        paperType: 0,
        isShare: 1,
        pageNum: 1,
        pageSize: 10
      },

      paperDataList: [],

      paperTotal: 10,

      loading: false
    };
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
    }
  },
  watch: {
    paperCondition: {
      handler (newVal, oldVal) {
        this.getPaperList()
      },
      deep: true
    }
  },
  mounted () {
    this.getPaperList()
  },
  methods: {
    // 获取我的试卷
    getPaperList () {
      this.loading = true

      let params = this.deleteUselessAttribute(this.paperCondition)
      this.getRequest(this.httpUrl.paper, params)
        .then(response => {
          this.loading = false

          this.paperTotal = response.data.total
          this.paperDataList = response.data.list
          this.paperDataList.forEach(paper => {
            let jsonObj = JSON.parse(paper.paperJson);
            let count = jsonObj.exerciseInfoList.length
            paper.count = count

            paper.grade = this.getValue(this.global.grades, paper.paperGrade)
            paper.type = this.getValue(this.radioTypes, paper.paperType)
            paper.date = this.readStandardDate(paper.updateTime, 'minute')
          })
        })
        .catch(error => {
          this.loading = false;
        })
    },

    // 分页查询
    handleCurrentChange (page) {
      this.paperCondition.pageNum = page
      this.getPaperList();
    },

    toPaperPreview (id) {
      this.$router.push({ path: `/zjk/paperCheck/${id}` })
    },

    resetCondition () {
      this.paperCondition.paperGrade = 0
      this.paperCondition.paperType = 0
      this.paperCondition.pageNum = 1
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

