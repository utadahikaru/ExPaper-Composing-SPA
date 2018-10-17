<template>
  <div class="bqteam-main-wrap-inner">

    <div class="head">
      <el-button type="text" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
      <span class="ml">{{paper.paperTitle}}</span>
    </div>

    <div class="generate-div">
      <el-button size="small" icon="el-icon-tickets" round @click="generateMyPaper">生成试卷</el-button>
    </div>

    <div v-loading="loading">
      <!-- 大题列表 -->
      <div v-for="(dt, index) in exerciseListClassified" :key="index">
        <div>{{global.indexInChinese[index] + "、" + getValue(exerciseTypes, dt.type)}}</div>
        <!-- 小题列表 -->
        <div v-for="xt in dt.exerciseList" :key="xt.exerciseNumber">
          <exercise :exercise="xt" :shouldEdit="false" :showProperty="false" :shouldCorrect="true" v-on:updateExerciseList="updateExerciseList" />
        </div>
      </div>
    </div>

    <!-- 添加题目到组卷 -->
    <el-dialog title="添加题目到组卷" :visible.sync="paperDialogVisible">
      <!-- 组卷列表 -->
      <el-table :data="paperList" style="width: 100%;" height="300" v-loading="loading" empty-text="没有符合条件的组卷">
        <el-table-column prop="paperTitle" label="组卷名称">
        </el-table-column>
        <el-table-column prop="grade" label="年级" width="80">
        </el-table-column>
        <el-table-column prop="subject" label="科目" width="80">
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
          <el-select v-model="newPaper.grade" placeholder="请选择年级" @change="setupTitle()">
            <el-option v-for="item in grades" :key="item.c" :label="item.v" :value="item.c">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="newPaper.type" @change="setupTitle()">
            <el-radio v-for="(item, index) in paperTypes" :key="index" :label="item.c">{{item.v}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="试卷名称">
          <el-input v-model="newPaper.title"></el-input>
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

export default {
  data () {
    return {
      paper: {},
      exerciseListClassified: {},
      updateDate: '',

      // 组卷列表，用于用户添加某题目到某组卷中
      paperList: [],
      paperDialogVisible: false,
      exerciseToAdd: {},

      // 新建组卷
      newPaper: {
        title: "",
        type: 0,
        grade: 7,
        subject: 2
      },
      newPaperDialogVisible: false,

      loading: false
    }
  },
  computed: {
    createBtnDisabled () {
      return this.newPaper.title === "";
    },

    grades () {
      return this.$store.getters.getGrades()
    },

    exerciseTypes () {
      let exerciseTypes = this.$store.state.exerciseType.exerciseTypes
      if (exerciseTypes === null) {
        this.$store.dispatch('getExerciseTypes')
        return []
      }
      return exerciseTypes
    },

    paperTypes () {
      let paperTypes = this.$store.state.paperType.paperTypes
      if (paperTypes === null) {
        this.$store.dispatch('getPaperTypes')
        return []
      }
      return paperTypes
    }
  },
  mounted () {
    this.getPaper()
  },
  methods: {
    getPaper () {
      this.loading = true

      let paperId = this.$route.params.paperId
      let params = { paperId: paperId }
      this.getRequest(this.httpUrl.paper, params).then(response => {
        this.loading = false

        this.paper = response.data.list[0]

        this.updateDate = this.readStandardDate(this.paper.updateTime, 'day')

        // 解析出题目列表
        let obj = JSON.parse(this.paper.paperJson)
        this.exerciseListClassified = obj.exerciseListClassified
      }).catch(error => {
        this.loading = false
      })
    },

    generateMyPaper () {
      let params = {
        paperTitle: this.paper.paperTitle,
        paperStatus: 2,
        paperGrade: this.paper.paperGrade,
        paperSubject: this.paper.paperSubject,
        paperType: this.paper.paperType,
        paperJson: this.paper.paperJson
      };
      this.postRequest(this.httpUrl.paper, params).then(response => {
        this.$store.commit('setPaperPageTab', '2')
        this.$alert('已经生成新的组卷，请在“我的组卷”页面进行查看和编辑', '操作成功', {
          confirmButtonText: '确定',
          callback: action => {
            this.$router.back(-1)
          }
        })
      }).catch(error => {
        this.pm("组卷生成失败，请重试", "error")
      })
    },

    // 用户点击题目“添加到组卷按钮”，去获取组卷，询问用户想将题目添加到哪个组卷
    updateExerciseList (exercise) {
      this.exerciseToAdd = exercise
      this.getPaperList()
    },

    // 获取我的试卷
    getPaperList () {
      let params = { pageNum: 1, pageSize: 100, paperStatus: 2 };
      this.getRequest(this.httpUrl.paper, params).then(response => {
        this.paperDialogVisible = true

        this.paperList = []

        let list = response.data.list
        list.forEach(paper => {
          paper.paperObject = JSON.parse(paper.paperJson)

          paper.date = this.readStandardDate(paper.updateTime, 'minute')
          paper.grade = this.getValue(this.grades, paper.paperGrade)
          paper.type = this.getValue(this.paperTypes, paper.paperType)
          this.paperList.push(paper)
        });
      });
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

    // 新建组卷时，自动拼接组卷名
    setupTitle () {
      let gradeString = this.getValue(this.grades, this.newPaper.grade);
      let subjectString = this.$store.getters.getSubjectName()
      let typeString = this.newPaper.type === 0 ? "" : this.getValue(this.paperTypes, this.newPaper.type)
      this.newPaper.title = gradeString + subjectString + typeString
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
      }

      // 创建组卷
      this.postRequest(this.httpUrl.paper, paper).then(response => {
        this.pm("添加题目成功", "success");
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.head {
  border-bottom: $border-solid;
  margin-bottom: 12px;
}

.generate-div {
  text-align: end;
}

.button {
  margin: 0 12px 0 0;

  cursor: pointer;

  color: #409eff;

  font-size: 14px;
}
</style>

