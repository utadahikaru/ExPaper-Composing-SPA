<template>
  <div>
    <div class="div-flex">
      <span class="item" :key="index" v-for="(paperType, index) in paperTypes">
        {{paperType.name}}
        <i v-if="edit" type="text" size="small" class="el-icon-edit item-icon" @click="updateItem(paperType.id)"></i>
        <i v-if="edit" type="text" size="small" class="el-icon-close item-icon" @click="removeItem(paperType.id)"></i>
      </span>
      <span v-if="!edit" class="item-add" @click="edit = true">
        <i class="el-icon-edit"></i>
      </span>
      <span v-if="edit" class="item-add" @click="dialogAddVisible = true">添加</span>
      <span v-if="edit" class="item-add" @click="edit = false">完成</span>
    </div>

    <el-dialog title="修改试卷类型" :visible.sync="dialogUpdateVisible">
      <el-input v-model="updateInput" auto-complete="off"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdateVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateDone" :disabled="updateInput === ''">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加试卷类型" :visible.sync="dialogAddVisible">
      <el-input v-model="addInput" auto-complete="off"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDone" :disabled="addInput === ''">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'paper-type',
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
    paperTypes () {
      let paperTypes = this.$store.state.paperType.paperTypes
      if (paperTypes === null) {
        this.$store.dispatch('getPaperTypes')
        return []
      }
      return paperTypes
    }
  },
  methods: {
    updateItem (id) {
      this.dialogUpdateVisible = true
      this.typeToUpdate = id
    },

    updateDone () {
      this.dialogUpdateVisible = false

      this.$store.commit('loading', true)
      let params = { paperType: this.typeToUpdate, paperTypeName: this.updateInput }
      this.putRequest(this.httpUrl.paperType, params)
        .then(response => {
          this.$store.commit('loading', false)
          this.$store.dispatch('getPaperTypes')
          this.updateInput = ''
        })
        .catch(error => {
          this.$store.commit('loading', false)
        })
    },

    removeItem (id) {
      this.$confirm('删除该试卷类型？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.deleteRequest(this.httpUrl.paperType, { paperType: id }).then(response => {
          this.$store.dispatch('getPaperTypes')
        })
      })
    },

    addDone () {
      this.dialogAddVisible = false

      this.$store.commit('loading', true)
      this.postRequest(this.httpUrl.paperType, { paperTypeName: this.addInput })
        .then(response => {
          this.$store.commit('loading', false)
          this.$store.dispatch('getPaperTypes')
          this.addInput = ''
        })
        .catch(error => {
          this.$store.commit('loading', false)
        })
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
    margin-left: 6px;
    cursor: pointer;
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

