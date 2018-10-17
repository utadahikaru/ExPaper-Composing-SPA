<template>
  <div class="bqteam-main-wrap-inner">
    <el-button type="text" size="medium" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>

    <!-- 题目属性 -->
    <div class="property">
      <!-- 题目来源 -->
      <cus-radio v-model="exercise.exerciseGrade" :values="radioGrades" title="适用年级：" />
      <cus-radio v-model="exercise.exerciseType" :values="radioExerciseTypes" title="题目类型：" />
      <cus-radio v-model="exercise.exerciseDifficulty" :values="global.difficulties" title="题目难度：" />
      <div>
        <span class="el-form-item__label">所属章节：</span>
        <el-cascader expand-trigger="hover" :options="chapterTree" v-model="selectedChapter" :show-all-levels="false" @change="selectChapter"></el-cascader>
      </div>

      <!-- 包含知识点 -->
      <div class="kp-div">
        <span class="kp-label">包含知识点：</span>
        <div class="kp-divs">
          <span class="kp" v-for="(kp,index) in selectedKnowledgeName" :key="index">{{kp}}
            <li class="el-icon-remove" @click="removeKnowledge(index)"></li>
          </span>
          <span class="add-kp-button" @click="kpDialogVisible = true">添加知识点</span>
        </div>
      </div>

    </div>

    <!-- 题目内容 -->
    <div class="content">
      <!-- 题目 -->
      <span>题目</span>
      <div id="container4" type="text/plain" style="height:150px"></div>
      <br>

      <!-- 答案 -->
      <span>答案</span>
      <div id="container5" type="text/plain" style="height:100px"></div>
      <br>

      <!-- 解析 -->
      <span>解析</span>
      <div id="container6" type="text/plain" style="height:150px"></div>
    </div>
    <br>

    <el-button size="medium" icon="el-icon-upload2" @click="uploadExercise">上传</el-button>

    <!-- 知识点选择面板 -->
    <el-dialog title="选择知识点" :visible.sync="kpDialogVisible">
      <el-cascader expand-trigger="hover" :options="knowledgeTree" @change="selectKnowledge"></el-cascader>
    </el-dialog>
  </div>
</template>

<script>
import "@/../static/plugins/ueditor-math-frontend/ueditor.config.js";
import "@/../static/plugins/ueditor-math-frontend/ueditor.all.min.js";
import "@/../static/plugins/ueditor-math-frontend/lang/zh-cn/zh-cn.js";
import "@/../static/plugins/ueditor-math-frontend/third-party/kityformula-plugin/addKityFormulaDialog.js";
import "@/../static/plugins/ueditor-math-frontend/third-party/kityformula-plugin/defaultFilterFix.js";

import { SET_TEXTBOOK_LIST, SET_KNOWLEDGE_LIST } from '@/store/mutation-types'

