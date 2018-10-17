<template>
  <div>
    <!-- 知识点框 -->
    <div>
      <!-- 年级树 -->
      <div class="knowledge-grade border">
        <div class="box-head">
          <div class="label">年级</div>
        </div>
        <div class="box-main">
          <el-tree ref="treeGrade" :data="grades" node-key="id" :highlight-current="true" @node-click="selectGrade" :default-expand-all="true" :expand-on-click-node="false">
            <span slot-scope="{ node, data }">{{ node.label }}</span>
          </el-tree>
        </div>
      </div>

      <!-- 知识点树 -->
      <div class="knowledge-knowledge border">
        <div class="box-head">
          <div class="label">知识点</div>
          <el-button class="ml" type="text" @click="edit = !edit">{{!edit ? '编辑' : '完成'}}</el-button>
        </div>

        <div class="box-main">
          <el-tree ref="treeKnowledge" :data="knowledgeTree" node-key="id" :highlight-current="true" @node-click="selectKnowledge" :default-expand-all="true" :expand-on-click-node="false" draggable @node-drop="handleDrop" :allow-drop="allowDrop" :allow-drag="allowDrag">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span>
                <el-button v-if="edit" type="text" icon="el-icon-edit" @click="editKnowledge(node)"></el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </div>

      <!-- 知识点详解 -->
      <div class="knowledge-detail border">
        <div class="box-head">
          <div class="label">知识点内容</div>
          <el-button class="ml" v-show="editContent" type="text" @click="updateKnowledgeContent">提交</el-button>
          <el-button class="ml" type="text" @click="clickEditContent">{{!editContent ? '编辑' : '取消'}}</el-button>
        </div>
        <div class="box-main">
          <div class="m" v-show="!editContent" v-html="selectedKnowledge.transformed"></div>
          <div id="container-k" v-show="editContent" type="text/plain" style="width:100%;height:calc(100% - 60px)"></div>
        </div>
      </div>
    </div>

    <el-dialog title="编辑知识点" :visible.sync="editDialogVisible">
      <span slot="footer" class="dialog-footer">
        <el-button @click="editKnowledgeMode(0)">添加知识点</el-button>
        <el-button @click="editKnowledgeMode(1)">添加子知识点</el-button>
        <el-button @click="editKnowledgeMode(2)">删除该知识点</el-button>
        <el-button @click="editKnowledgeMode(3)">修改该知识点</el-button>
      </span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="editTitles[editMode]" :visible.sync="editFormDialogVisible">
      <el-form v-if="editMode < 2">
        <el-form-item label="知识点名称" label-width="90px">
          <el-input v-model="inputKnowledgeName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>

      <span v-if="editMode === 2">
        确认删除知识点：
        <span class="knowledge-highlight">{{selectedKnowledge.label}}</span>
        <span>{{selectedKnowledge.children.length > 0 ? '及其子知识点' : ''}}</span>
        ?
      </span>

      <span v-if="editMode === 3">将知识点：
        <span class="knowledge-highlight">{{selectedKnowledge.label}}</span>
      </span>
      <br><br>
      <el-form v-if="editMode === 3">
        <el-form-item label="修改为" label-width="54px">
          <el-input v-model="inputKnowledgeName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editKnowledgeCancle">取 消</el-button>
        <el-button type="primary" @click="editKnowledgeDone">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import "@/../static/plugins/ueditor-math-frontend/ueditor.config.js"
import "@/../static/plugins/ueditor-math-frontend/ueditor.all.min.js"
import "@/../static/plugins/ueditor-math-frontend/lang/zh-cn/zh-cn.js"
import "@/../static/plugins/ueditor-math-frontend/third-party/kityformula-plugin/addKityFormulaDialog.js"
import "@/../static/plugins/ueditor-math-frontend/third-party/kityformula-plugin/defaultFilterFix.js"

