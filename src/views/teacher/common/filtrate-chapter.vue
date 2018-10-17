<template>
  <div>
    <cus-radio v-if="page === 'exercise'" v-model="xtCondition.exerciseGrade" :values="radioGrades" title="适用年级：" :defaultRadio="'不限'" />
    <div>
      <span class="label">教材章节：</span>
      <el-cascader size="small" expand-trigger="hover" v-model="xtCondition.defaultChapter" :options="chapterTree" placeholder="全部" :show-all-levels="false" @change="selectChapter" @focus="beforeSelectChapter" clearable style="margin-left:14px;"></el-cascader>
    </div>
    <cus-radio v-model="xtCondition.exerciseType" :values="radioExerciseTypes" title="题目类型：" :defaultRadio="'不限'" />
    <cus-radio v-model="xtCondition.exerciseDifficulty" :values="global.difficulties" title="难易程度：" :defaultRadio="'不限'" />
    <cus-radio v-model="xtCondition.sort" :values="global.sorts" title="排序方式：" />
  </div>
</template>

<script>
import { SET_TEXTBOOK_LIST } from "@/store/mutation-types";

export default {
  name: "filtrate-chapter",
  data () {
    return {
      // 筛选条件
      xtCondition: {}
    };
  },
  props: {
    page: {
      validator: function (value) {
        // page值必须匹配下列字符串中的一个
        return ["paper", "exercise"].indexOf(value) !== -1;
      }
    }
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
        return this.$store.getters.chapterTreeForSelection(this.xtCondition.exerciseGrade)
      }
    }
  },
  watch: {
    xtCondition: {
      handler: function (newVal, oldVal) {
        if (this.page === "exercise") {
          this.$store.commit("setCondition", this.xtCondition);
        } else {
          this.$store.commit("setXtCondition", this.xtCondition);
        }
      },
      deep: true
    }
  },
  mounted () {
    this.setupCondition();
    this.getTextbookList();
  },
  methods: {
    setupCondition () {
      if (this.page === "exercise") {
        let condition = this.$store.state.exerciseView.xtCondition;
        this.xtCondition = JSON.parse(JSON.stringify(condition));
      } else {
        let condition = this.$store.state.paper.xtCondition;
        this.xtCondition = JSON.parse(JSON.stringify(condition));
      }
    },

    getTextbookList () {
      this.$store.dispatch("getTextbook");
    },

    selectChapter (value) {
      if (value.length > 0) {
        this.xtCondition.bookNumber = value[value.length - 1];
      }
    },

    beforeSelectChapter () {
      if (this.chapterTree.length === 0) {
        this.pm('该年级还未编辑章节', 'warning')
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.label {
  font-size: 14px;
  line-height: 32px;
  color: #606266;
}
</style>