export default {
  name: 'exercise-eidt',
  data () {
    return {
      // 题目属性
      exercise: {},
      //区别于exercise.bookNmuber，这里是教材number，exercise.bookNmuber是节id
      bookNumber: '',
      kpDialogVisible: false,
      selectedKnowledge: [],
      selectedKnowledgeName: [],
      selectedChapter: [],
      //题目编辑器
      instance4: null,
      instance5: null,
      instance6: null,

      latexStringEmpty: ''
    };
  },
  computed: {
    radioGrades () {
      return this.$store.getters.getGrades()
    },

    radioExerciseTypes () {
      let exerciseTypes = this.$store.state.exerciseType.exerciseTypes
      if (exerciseTypes === null) {
        this.$store.dispatch('getExerciseTypes')
        return []
      }
      return exerciseTypes
    },

    chapterTree () {
      if (this.$store.state.textbook.textbookList === null) {
        this.$store.dispatch('getTextbook')
        return []
      } else {
        return this.$store.getters.chapterTreeForSelection(this.exercise.exerciseGrade)
      }
    },

    knowledgeTree () {
      if (this.$store.state.knowledge.knowledgeList === null) {
        this.$store.dispatch('getKnowledge')
        return []
      } else {
        return this.$store.getters.knowledgeTree(this.exercise.exerciseGrade)
      }
    }
  },
  mounted () {
    this.setupData()
  },
  methods: {
    setupData () {
      this.exercise = this.$route.params.exerciseToUpdate
      if (this.exercise === undefined) {
        this.$router.go(-1)
        return
      }

      this.selectedKnowledge = this.exercise.knowledgeName.split('@')
      this.selectedKnowledgeName = this.exercise.knowledgeName.split('@')

      let selectedSectionNumber = this.exercise.bookNumber
      let selectedChapterNumber = selectedSectionNumber.substring(0, selectedSectionNumber.length - 2)
      let selectedBookNumber = selectedSectionNumber.substring(0, selectedSectionNumber.length - 4)
      this.selectedChapter = [selectedBookNumber, selectedChapterNumber, selectedSectionNumber]

      this.initEditor()
    },

    selectChapter (value) {
      this.exercise.bookNumber = value[value.length - 1]
      this.exercise.bookName = this.$store.getters.sectionName(this.exercise.bookNumber)
    },

    selectKnowledge (value) {
      this.kpDialogVisible = false

      let number = value[value.length - 1]
      this.selectedKnowledge.push(number)
      let name = this.$store.getters.knowledgeName(number)
      this.selectedKnowledgeName.push(name)

      this.setupExerciseKnowledge()
    },

    removeKnowledge (index) {
      this.selectedKnowledge.splice(index, 1)
      this.selectedKnowledgeName.splice(index, 1)

      this.setupExerciseKnowledge()
    },

    setupExerciseKnowledge () {
      this.exercise.knowledgeNumber = ''
      this.exercise.knowledgeName = ''
      for (let i = 0; i < this.selectedKnowledge.length; i++) {
        if (i < this.selectedKnowledge.length - 1) {
          this.exercise.knowledgeNumber += this.selectedKnowledge[i] + '@'
          this.exercise.knowledgeName += this.selectedKnowledgeName[i] + '@'
        } else {
          this.exercise.knowledgeNumber += this.selectedKnowledge[i]
          this.exercise.knowledgeName += this.selectedKnowledgeName[i]
        }
      }
    },

    /**
     * 题目编辑器
     */
    initEditor () {
      this.$nextTick(() => {
        this.instance4 = UE.getEditor("container4");
        this.instance4.addListener("ready", () => {
          this.$emit("ready", this.instance4);
          this.instance4.setContent(this.exercise.exerciseQuestion)

        });

        this.instance5 = UE.getEditor("container5");
        this.instance5.addListener("ready", () => {
          this.$emit("ready", this.instance5);
          this.instance5.setContent(this.exercise.exerciseAnswer)
        });

        this.instance6 = UE.getEditor("container6");
        this.instance6.addListener("ready", () => {
          this.$emit("ready", this.instance6);
          this.instance6.setContent(this.exercise.exerciseAnalyse)
        });
      });
    },

    /**
     * 上传题目
     */
    uploadExercise () {
      this.exercise.exerciseQuestion = this.instance4.getContent()
      this.exercise.exerciseAnswer = this.instance5.getContent()
      this.exercise.exerciseAnalyse = this.instance6.getContent()
      this.exercise.questionLatex = this.getExerciseLatex(this.instance4)
      this.exercise.answerLatex = this.getExerciseLatex(this.instance5)
      this.exercise.analyseLatex = this.getExerciseLatex(this.instance6)

      if (!this.uploadEnable()) {
        return
      }

      this.$store.commit('loading', true)
      this.putRequest(this.httpUrl.exercise, this.exercise).then(response => {
        this.$store.commit('loading', false)
        console.log('createExercise succeed!');
        this.pm('题目修改成功', 'success')
        this.instance4.setContent('')
        this.instance5.setContent('')
        this.instance6.setContent('')
      }).catch(error => {
        this.$store.commit('loading', false)
      })
    },

    getExerciseLatex (instance) {
      this.latexStringEmpty = ''
      this.getExerciseLatexOf(instance.body)
      return this.latexStringEmpty
    },

    getExerciseLatexOf (node) {
      if (node.childNodes.length > 0) {
        node.childNodes.forEach(element => {
          this.getExerciseLatexOf(element)
        })
      } else {
        if (node.nodeType === 1) {
          if (node.className === 'aurthur-math-ky') {
            let s = '$' + node.dataset.latex + '$'
            this.latexStringEmpty += s
          }
        } else if (node.nodeType === 3) {
          this.latexStringEmpty += node.data
        }
      }
      if (node.tagName === 'P') {
        this.latexStringEmpty += '<br>'
      }
    },

    uploadEnable () {
      if (this.exercise.bookNumber === '') {
        this.pm('请选择题目所属章节', 'warning')
        return false
      }
      if (this.exercise.knowledgeNumber === '') {
        this.pm('请选择题目包含知识点', 'warning')
        return false
      }
      if (this.exercise.exerciseQuestion === '') {
        this.pm('请填写题目', 'warning')
        return false
      }
      if (this.exercise.exerciseAnswer === '') {
        this.pm('请填写答案', 'warning')
        return false
      }
      if (this.exercise.exerciseAnalyse === '') {
        this.pm('请填写解析', 'warning')
        return false
      }
      return true
    }
  },
  beforeDestroy () {
    if (this.instance4 !== null) {
      this.instance4.destroy();
    }

    if (this.instance5 !== null) {
      this.instance5.destroy();
    }

    if (this.instance6 !== null) {
      this.instance6.destroy();
    }
  }
};
</script>

<style lang="scss" scoped>
.property {
  padding: 10px;

  border: $border-solid;
}

.input-short {
  width: 400px;
}

.kp-label {
  margin: 8px 0;
  font-size: 14px;
}

.kp-div {
  display: flex;

  margin: 10px 0;
}

.kp-divs {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
}

.kp {
  width: fit-content;
  margin: 4px;
  padding: 4px;

  border-radius: 5px;
  background: #f1f1f1;
}

.add-kp-button {
  margin: 4px;
  padding: 3px;

  text-align: center;

  border: $border-dashed;
  border-radius: 5px;

  &:hover {
    background: #d4d4ff;
  }
}

.content {
  margin-top: 10px;
  padding: 10px;

  border: $border-solid;
}
</style>

