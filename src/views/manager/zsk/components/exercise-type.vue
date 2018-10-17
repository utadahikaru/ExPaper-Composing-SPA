<template>
  <div>
    <div class="div-flex">
      <span class="item-on" :key="index" v-for="(exerciseType, index) in exerciseTypes" v-if="exerciseType.isUse === 1">
        {{exerciseType.exerciseTypeName}}
        <i v-if="edit" type="text" size="small" class="el-icon-close item-icon" @click="removeItem(exerciseType)"></i>
      </span>
      <span v-if="!edit" class="item-add" @click="edit = !edit">
        <i class="el-icon-edit"></i>
      </span>
      <span v-if="edit" class="item-add" @click="edit = false">完成</span>
    </div>
    <div class="cutline" v-if="edit">未启用题目类型</div>

    <div class="div-flex" v-if="edit">
      <span class="item-off" :key="index" v-for="(exerciseType, index) in exerciseTypes" v-if="exerciseType.isUse === 0">
        {{exerciseType.exerciseTypeName}}
        <i v-if="edit" type="text" size="small" class="el-icon-plus item-icon" @click="addItem(exerciseType)"></i>
      </span>
    </div>

  </div>
</template>

<script>
export default {
  name: 'exercise-type',
  data () {
    return {
      edit: false,
      dialogUpdateVisible: false,
      dialogAddVisible: false,

      typeToUpdate: '',
      updateInput: '',
      addInput: ''
    }
  },
  computed: {
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
    addItem (exerciseType) {
      exerciseType.isUse = 1
      this.$store.dispatch('modifyExerciseType', exerciseType)
    },

    removeItem (exerciseType) {
      exerciseType.isUse = 0
      this.$store.dispatch('modifyExerciseType', exerciseType)
    }
  }
}
</script>

<style lang="scss" scoped>
.item-on {
  margin-right: 10px;
  padding: 6px 12px;

  color: $color-blue;
  border: 1px solid rgba(45, 171, 226, 0.2);
  border-radius: 4px;
  background-color: rgba(45, 171, 226, 0.1);

  font-size: 14px;
}

.item-icon {
  margin-left: 6px;
  cursor: pointer;
  border-radius: 7px;

  &:hover {
    background: white;
  }
}

.item-off {
  margin-right: 10px;
  padding: 6px 12px;

  color: $color-blue;
  border: 1px solid #f56c6c44;
  border-radius: 4px;
  background-color: #f56c6c22;

  font-size: 14px;
}

.item-add {
  margin-right: 10px;
  padding: 6px 12px;

  color: $color-blue;
  border: 1px solid rgba(45, 171, 226, 0.2);
  border-radius: 4px;

  font-size: 14px;
  cursor: pointer;
}

.cutline {
  font-size: 14px;
  color: gray;
  border-top: $border-solid;
  margin-top: 12px;
  padding: 6px;
}
</style>

