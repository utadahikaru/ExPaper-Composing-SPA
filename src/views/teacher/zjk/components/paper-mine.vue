<template>
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
      <el-button icon="el-icon-plus" size="medium" @click="dialogVisible=true">添加组卷</el-button>
    </el-button-group>

    <!-- 组卷列表 -->
    <el-table :data="paperList" style="width: 100%" v-loading="loading" empty-text="没有符合条件的组卷" border>

      <el-table-column label="组卷名称" align="center">
        <template slot-scope="scope">
          <button class="table-button" @click="toPaperPreview(scope.$index)">{{scope.row.paperTitle}}</button>
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
      <el-table-column label="是否公开" width="90" align="center">
        <template slot-scope="scope">
          <button class="table-button" @click="clickShareBtn(scope.$index)">{{scope.row.isShareString}}</button>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="最近修改时间" width="220" align="center">
      </el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <button class="table-button" @click="toPaperEdit(scope.$index)">编辑</button>
          <button class="table-button" @click="removePaper(scope.row.paperId)">删除</button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="mt">
      <el-pagination @current-change="handleCurrentChange" :current-page="paperCondition.pageNum" layout="total, prev, pager, next, jumper" :total="paperTotal">
      </el-pagination>
    </div>

    <!-- 新建试卷 -->
    <el-dialog title="新建组卷" :visible.sync="dialogVisible" width="50%">
      <el-form ref="form" :model="paper" label-width="80px">
        <el-form-item label="年级">
          <el-select v-model="paper.grade" placeholder="请选择年级">
            <el-option v-for="item in radioGrades" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="paper.type">
            <el-radio v-for="item in radioTypes" :key="item.id" :label="item.id">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="试卷名称">
          <el-input v-model="paperTitle"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="newPaper">提 交 </el-button>
      </div>
    </el-dialog>

    <!-- 公开/私有化细目表 -->
    <el-dialog :title="shareDialogTitle" :visible.sync="shareDialogVisible" width="50%">
      <span>{{shareDialogMsg}}</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shareDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateIsShare">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { SET_GRADE_KNOWLEDGE } from "@/store/mutation-types";

export default {
  name: "paper-mine",
  data () {
    return {
      paperCondition: {
        paperSubject: this.$store.getters.getSubject(),
        paperGrade: 0,
        paperType: 0,
        pageNum: 1,
        pageSize: 10
      },
      paper: {
        title: '',
        type: 0,
        grade: '',
      },
      dialogVisible: false,

      paperList: [],

      paperTotal: 10,

      loading: false,

      shareDialogVisible: false,
      // 切换公开状态的细目表索引
      shareIndex: -1,
      // 切换公开状态的对话框标题
      shareDialogTitle: '',
      shareDialogMsg: ''
    };
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
    this.getPaperList();
  },
  computed: {
    createBtnDisabled () {
      return this.paper.title === "";
    },

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

    paperTitle: {
      get: function () {
        let gradeString = this.getValue(this.global.grades, this.paper.grade)
        let subjectString = this.$store.getters.getSubjectName()
        let typeString = this.paper.type === 0 ? '' : this.getValue(this.radioTypes, this.paper.type)
        this.paper.title = gradeString + subjectString + typeString
        return this.paper.title
      },
      // 如果要对计算属性赋值，需要实现setter方法
      set: function (newValue) {
        return newValue
      }
    }
  },
  methods: {
    // 新建试卷
    newPaper () {
      this.dialogVisible = false
      let obj = {
        paperHead: {
          headlineText: "试卷标题",
          subheadText: "副标题",
          paperInfoText: "考试范围：xxx；考试时间：90分钟；命题人：xxx",
          studentInfoText:
            "学校：___________ 姓名：___________ 班级：___________ 考号：___________",
          announcementsText:
            "注意事项：1、答题前填写好自己的姓名、班级、考号等信息 2、请将答案正确填写在答题卡上"
        },
        exerciseInfoList: [],
        exerciseListClassified: []
      }
      let params = {
        paperTitle: this.paper.title,
        paperStatus: 0, //未发布
        paperGrade: this.paper.grade,
        paperSubject: this.$store.getters.getSubject(),
        paperType: this.paper.type,
        isShare: 0, //未公开
        paperJson: JSON.stringify(obj)
      }
      this.postRequest(this.httpUrl.paper, params).then(response => {
        this.getPaperList()
      })
    },

    toEditPaper () {
      this.dialogVisible = false;
      this.$router.push("paperEdit");
    },

    // 获取我的试卷
    getPaperList () {
      this.loading = true;
      let params = this.deleteUselessAttribute(this.paperCondition)
      this.getRequest(this.httpUrl.paper, params).then(response => {
        this.loading = false

        this.paperTotal = response.data.total

        this.paperList = response.data.list
        this.paperList.forEach(paper => {
          let jsonObj = JSON.parse(paper.paperJson);
          let count = jsonObj.exerciseInfoList.length
          paper.count = count

          paper.grade = this.getValue(this.global.grades, paper.paperGrade)
          paper.type = this.getValue(this.radioTypes, paper.paperType)
          paper.isShareString = paper.isShare === 0 ? '私有' : '公开'
          paper.date = this.readStandardDate(paper.updateTime, 'minute')
        })
      }).catch(error => {
        this.loading = false;
      })
    },

    // 分页查询
    handleCurrentChange (page) {
      this.paperCondition.pageNum = page
      this.getPaperList()
    },

    // 删除某次组卷
    removePaper (id) {
      this.$confirm('删除该组卷？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.loading = true;
        let params = { paperId: id }
        this.deleteRequest(this.httpUrl.paper, params).then(response => {
          this.loading = false;
          this.pm("删除成功", "success");
          this.getPaperList();
        })
      })
    },

    toPaperEdit (index) {
      this.$store.commit("setPaper", this.paperList[index]);
      this.$router.push("paperEdit");
    },

    toPaperPreview (index) {
      this.$store.commit("setPaper", this.paperList[index]);
      this.$router.push({ name: "paperPreview" })
    },

    clickShareBtn (index) {
      this.shareDialogVisible = true
      this.shareIndex = index
      this.shareDialogTitle = this.paperList[index].isShare === 0 ? '公开此组卷？' : '私有化此组卷？'
      this.shareDialogMsg = this.paperList[index].isShare === 0 ? '公开后您的组卷将可以被其他教师看到和使用' : '私有化后的组卷只有您自己能看到'
    },

    updateIsShare () {
      this.shareDialogVisible = false
      let isShare = this.paperList[this.shareIndex].isShare === 0 ? 1 : 0
      let params = { paperId: this.paperList[this.shareIndex].paperId, isShare: isShare }
      this.loading = true
      this.putRequest(this.httpUrl.paper, params).then(response => {
        this.loading = false
        this.getPaperList()
      }).catch(error => {
        this.loading = false
      })
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
.new-form {
  width: 600px;
}
</style>
