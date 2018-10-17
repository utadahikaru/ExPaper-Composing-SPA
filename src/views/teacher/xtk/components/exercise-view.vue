<template>
  <div>
    <!-- 习题库分析 -->
    <!-- <el-button class="mb" icon="el-icon-tickets" @click="fxDialogVisible = true">习题库分析</el-button> -->

    <div class="filtrate">
      <div class="filtrate-header">
        <div :class="activeTab === '1' ? 'filtrate-btn-selected' : 'filtrate-btn'" @click="activeTab = '1'">章节</div>
        <div :class="activeTab === '2' ? 'filtrate-btn-selected' : 'filtrate-btn'" @click="activeTab = '2'">知识点</div>
      </div>

      <!-- 根据章节筛选组件 -->
      <div v-if="activeTab === '1'" class="filtrate-main">
        <filtrate-chapter ref="filtrateChapter" page="exercise"></filtrate-chapter>
      </div>

      <!-- 根据知识点筛选组件 -->
      <div v-if="activeTab === '2'" class="filtrate-main">
        <filtrate-knowledge ref="filtrateKnowledge" page="exercise"></filtrate-knowledge>
      </div>
    </div>

    <!-- 搜索及重置按钮 -->
    <el-button-group>
      <el-button icon="el-icon-search" size="medium" @click="getExerciseList">搜索</el-button>
      <el-button icon="el-icon-refresh" size="medium" @click="resetCondition">重置</el-button>
    </el-button-group>

    <el-switch class="ml" v-model="collectedOnly" active-text="仅显示收藏题目"></el-switch>

    <!-- 题目列表 -->
    <div v-loading="loading">
      <div v-for="(exercise, index) in exerciseList" :key="index">
        <exercise :exercise="exercise" :shouldEdit="true" v-on:updateExerciseList="updateExerciseList" v-on:updateExercise="updateExercise" v-on:deleteExercise="deleteExercise" />
      </div>
    </div>

    <!-- 分页 -->
    <el-pagination @current-change="handleCurrentChange" :current-page="pageNum" layout="total, prev, pager, next, jumper" :total="exerciseTotal">
    </el-pagination>

    <!-- 试卷分析面板 -->
    <el-dialog title="习题库分析" :visible.sync="fxDialogVisible">
      <sjfx :exerciseList="exerciseList" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="fxDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="fxDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 纠错面板 -->
    <el-dialog title="我要纠错" :visible.sync="correctionDialogVisible">
      <el-input v-model="correction" placeholder="请填写您的纠错意见"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showCorrection = false">取 消</el-button>
        <el-button type="primary" @click="showCorrection = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加题目到组卷 -->
    <el-dialog title="添加题目到组卷" :visible.sync="paperDialogVisible">
      <!-- 组卷列表 -->
      <el-table :data="paperList" style="width: 100%" v-loading="loading" empty-text="没有符合条件的组卷">
        <el-table-column prop="paperTitle" label="组卷名称">
        </el-table-column>
        <el-table-column prop="grade" label="年级" width="80">
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100">
        </el-table-column>
        <el-table-column prop="date" label="创建日期" width="220">
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <span class="button" @click="addExerciseToPaper(scope.row)">添加</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="text">没有合适的组卷？</el-button>
        <el-button type="primary" @click="showNewPaperDialog">新建组卷</el-button>
        <el-button @click="paperDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 新建组卷面板 -->
    <el-dialog title="我要纠错" :visible.sync="newPaperDialogVisible">
      <el-form ref="form" :model="newPaper" label-width="80px">
        <el-form-item label="年级">
          <el-select v-model="newPaper.grade" placeholder="请选择年级">
            <el-option v-for="item in grades" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="newPaper.type">
            <el-radio v-for="(item, index) in paperTypes" :key="index" :label="item.id">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="试卷名称">
          <el-input v-model="paperTitle"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showCorrection = false">取 消</el-button>
        <el-button type="primary" @click="createNewPaper" :disabled="createBtnDisabled">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import filtrateChapter from "views/teacher/common/filtrate-chapter"
import filtrateKnowledge from "views/teacher/common/filtrate-knowledge"
import exerciseCreate from './exercise-create'

