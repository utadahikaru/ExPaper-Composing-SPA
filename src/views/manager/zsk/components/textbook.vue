<template>
  <div class="div-flex">

    <!-- 年级 -->
    <div id="textbook-book" class="textbook-grade textbook-border">
      <div class="box-head">
        <div class="label">年级</div>
      </div>
      <div class="box-main">
        <el-tree ref="treeGrade" :data="grades" node-key="id" :highlight-current="true" @node-click="selectGrade" :default-expand-all="true" :expand-on-click-node="false">
          <span slot-scope="{ node, data }">{{ node.label }}</span>
        </el-tree>
      </div>
    </div>

    <!-- 教材 -->
    <div id="textbook-book" class="textbook-book textbook-border">
      <div class="box-head">
        <div class="label">教材</div>
        <el-button class="ml" type="text" @click="clickEdit">{{!edit ? '编辑' : '取消'}}</el-button>
      </div>
      <div class="box-main">
        <el-tree ref="treeBook" :data="textbooks" node-key="id" :highlight-current="true" @node-click="selectTextbook" :default-expand-all="true" :expand-on-click-node="false">
          <span slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button v-if="edit" type="text" icon="el-icon-edit" @click="editTextbook(node)"></el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </div>

    <!-- 章节树 -->
    <div id="textbook-chapter" class="textbook-chapter textbook-border">
      <div class="box-head">
        <div class="label">章节</div>
        <el-button class="ml" type="text" @click="clickEditChapter">{{!editChapter ? '编辑' : '取消'}}</el-button>
      </div>
      <div class="box-main">
        <el-tree ref="tree" :data="chapterTree" node-key="id" :highlight-current="true" @node-click="selectChapter" :default-expand-all="true" :expand-on-click-node="false" draggable @node-drop="handleDrop" :allow-drop="allowDrop" :allow-drag="allowDrag">
          <span slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button v-if="editChapter" type="text" icon="el-icon-edit" @click="editBook(node)"></el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </div>

    <!-- 章节详解 -->
    <div class="textbook-detail textbook-border">
      <div class="box-head">
        <div class="label">章节内容</div>
        <el-button class="ml" v-if="editContent" type="text" @click="updateBookContent">提交</el-button>
        <el-button class="ml" type="text" @click="clickEditContent">{{!editContent ? '编辑' : '取消'}}</el-button>
      </div>
      <div class="box-main">
        <div class="m" v-show="!editContent" v-html="selectedChapter.transformed"></div>
        <div id="container-b" v-show="editContent" type="text/plain" style="width:100%;height:calc(100% - 60px)"></div>
      </div>
    </div>

    <el-dialog title="编辑教材" :visible.sync="editBookDialogVisible">
      <span slot="footer" class="dialog-footer">
        <el-button @click="editBookMode(11)">添加教材</el-button>
        <el-button @click="editBookMode(12)">删除该教材</el-button>
        <el-button @click="editBookMode(13)">修改该教材</el-button>
        <el-button @click="editBookDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑章节" :visible.sync="editDialogVisible">
      <span slot="footer" class="dialog-footer">
        <el-button @click="editBookMode(0)">添加章节</el-button>
        <el-button @click="editBookMode(1)">添加子章节</el-button>
        <el-button @click="editBookMode(2)">删除该章节</el-button>
        <el-button @click="editBookMode(3)">修改该章节</el-button>
        <el-button @click="editDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="editTitles[editMode]" :visible.sync="editFormDialogVisible">
      <el-form v-if="editMode < 2">
        <el-form-item label="章节名称" label-width="90px">
          <el-input v-model="inputChapterName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>

      <el-form v-if="editMode === 11">
        <el-form-item label="教材名称" label-width="90px">
          <el-input v-model="inputBookName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>

      <span v-if="editMode === 2">
        确认删除章节：
        <span class="book-highlight">{{selectedChapter.label}}</span>
        <span>{{selectedChapter.children.length > 0 ? '及其子章节' : ''}}</span>
        ?
      </span>

      <span v-if="editMode === 12">
        确认删除教材：
        <span class="book-highlight">{{selectedBook.label}}</span>
        ?
      </span>

      <div v-if="editMode === 3">
        <span>将章节：
          <span class="book-highlight">{{selectedChapter.label}}</span>
        </span>
        <el-form>
          <el-form-item label="修改为" label-width="54px">
            <el-input v-model="inputChapterName" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div v-if="editMode === 13">
        <span>将教材：
          <span class="book-highlight">{{selectedBook.label}}</span>
        </span>
        <el-form>
          <el-form-item label="修改为" label-width="54px">
            <el-input v-model="inputBookName" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editBookCancle">取 消</el-button>
        <el-button type="primary" @click="editBookDone">确 定</el-button>
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
import { SET_TEXTBOOK_LIST } from '@/store/mutation-types'

