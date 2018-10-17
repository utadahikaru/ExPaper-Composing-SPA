<template>
  <div class="bqteam-main-wrap-inner">

    <div class="head">
      <el-button type="text" size="medium" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
      <span class="ml">{{paperTitle}}</span>
    </div>

    <div class="div-flex">
      <div class="main">

        <div class="filtrate">
          <div class="filtrate-header">
            <div :class="activeTab === '1' ? 'filtrate-btn-selected' : 'filtrate-btn'" @click="activeTab = '1'">章节</div>
            <div :class="activeTab === '2' ? 'filtrate-btn-selected' : 'filtrate-btn'" @click="activeTab = '2'">知识点</div>
          </div>

          <!-- 根据章节筛选组件 -->
          <div v-if="activeTab === '1'" class="filtrate-main">
            <filtrate-chapter ref="filtrateChapter" page="paper"></filtrate-chapter>
          </div>

          <!-- 根据知识点筛选组件 -->
          <div v-if="activeTab === '2'" class="filtrate-main">
            <filtrate-knowledge ref="filtrateKnowledge" page="paper"></filtrate-knowledge>
          </div>

        </div>

        <!-- 搜索及重置按钮 -->
        <el-button-group>
          <el-button icon="el-icon-search" size="medium" @click="getExerciseList">搜索</el-button>
          <el-button icon="el-icon-refresh" size="medium" @click="resetCondition">重置</el-button>
        </el-button-group>

        <!-- 题目列表 -->
        <div v-loading="exerciseLoading">
          <div v-for="(exercise, index) in exerciseList" :key="index">
            <exercise :exercise="exercise" :inPaper="isExerciseInBasket(exercise)" :shouldCorrect="true" v-on:updateExerciseList="updateExerciseList" v-on:correctExercise="correctExercise" />
          </div>
          <!-- 分页 -->
          <el-pagination @current-change="handleCurrentChange" :current-page="pageNum" layout="total, prev, pager, next, jumper" :total="exerciseTotal">
          </el-pagination>
        </div>

      </div>

      <!-- 试题篮 -->
      <preview-small v-on:toPaperPreview="toPaperPreview" />
    </div>

    <!-- 纠错面板 -->
    <el-dialog title="我要纠错" :visible.sync="showCorrection">
      <el-input v-model="correction" placeholder="请填写您的纠错意见"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showCorrection = false">取 消</el-button>
        <el-button type="primary" @click="showCorrection = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import store from "@/store";
import previewSmall from "./components/paper-preview-small";
import {
  SET_XT_CONDITION,
  RESET_XT_CONDITION,
  UPDATE_EXERCISE_LIST,
  SET_TEXTBOOK_LIST,
  SET_KNOWLEDGE_LIST
} from "@/store/mutation-types";
import filtrateChapter from "views/teacher/common/filtrate-chapter";
import filtrateKnowledge from "views/teacher/common/filtrate-knowledge";

export default {
  components: {
    previewSmall,
    filtrateChapter,
    filtrateKnowledge
  },
  data () {
    return {
      activeTab: "1",
      // 根据章节/知识点选题
      // xtCondition: {},
      //题目列表
      exerciseList: [],

      //显示/不显示"纠错"面板
      showCorrection: false,
      //纠错信息
      correction: "",

      // 分页信息
      exerciseTotal: 0,
      pageNum: 1,

      exerciseLoading: false
    };
  },
  computed: {
    paperTitle () {
      return this.$store.state.paper.paper.paperTitle;
    },

    exerciseListInBasket () {
      return this.$store.state.paper.exerciseList;
    },

    textbooks () {
      let emptyList = [];
      let list = this.$store.getters.textbookList(this.grade, this.subject);
      if (list.length > 0) {
        // 统一格式
        list.forEach(element => {
          let obj = {
            grade: element.bookGrade,
            id: element.bookNumber,
            label: element.bookName,
            level: element.bookLevel,
            pnumber: element.bookPNumber,
            subject: element.bookSubject
          };
          emptyList.push(obj);
        });
        this.selectedTextbookNumber = emptyList[0].id;
        return emptyList;
      } else {
        // 如果当前年级科目下没有教材，那么给this.textbooks一个空的教材，以便在其基础上新建教材
        return [
          {
            grade: this.grade,
            id: "",
            label: "",
            level: 0,
            pnumber: "k",
            subject: this.subject
          }
        ];
      }
    },

    chapterTree () {
      return this.$store.getters.chapterTree(
        this.grade,
        this.subject,
        this.textbook
      )
    },

    xtCondition () {
      return this.$store.state.paper.xtCondition
    }
  },
  watch: {
    xtCondition: {
      handler: function (newVal, oldVal) {
        this.getExerciseList()
      },
      deep: true
    }
  },
  mounted () {
    this.checkPaperExist();
  },
  methods: {
    // 检查试卷是否存在，如果不存在（用户刷新了页面）就返回到试卷列表页面
    checkPaperExist () {
      if (this.$store.state.paper.paper.paperTitle === undefined) {
        this.$router.go(-1);
      } else {
        this.getExerciseList()
      }
    },

    // 重置选题条件
    resetCondition () {
      this.$store.commit("resetXtCondition")
      if (this.$refs.filtrateChapter !== undefined) {
        this.$refs.filtrateChapter.setupCondition()
      }
      if (this.$refs.filtrateKnowledge !== undefined) {
        this.$refs.filtrateKnowledge.setupCondition()
      }
    },

    /**
     * 获取题目
     */
    getExerciseList () {
      this.exerciseLoading = true;
      let params = this.deleteUselessAttribute(this.xtCondition)
      params.exerciseSubject = this.$store.getters.getSubject()
      this.getRequest(this.httpUrl.exerciseCollect, params)
        .then(response => {
          this.exerciseLoading = false;

          this.exerciseList = response.data.list;
          this.exerciseTotal = response.data.total;
        })
        .catch(error => {
          this.exerciseLoading = false;
        });
    },

    // 判断该题目是否存在组卷中
    isExerciseInBasket (exercise) {
      let exerciseInfoList = this.$store.state.paper.exerciseInfoList;
      let index = -1;
      for (let i = 0; i < exerciseInfoList.length; i++) {
        const exerciseInfo = exerciseInfoList[i];
        if (exerciseInfo.exerciseNumber === exercise.exerciseNumber) {
          index = i;
          break;
        }
      }
      return index !== -1;
    },

    /**
     * 如果试题篮中没有该题目，则向试题篮增加该题目，反之移除
     */
    updateExerciseList (exercise) {
      this.$store.commit("addExercise", exercise);

      // 更新组卷
      let params = this.$store.state.paper.paper;
      this.putRequest(this.httpUrl.paper, params).then(response => {
        console.log("更新成功");
      });
    },

    /**
     * @description 纠正题目
     * @param (string) id 题目编号
     */
    correctExercise (id) {
      this.showCorrection = true;
    },

    /**
     * @description 跳转至试卷预览
     */
    toPaperPreview () {
      this.$router.push({ name: "paperPreview" })
    },

    // 分页查询
    handleCurrentChange (page) {
      // this.pageNum = page
      this.xtCondition.pageNum = page;
      this.getExerciseList();
    }
  }
};
</script>

<style lang="scss" scoped>
.head {
  border-bottom: $border-solid;
  margin-bottom: 12px;
}

.main {
  flex: 1;

  margin: 0 10px;
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