export default {
  name: "exercise-view",
  components: {
    filtrateChapter,
    filtrateKnowledge,
    exerciseCreate
  },
  data () {
    return {
      activeTab: "1",
      // 分页
      pageNum: 1,
      pageSize: 10,
      exerciseTotal: 0,
      //题目列表
      exerciseList: [],
      fxDialogVisible: false,
      //对话框可见性
      correctionDialogVisible: false,
      //纠错信息
      correction: "",
      exerciseToUpdate: {},
      //仅显示收藏
      collectedOnly: false,

      // 组卷列表，用于用户添加某题目到某组卷中
      paperList: [],
      paperDialogVisible: false,
      exerciseToAdd: {},

      // 新建组卷
      newPaper: {
        title: "",
        type: 0,
        grade: 0,
        subject: this.$store.getters.getSubject()
      },
      newPaperDialogVisible: false,

      loading: false
    };
  },
  computed: {
    grades () {
      return this.$store.getters.getGrades()
    },

    paperTypes () {
      let paperTypes = this.$store.state.paperType.paperTypes
      if (paperTypes === null) {
        this.$store.dispatch('getPaperTypes')
        return []
      }
      return paperTypes
    },

    paperTitle () {
      let gradeString = this.getValue(this.grades, this.newPaper.grade);
      let typeString =
        this.newPaper.type === 0
          ? ""
          : this.getValue(this.paperTypes, this.newPaper.type);
      this.newPaper.title = gradeString + this.$store.getters.getSubjectName() + typeString;
      return this.newPaper.title;
    },

    createBtnDisabled () {
      return this.newPaper.title === "";
    },

    xtCondition () {
      return this.$store.state.exerciseView.xtCondition
    }
  },
  watch: {
    pageNum () {
      this.$store.commit("setConditionPageNum", this.pageNum)
    },

    collectedOnly () {
      this.getExerciseList()
    },

    xtCondition: {
      handler (newVal, oldVal) {
        this.getExerciseList()
      },
      deep: true
    }
  },
  mounted () {
    this.getExerciseList();
  },
  methods: {
    getExerciseList () {
      this.loading = true;
      let params = this.deleteUselessAttribute(this.xtCondition)
      params.exerciseSubject = this.$store.getters.getSubject()
      if (this.collectedOnly) {
        params.isCollect = 1
      }
      this.getRequest(this.httpUrl.exerciseCollect, params)
        .then(response => {
          this.loading = false
          this.exerciseList = response.data.list
          this.exerciseTotal = response.data.total
        })
        .catch(error => {
          this.loading = false;
        })
    },

    resetCondition () {
      this.$store.commit("resetCondition")
      if (this.$refs.filtrateChapter !== undefined) {
        this.$refs.filtrateChapter.setupCondition()
      }
      if (this.$refs.filtrateKnowledge !== undefined) {
        this.$refs.filtrateKnowledge.setupCondition()
      }
    },

    handleCurrentChange (pageNum) {
      this.pageNum = pageNum;
      this.$store.commit("setConditionPageNum", pageNum);
      this.getExerciseList();
    },

    // 用户点击题目“添加到组卷按钮”，去获取组卷，询问用户想将题目添加到哪个组卷
    updateExerciseList (exercise) {
      this.exerciseToAdd = exercise;
      this.getPaperList();
    },

    // 获取我的试卷
    getPaperList () {
      let params = { pageNum: 1, pageSize: 100, paperStatus: 2 };
      this.getRequest(this.httpUrl.paper, params).then(response => {
        this.paperDialogVisible = true;

        this.paperList = []
        let list = response.data.list
        list.forEach(paper => {
          paper.paperObject = JSON.parse(paper.paperJson);
          if (paper.createTime !== null) {
            let date = new Date(paper.createTime.replace(/\-/g, "/")); //为了让safari能识别，需要把日期中的'-'换成'/'
            let month = date.getMonth() + 1
            let year = date.getFullYear()
            let day = date.getDate()
            let hours = date.getHours()
            let mints = date.getMinutes()
            paper.date = year + "年" + month + "月" + day + "日 " + hours + "时" + mints + "分"
          }
          paper.grade = this.getValue(this.grades, paper.paperGrade)
          paper.type = this.getValue(this.paperTypes, paper.paperType)
          paper.state = 0
          this.paperList.push(paper)
        })
      })
    },

    // 选定了组卷，将题目添加进去
    addExerciseToPaper (paper) {
      this.paperDialogVisible = false;

      // 先解析出题目信息列表和题目列表
      let obj = JSON.parse(paper.paperJson);
      let paperHead = obj.paperHead;
      let exerciseInfoList = obj.exerciseInfoList;
      let exerciseListClassified = obj.exerciseListClassified;

      // 判断该题目是否在组卷中
      let index = -1;
      for (let i = 0; i < exerciseInfoList.length; i++) {
        const exerciseInfo = exerciseInfoList[i];
        if (exerciseInfo.exerciseNumber === this.exerciseToAdd.exerciseNumber) {
          index = i;
          break;
        }
      }

      if (index !== -1) {
        // 该题目已存在于组卷中，已经达到用户的目的，那么直接返回
        this.pm("添加题目成功", "success");
        return;
      }

      // 不存在，那么将题目插入组卷

      // 先把题目信息加到题目信息列表中
      this.addExerciseToInfoList(exerciseInfoList);
      // 再把题目添加到分类题目表中
      this.addExerciseToClassifiedList(exerciseListClassified);
      // 最后更新组卷
      this.updatePaper(
        paper,
        paperHead,
        exerciseInfoList,
        exerciseListClassified
      );
    },

    addExerciseToInfoList (exerciseInfoList) {
      let exerciseInfo = {
        exerciseNumber: this.exerciseToAdd.exerciseNumber,
        exerciseDifficulty: this.exerciseToAdd.exerciseDifficulty,
        knowledgeName: this.exerciseToAdd.knowledgeName
      };
      exerciseInfoList.push(exerciseInfo);
    },

    addExerciseToClassifiedList (exerciseListClassified) {
      // 判断组卷列表中有没有该类型的题目
      let typeIndex = -1;
      for (let i = 0; i < exerciseListClassified.length; i++) {
        let exerciseInType = exerciseListClassified[i];
        if (exerciseInType.type === this.exerciseToAdd.exerciseType) {
          // 新加的题目指定其分数为大题分数
          this.exerciseToAdd.score = exerciseInType.score;
          // 有，直接将题目插入该类型题目列表
          exerciseInType.exerciseList.push(this.exerciseToAdd);
          typeIndex = i;
          break;
        }
      }

      if (typeIndex === -1) {
        // 没有，那么创建该类型题目并将题目插入该类型题目列表
        let exerciseInType = {
          type: this.exerciseToAdd.exerciseType,
          score: 10, // 新建时指定每题10分
          exerciseList: []
        };
        this.exerciseToAdd.score = 10;
        exerciseInType.exerciseList.push(this.exerciseToAdd);
        // 将该类型题目插入组卷分类题目表
        exerciseListClassified.push(exerciseInType);
      }

      this.setupExerciseIndex(exerciseListClassified);
    },

    setupExerciseIndex (exerciseListClassified) {
      let index = 0;
      exerciseListClassified.forEach(exerciseInType => {
        exerciseInType.exerciseList.forEach(exercise => {
          index++;
          exercise.index = index;
        });
      });
    },

    // 更新组卷
    updatePaper (paper, paperHead, exerciseInfoList, exerciseListClassified) {
      let obj = {
        paperHead: paperHead,
        exerciseInfoList: exerciseInfoList,
        exerciseListClassified: exerciseListClassified
      };
      paper.paperJson = JSON.stringify(obj);
      this.putRequest(this.httpUrl.paper, paper).then(response => {
        console.log("更新成功");
        this.pm("添加题目成功", "success");
      });
    },

    // 显示新建组卷面板
    showNewPaperDialog () {
      this.paperDialogVisible = false;
      this.newPaperDialogVisible = true;
    },

    // 新建组卷
    createNewPaper () {
      this.newPaperDialogVisible = false;

      // 组装题目信息列表
      let exerciseInfoList = [];
      this.addExerciseToInfoList(exerciseInfoList);

      // 组装题目列表
      let exerciseListClassified = [];
      this.addExerciseToClassifiedList(exerciseListClassified);

      // 组装paper.paperJson
      let obj = {
        paperHead: {
          headlineText: "试卷标题",
          subheadText: "副标题",
          paperInfoText: "考试范围：xxx；考试时间：100分钟；命题人：xxx",
          studentInfoText: "学校：___________ 姓名：___________ 班级：___________ 考号：___________",
          announcementsText: "注意事项：1、答题前填写好自己的姓名、班级、考号等信息 2、请将答案正确填写在答题卡上"
        },
        exerciseInfoList: exerciseInfoList,
        exerciseListClassified: exerciseListClassified
      };

      // 组装组卷
      let paper = {
        paperTitle: this.newPaper.title,
        paperStatus: 2, //未发布
        paperGrade: this.newPaper.grade,
        paperSubject: this.newPaper.subject,
        paperType: this.newPaper.type,
        paperJson: JSON.stringify(obj)
      };

      // 创建组卷
      this.postRequest(this.httpUrl.paper, paper).then(response => {
        this.pm("添加题目成功", "success");
      });
    },

    deleteExercise (id) {
      // 删除题目
      this.deleteRequest(this.httpUrl.exercise, { exerciseNumber: id }).then(
        response => {
          this.pm("删除题目成功", "success");
          this.getExerciseList();
        }
      );
    },

    updateExercise (exercise) {
      this.$router.push({ name: "exerciseEdit", params: { exerciseToUpdate: exercise } })
    }
  }
};
</script>

<style lang="scss" scoped>
.button {
  margin: 0 12px 0 0;

  cursor: pointer;

  color: #409eff;

  font-size: 14px;
}

.filtrate {
  border: $border-solid;
  margin-bottom: 10px;

  &-header {
    display: flex;

    background-color: #f1f1f1;
  }

  &-btn {
    padding: 10px 24px;

    cursor: pointer;

    color: gray;
  }

  &-btn-selected {
    padding: 10px 24px;

    cursor: pointer;

    color: $color-blue;
    background-color: white;
  }

  &-main {
    margin: 10px;
  }
}
</style>