export default {
  data () {
    return {
      grade: 0,

      // 当前点选的教材和章节
      selectedTextbookNumber: '',
      selectedBook: {},
      selectedChapter: {},

      // 修改教材、章节、章节内容的标志
      edit: false,
      editChapter: false,
      editContent: false,

      // 对话框可见性
      editDialogVisible: false,
      editBookDialogVisible: false,
      editFormDialogVisible: false,

      // input组件绑定的数据   
      inputBookName: '',
      inputChapterName: '',

      editMode: 0,
      editTitle: '',
      editTitles: ['添加章节', '添加子章节', '删除该章节', '修改该章节'],
      parentLength: 0,

      //题目编辑器
      instanceB: null
    }
  },
  computed: {
    grades () {
      let grades1 = this.$store.getters.getGrades()
      let grades2 = []
      grades1.forEach(element => {
        let obj = { id: element.id, label: element.name }
        grades2.push(obj)
      })
      return grades2
    },

    textbooks () {
      if (this.$store.state.textbook.textbookList === null) {
        this.$store.dispatch('getTextbook')
        return []
      }
      let emptyList = []
      let list = this.$store.getters.textbookList(this.grade)

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
          }
          emptyList.push(obj)
        })
        this.selectedTextbookNumber = emptyList[0].id
        return emptyList
      } else {
        // 如果当前年级科目下没有教材，那么给this.textbooks一个空的教材，以便在其基础上新建教材
        return [{
          grade: this.grade,
          id: '',
          label: '',
          level: 0,
          pnumber: 'b',
          subject: this.$store.getters.getSubject(),
          content: '该教材还没有编辑内容'
        }]
      }
    },

    chapterTree: {
      get: function () {
        if (this.$store.state.textbook.textbookList === null) {
          return []
        }
        if (this.grade === 0) {
          this.grade = this.grades[0].id
        }
        let tree = this.$store.getters.chapterTreeForTree(this.grade, this.selectedBook.id)
        if (tree.length > 0) {
          return tree
        } else {
          // 如果当前年级科目教材下没有知识点，那么给this.chapterTree一个空的知识点，以便在其基础上新建知识点
          return [{
            grade: this.grade,
            id: '',
            label: '',
            level: 1,
            pnumber: this.selectedBook.id,
            subject: this.$store.getters.getSubject(),
            content: '该章节还没有编辑内容',
            transformed: '<p>该章节还没有编辑内容</p>'
          }]
        }
      },
      // 如果要对计算属性赋值，需要实现setter方法
      set: function (newValue) {
        return newValue
      }
    }
  },
  watch: {
    chapterTree: {
      handler: function (newVal, oldVal) {
        this.selectedChapter = this.chapterTree[0]
        this.edit = false
        this.editChapter = false
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
        this.instanceB = UE.getEditor("container-b")
        this.instanceB.addListener("ready", () => {
          this.$emit("ready", this.instanceB)
          this.instanceB.setContent(this.selectedChapter.content)
        })
      })
    },

    // 高亮当前选中的教材章节
    highLigthCurrentBook () {
      if (this.grade === 0) {
        this.grade = this.grades[0].id
      }
      if (this.selectedBook.id === undefined) {
        // 如果当前没有选中教材，那就默认选中第一个教材
        this.selectedBook = this.textbooks[0]
      }
      if (this.selectedChapter.id === undefined) {
        // 如果当前没有选中章节，那就默认选中第一个教材的第一个章节
        this.selectedChapter = this.chapterTree[0]
      }

      this.$nextTick(() => {
        this.$refs.treeGrade.setCurrentKey(this.grade)
        this.$refs.treeBook.setCurrentKey(this.selectedBook.id)
        this.$refs.tree.setCurrentKey(this.selectedChapter.id)
      })
    },

    // 用户点击了年级
    selectGrade (grade) {
      this.grade = grade.id
      this.selectedBook = this.textbooks[0]
      this.$nextTick(() => {
        this.selectedChapter = this.chapterTree[0]
        this.$refs.treeBook.setCurrentKey(this.selectedBook.id)
        this.$refs.tree.setCurrentKey(this.selectedChapter.id)
      })

      this.edit = false
      this.editChapter = false
      this.editContent = false
    },

    // 用户点击教材，将selectedTextbookNumber置为当前选中教材的id，同时匹配教材对应的章节
    selectTextbook (textbook) {
      this.selectedBook = textbook
      this.edit = false
      this.editChapter = false
      this.editContent = false
    },

    // 用户点击了章节
    selectChapter (book) {
      this.selectedChapter = book
      this.edit = false
      this.editChapter = false
      this.editContent = false
    },

    //用户点击编辑按钮，编辑教材
    clickEdit () {
      this.edit = !this.edit
      this.editChapter = false
      this.editContent = false
    },

    //用户点击编辑按钮，编辑章节
    clickEditChapter () {
      this.editChapter = !this.editChapter
      this.edit = false
      this.editContent = false
    },

    //用户点击编辑按钮，编辑章节内容
    clickEditContent () {
      this.editContent = !this.editContent
      this.edit = false
      this.editChapter = false

      if (this.editContent) {
        this.instanceB.setContent(this.selectedChapter.content)
      }
    },

    // 用户选中了某教材的编辑按钮
    editTextbook (book) {
      this.editBookDialogVisible = true

      this.selectedBook = book
    },

    // 用户选中了某章节的编辑按钮，弹出对话框选择编辑类型
    editBook (book) {
      this.editDialogVisible = true

      this.selectedChapter = book.data
    },

    // 用户选择了编辑类型
    editBookMode (mode) {
      this.editBookDialogVisible = false
      this.editDialogVisible = false
      this.editFormDialogVisible = true

      this.editMode = mode
    },

    // 用户取消了编辑
    editBookCancle () {
      this.editFormDialogVisible = false
    },

    // 用户编辑完成，点击了确定按钮，此时根据editMode调用不同的编辑方法
    editBookDone () {
      this.editFormDialogVisible = false
      switch (this.editMode) {
        case 0:
          this.addChapter()
          break;
        case 1:
          this.addSubBook()
          break;
        case 2:
          this.removeChapter()
          break;
        case 3:
          this.updateChapter()
          break;
        case 11:
          this.addBook()
          break;
        case 12:
          this.removeBook()
          break;
        case 13:
          this.updateBook()
          break;
        default:
          break;
      }
    },

    // 添加教材
    addBook () {
      // 新教材
      let b = {}
      b.bookName = this.inputBookName
      b.bookGrade = this.selectedBook.grade
      b.bookLevel = 0
      b.bookPNumber = this.selectedBook.pnumber
      b.bookContent = '该章节还没有编辑内容'
      b.bookLatex = '$$'
      b.bookSubject = this.selectedBook.subject

      b.bookNumber = this.setupNumber(this.selectedBook.grade + '-' + this.selectedBook.subject, '')
      b.bookOrder = this.$store.getters.bookBrotherCount(b.bookPNumber) + 1

      this.$store.dispatch('createTextbook', b)
    },

    // 添加同级章节
    addChapter () {
      // 新章节
      let b = {}
      b.bookName = this.inputChapterName
      b.bookGrade = this.selectedChapter.grade
      b.bookLevel = this.selectedChapter.level
      b.bookPNumber = this.selectedChapter.pnumber
      b.bookContent = '该章节还没有编辑内容'
      b.bookLatex = '$$'
      b.bookSubject = this.selectedChapter.subject

      b.bookNumber = this.setupNumber(b.bookPNumber, '')
      b.bookOrder = this.$store.getters.bookBrotherCount(b.bookPNumber) + 1

      this.$store.dispatch('createTextbook', b)
    },

    // 添加选中的章节的子章节
    addSubBook () {
      let b = {}
      b.bookName = this.inputChapterName
      b.bookGrade = this.selectedChapter.grade
      b.bookLevel = this.selectedChapter.level + 1
      b.bookPNumber = this.selectedChapter.id
      b.bookContent = '该章节还没有编辑内容'
      b.bookLatex = '$$'
      b.bookSubject = this.selectedChapter.subject

      b.bookNumber = this.setupNumber(b.bookPNumber, '')
      b.bookOrder = this.$store.getters.bookBrotherCount(b.bookPNumber) + 1

      this.$store.dispatch('createTextbook', b)
    },

    setupNumber (bookPNumber, bookNumber) {
      bookNumber = bookPNumber + '-' + parseInt(Math.random() * 900 + 100)
      if (this.$store.getters.bookNumberExist(bookNumber)) {
        return this.setupNumber(bookNumber)
      } else {
        return bookNumber
      }
    },

    // 删除选中的教材
    removeBook () {
      let data = { bookNumber: this.selectedBook.id }
      this.$store.dispatch('deleteTextbook', data)

      this.chapterTree.forEach(element => {
        this.removeBookSub(element)
      })
    },

    // 删除选中的章节
    removeChapter () {
      this.removeBookSub(this.selectedChapter)
    },

    // 递归地删除该章节以及该章节下面的子章节
    removeBookSub (book) {
      // 如果有子章节，先删除子章节
      if (book.children !== undefined) {
        book.children.forEach(element => {
          this.removeBookSub(element)
        })
      }

      // 再删除该章节
      let data = { bookNumber: book.id }
      this.$store.dispatch('deleteTextbook', data)
    },

    // 更新选中的教材
    updateBook () {
      let b = {}
      b.bookName = this.inputBookName
      b.bookNumber = this.selectedBook.id
      this.$store.dispatch('updateTextbook', b)
    },

    // 更新选中的章节
    updateChapter () {
      let b = {}
      b.bookName = this.inputChapterName
      b.bookNumber = this.selectedChapter.id
      this.$store.dispatch('updateTextbook', b)
    },

    // 更新选中的章节内容
    updateBookContent () {
      this.editContent = false

      let b = {}
      b.bookNumber = this.selectedChapter.id
      k.bookContent = this.instanceB.getContent()
      k.bookLatex = this.getLatexString()
      this.$store.dispatch('updateTextbook', b)
    },

    getLatexString () {
      let latexString = ''
      let childNodes = this.instanceB.body.childNodes[0].childNodes
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
      let params = { bookNumber: draggingNode.data.id, bookOrderStart: orderStart, bookOrderEnd: orderEnd }
      this.$store.dispatch('updateBookOrder', params)
    },

    allowDrop (draggingNode, dropNode, type) {
      return draggingNode.data.pnumber === dropNode.data.pnumber && type !== 'inner'
    },

    allowDrag (draggingNode) {
      return true;
    }
  },
  beforeDestroy () {
    if (this.instanceB !== null) {
      this.instanceB.destroy()
    }
  }
}
</script>

<style lang="scss" scoped>
.textbook-item {
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 40px;
  padding: 4px;

  cursor: pointer;

  &:hover {
    background: #f8f8f8;
  }

  &-selected {
    background: #f4f4f4;

    font-size: 16px;
  }
}

.textbook-grade {
  position: absolute;
  top: 0;
  bottom: 0;

  width: 90px;
}

.textbook-book {
  position: absolute;
  left: 100px;
  top: 0;
  bottom: 0;

  width: 190px;
}

.textbook-chapter {
  position: absolute;
  left: 300px;
  top: 0;
  bottom: 0;

  width: 290px;
}

.textbook-detail {
  position: absolute;
  left: 600px;
  top: 0;
  bottom: 0;
  right: 0;
}

.textbook-border {
  border: $border-solid;
  border-radius: 4px;
}

.box {
  position: relative;
  height: 100%;
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

.textbook-highlight {
  font-weight: bold;
}

.tree-node-label {
  width: 200px;
}
</style>

