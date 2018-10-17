<template>
  <div class="basket">

    <!-- 分类计数 -->
    <div v-for="(exerciseLists, index) in exerciseListClassified" :key="index">
      <div class="exercise-count-types" v-if="exerciseLists.exerciseList.length > 0">{{getValue(exerciseTypes, exerciseLists.type)}}：共{{exerciseLists.exerciseList.length}}题</div>
    </div>

    <!-- 操作按钮 -->
    <el-button v-show="!clearBtnClicked" icon="el-icon-tickets" type="text" :disabled="exerciseInfoList.length === 0" @click="exercisePreview = true">查看</el-button>
    <el-button v-show="!clearBtnClicked" icon="el-icon-delete" type="text" :disabled="exerciseInfoList.length === 0" @click="clearBtnClicked = true">清空</el-button>
    <el-button v-show="clearBtnClicked" type="text" @click="clearBtnClicked = false">不清空</el-button>
    <el-button v-show="clearBtnClicked" class="button-alert" type="text" @click="clearExercise">确认清空?</el-button>
    <br>
    <el-button class="button" @click="toPaperPreview" :disabled="exerciseInfoList.length === 0">试卷预览</el-button>

    <div style="text-align: left;">
      <!-- 试题篮 -->
      <el-dialog title="" :visible.sync="exercisePreview">
        <!-- 试题篮 -->
        <paper-preview-list />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { CLEAR_EXERCISE_LIST } from "@/store/mutation-types";
import paperPreviewList from "./paper-preview-list";

export default {
  name: "paper-preview-small",
  components: {
    paperPreviewList
  },
  data() {
    return {
      clearBtnClicked: false,
      exercisePreview: false
    };
  },
  computed: {
    exerciseInfoList() {
      return this.$store.state.paper.exerciseInfoList
    },

    exerciseListClassified() {
      return this.$store.state.paper.exerciseListClassified
    },

    exerciseTypes () {
      let exerciseTypes = this.$store.state.exerciseType.exerciseTypes
      if (exerciseTypes === null) {
        this.$store.dispatch('getExerciseTypes')
        return []
      }
      return exerciseTypes
    }
  },
  methods: {
    clearExercise() {
      this.$store.commit(CLEAR_EXERCISE_LIST);
      this.clearBtnClicked = false;

      // 更新组卷
      let params = this.$store.state.paper.paper;
      this.putRequest(this.httpUrl.paper, params).then(response => {
        console.log("更新成功");
      });
    },

    toPaperPreview() {
      this.$emit("toPaperPreview");
    }
  }
};
</script>

<style lang="scss">
.basket {
  width: 160px;
  height: fit-content;

  text-align: center;

  border: $border-solid;
}

.exercise-count-types {
  margin: 4px 10px;
}

.button {
  margin: 8px;
  &-alert {
    color: #f56c6c;

    :hover {
      color: #f56c6c;
    }
  }
}
</style>
