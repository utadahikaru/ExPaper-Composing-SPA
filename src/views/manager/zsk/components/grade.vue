<template>
  <div>
    <el-button type="text" @click="edit = !edit">{{!edit ? '编辑' : '完成'}}</el-button>
    <br>
    <span class="item" :key="index" v-for="(name, index) in gradeNames">
      {{name}}
      <i v-if="edit" type="text" size="small" class="el-icon-close item-icon" @click="removeItem(index)"></i>
    </span>
    <span v-if="edit" class="item-add" @click="dialogAddVisible = true">+ 添加</span>

    <el-dialog title="添加年级" :visible.sync="dialogAddVisible">
      <el-select placeholder="请选择年级" @change="selectChanged">
        <el-option v-for="item in global.grades" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'exercise-type',
  data () {
    return {
      edit: false,
      dialogAddVisible: false
    }
  },
  computed: {
    gradeNames () {
      let curSubjectString = localStorage.getItem('userSubject')
      let curSubject = JSON.parse(curSubjectString)

      let grades = curSubject.grades.split('@')
      let names = []
      grades.forEach(element => {
        let name = this.getValue(this.global.grades, parseInt(element))
        names.push(name)
      })
      return names
    }
  },
  methods: {
    removeItem (index) {
      this.$store.commit('removeGrade', index)
    },

    addItem () {
      this.dialogAddVisible = true
    },

    selectChanged (gradeId) {
      this.dialogAddVisible = false

      if (this.grades.indexOf(gradeId) !== -1) {
        return
      }
      let grades = this.$store.state.grade.grades
      let gradesEmpty = JSON.parse(JSON.stringify(grades))
      let gradesNew = gradesEmpty.push(gradeId)
      //保存下用户所在所有年级
      sessionStorage.setItem('userGrades', JSON.stringify(gradesNew))

      this.$store.commit('setupData')
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  margin-right: 10px;
  padding: 6px 12px;

  color: $color-blue;
  border: 1px solid rgba(45, 171, 226, 0.2);
  border-radius: 4px;
  background-color: rgba(45, 171, 226, 0.1);

  font-size: 14px;

  &-icon {
    cursor: pointer;
    margin-left: 6px;
  }
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
</style>