export default {
  data () {
    return {
      // 当前年级
      grade: 0,
      // 当前选中的知识点
      selectedKnowledge: {},

      // 修改知识点、知识点内容的标志
      edit: false,
      editContent: false,

      // 弹框可见性
      editDialogVisible: false,
      editFormDialogVisible: false,

      // input组件绑定的数据
      inputKnowledgeName: '',
      inputKnowledgeContent: '',

      editMode: 0,
      editTitle: '',
      editTitles: ['添加知识点', '添加子知识点', '删除该知识点', '修改该知识点'],
      parentLength: 0,

      //题目编辑器
      instanceK: null
    }
  },
  computed: {
    // 年级树
    grades () {
      let grades1 = this.$store.getters.getGrades()
      let grades2 = []
      grades1.forEach(element => {
        let obj = { id: element.id, label: element.name }
        grades2.push(obj)
      })
      return grades2
    },

    //知识点树
    knowledgeTree () {
      if (this.$store.state.knowledge.knowledgeList === null) {
        this.$store.dispatch('getKnowledge')
        return []
      }
      if (this.grade === 0) {
        this.grade = this.grades[0].id
      }
      let tree = this.$store.getters.knowledgeTree(this.grade)
      if (tree.length > 0) {
        return tree
      } else {
        // 如果当前年级科目下没有知识点，那么给this.knowledgeTree一个空的知识点，以便在其基础上新建知识点
        return [{
          children: [],
          grade: this.grade,
          id: '',
          label: '',
          level: 0,
          pnumber: 'k',
          subject: this.$store.getters.getSubject(),
          content: '该知识点还没有编辑内容',
          transformed: '<p>该知识点还没有编辑内容</p>'
        }]
      }
    }
  },
  watch: {
    knowledgeTree: {
      handler: function (newVal, oldVal) {
        this.edit = false
        this.editContent = false
      },
      deep: true
    }
  },
  mounted () {
    this.initEditor()
  },
  methods: {
    /**
     * 题目编辑器
     */
    initEditor () {
      this.$nextTick(() => {
        this.instanceK = UE.getEditor("container-k")
        this.instanceK.addListener("ready", () => {
          this.$emit("ready", this.instanceK)
        })
      })
    },

    // 高亮当前选中的知识点
    highLigthCurrentKnowledge () {
      if (this.grade === 0) {
        this.grade = this.grades[0].id
      }

      if (this.selectedKnowledge.id === undefined) {
        // 如果当前没有选中知识点，那就默认第一个知识点
        this.selectedKnowledge = this.knowledgeTree[0]
      }

      this.$nextTick(() => {
        this.$refs.treeGrade.setCurrentKey(this.grade)
        this.$refs.treeKnowledge.setCurrentKey(this.selectedKnowledge.id)
      })
    },

    // 用户点击了年级
    selectGrade (grade) {
      this.grade = grade.id
      this.edit = false
      this.editContent = false
    },

    // 用户点击了知识点
    selectKnowledge (knowledge) {
      this.selectedKnowledge = knowledge
      this.edit = false
      this.editContent = false
    },

    //用户点击编辑按钮，编辑知识点
    editKnowledge (knowledge) {
      this.editDialogVisible = true
      this.selectedKnowledge = knowledge.data
    },

    // 用户选中了某知识点的编辑按钮，弹出对话框选择编辑类型
    editKnowledgeMode (mode) {
      this.editDialogVisible = false
      this.editFormDialogVisible = true

      this.editMode = mode
    },

    // 用户取消了编辑
    editKnowledgeCancle () {
      this.editFormDialogVisible = false
      this.inputKnowledgeName = ''
      this.inputKnowledgeContent = ''
    },

    clickEditContent () {
      this.editContent = !this.editContent
      if (this.editContent) {
        this.instanceK.setContent(this.selectedKnowledge.content)
      }
    },

    // 用户编辑完成，点击了确定按钮，此时根据editMode调用不同的编辑方法
    editKnowledgeDone () {
      this.editFormDialogVisible = false
      switch (this.editMode) {
        case 0:
          this.addKnowledge()
          break;
        case 1:
          this.addSubKnowledge()
          break;
        case 2:
          this.removeKnowledge()
          break;
        case 3:
          this.updateKnowledge()
          break;
        default:
          break;
      }
    },

    // 添加同级知识点
    addKnowledge () {
      // 新知识点
      let k = {}
      k.knowledgeName = this.inputKnowledgeName
      k.knowledgeGrade = this.selectedKnowledge.grade
      k.knowledgeSubject = this.selectedKnowledge.subject
      k.knowledgePNumber = this.selectedKnowledge.pnumber
      k.knowledgeLevel = this.selectedKnowledge.level
      k.knowledgeContent = '该章节下还没有内容'
      k.knowledgeLatex = '$$'

      let timestamp = Date.parse(new Date()) / 1000
      if (k.knowledgeLevel === 0) {
        // 根知识点的knowledgeNumber，年级+科目+时间戳
        k.knowledgeNumber = this.setupNumber(k.knowledgeGrade + '-' + k.knowledgeSubject, '')
      } else {
        // 非根知识点的knowledgeNumber，由父知识点+时间戳
        k.knowledgeNumber = this.setupNumber(k.knowledgePNumber, '')
      }
      k.knowledgeOrder = this.$store.getters.knowledgeBrotherCount(k.knowledgePNumber) + 1

      this.$store.dispatch('createKnowledge', k)
    },

    // 添加选中的知识点的子知识点
    addSubKnowledge () {
      // 新知识点
      let k = {}
      k.knowledgeName = this.inputKnowledgeName
      k.knowledgeGrade = this.selectedKnowledge.grade
      k.knowledgeSubject = this.selectedKnowledge.subject
      k.knowledgePNumber = this.selectedKnowledge.id
      k.knowledgeContent = '该知识点下还没有内容'
      k.knowledgeLatex = '$$'
      k.knowledgeLevel = this.selectedKnowledge.level + 1

      k.knowledgeNumber = this.setupNumber(k.knowledgePNumber, '')
      k.knowledgeOrder = this.$store.getters.knowledgeBrotherCount(k.knowledgePNumber) + 1

      this.$store.dispatch('createKnowledge', k)
    },

    setupNumber (knowledgePNumber, knowledgeNumber) {
      knowledgeNumber = knowledgePNumber + '-' + parseInt(Math.random() * 900 + 100)
      if (this.$store.getters.knowledgeNumberExist(knowledgeNumber)) {
        return this.setupNumber(knowledgeNumber)
      } else {
        return knowledgeNumber
      }
    },

    // 删除选中的知识点
    removeKnowledge () {
      this.removeKnowledgeSub(this.selectedKnowledge)
    },

    // 递归地删除该知识点以及该知识点下面的子知识点
    removeKnowledgeSub (knowledge) {
      // 如果有子知识点，先删除子知识点
      if (knowledge.children !== undefined) {
        knowledge.children.forEach(element => {
          this.removeKnowledgeSub(element)
        })
      }

      // 再删除该知识点
      let data = { knowledgeNumber: knowledge.id }
      this.$store.dispatch('deleteKnowledge', data)
    },

    // 更新选中的知识点
    updateKnowledge () {
      let k = {}
      k.knowledgeNumber = this.selectedKnowledge.id
      k.knowledgeName = this.inputKnowledgeName
      this.$store.dispatch('updateKnowledge', k)
    },

    // 更新选中的知识点
    updateKnowledgeContent () {
      let k = {}
      k.knowledgeNumber = this.selectedKnowledge.id
      k.knowledgeContent = this.instanceK.getContent()
      k.knowledgeLatex = this.getLatexString()
      this.$store.dispatch('updateKnowledge', k)
    },

    getLatexString () {
      let latexString = ''
      let childNodes = this.instanceK.body.childNodes[0].childNodes
      childNodes.forEach(node => {
        if (node.nodeType === 1) {
          if (node.className === 'aurthur-math-ky') {
            let s = '$' + node.dataset.latex + '$'
            latexString += s
          }
        } else if (node.nodeType === 3) {
          latexString += node.nodeValue
        }
      })
      return latexString
    },

    handleDrop (draggingNode, dropNode, dropType, ev) {
      let orderStart = draggingNode.data.order
      let orderEnd = 0
      if (dropType === 'before') {
        orderEnd = dropNode.data.order - 1
      } else {
        orderEnd = dropNode.data.order
      }
      console.log(draggingNode.data.order, dropNode.data.order, dropType);
      let params = { knowledgeNumber: draggingNode.data.id, knowledgeOrderStart: orderStart, knowledgeOrderEnd: orderEnd }
      this.$store.dispatch('updateKnowledgeOrder', params)
    },

    allowDrop (draggingNode, dropNode, type) {
      return draggingNode.data.pnumber === dropNode.data.pnumber && type !== 'inner'
    },

    allowDrag (draggingNode) {
      return true;
    }
  },
  beforeDestroy () {
    if (this.instanceK !== null) {
      this.instanceK.destroy()
    }
  }
}
</script>

<style lang="scss" scoped>
.knowledge-grade {
  position: absolute;
  top: 0;
  bottom: 0;

  width: 90px;
}

.knowledge-knowledge {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 100px;
  overflow: auto;

  width: 290px;
}

.knowledge-detail {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 400px;
}

.border {
  border: $border-solid;
  border-radius: 4px;
}

.box-head {
  position: absolute;
  width: 100%;
  height: 40px;
  padding: 0 10px;
  display: flex;
  align-items: center;

  background-color: $color-gray;
}

.box-main {
  width: 100%;
  top: 40px;
  bottom: 0;
  position: absolute;
  overflow-y: auto;
}

.label {
  flex: 1;
}

.knowledge-highlight {
  font-weight: bold;
}
</style>

