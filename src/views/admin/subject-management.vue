<template>
  <!-- 学科管理页面 -->
  <div class="bqteam-main-wrap-inner">
    <!-- 添加学科 -->
    <el-button class="mb" v-if="userRoleId === 1" size="medium" icon="el-icon-plus" @click="addSubjectDialogVisible = true">添加学科</el-button>

    <!-- 学科列表 -->
    <el-table :data="subjectArray" style="width: 100%" border v-loading="loading">
      <el-table-column prop="subjectName" label="学科" width="100">
      </el-table-column>
      <el-table-column label="年级">
        <template slot-scope="scope">
          <el-popover placement="top-start" width="300" trigger="hover">
            <el-tag style="margin:4px" :key="name" v-for="name in scope.row.gradeNames">
              {{name}}
            </el-tag>
            <button class="table-button" slot="reference">{{scope.row.gradeNames.length}}个年级</button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="学科管理员姓名">
        <template slot-scope="scope">
          <el-popover placement="top-start" width="300" trigger="hover">
            <el-tag style="margin:4px" :key="name" v-for="name in scope.row.adminNames">
              {{name}}
            </el-tag>
            <button class="table-button" slot="reference">{{scope.row.adminNames.length}}位管理员</button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240">
        <template slot-scope="scope">
          <button class="table-button" @click="beginEditSubject(scope.$index)">编辑</button>
          <button class="table-button" v-if="userRoleId === 1" @click="deleteSubject(scope.$index)">删除</button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增学科弹框 -->
    <el-dialog title="新增学科" :visible.sync="addSubjectDialogVisible" width="50%">
      <el-form :model="addSubjectForm" :rules="addSubjectFormRules" ref="addSubjectForm" label-width="100px">
        <el-form-item label="学科ID" prop="subjectId">
          <el-input v-model="addSubjectForm.subjectId" placeholder="请输入学科ID" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item label="学科名称" prop="subjectName">
          <el-input v-model="addSubjectForm.subjectName" placeholder="请输入学科名称" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item label="包含年级" prop="subjectGradeArray">
          <el-select v-model="addSubjectForm.subjectGradeArray" multiple placeholder="请选择" style="width:60%;">
            <el-option v-for="grade in global.grades" :key="grade.id" :label="grade.name" :value="grade.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addSubjectDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubject()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑学科弹框 -->
    <el-dialog title="编辑学科" :visible.sync="editSubjectDialogVisible" width="60%">
      <el-form :model="editSubjectForm" :rules="addSubjectFormRules" ref="editSubjectForm" label-width="100px">
        <el-form-item label="学科名称" prop="subjectName">
          <el-input v-model="editSubjectForm.subjectName" style="width:200px;" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="包含年级" prop="subjectGradeArray">
          <el-select v-model="editSubjectForm.subjectGradeArray" multiple placeholder="请选择" style="width:60%;">
            <el-option v-for="grade in global.grades" :key="grade.id" :label="grade.name" :value="grade.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="包含管理员" prop="subjectAdminArray">
          <el-select v-model="editSubjectForm.subjectAdminArray" multiple placeholder="请选择" style="width:60%;">
            <el-option v-for="admin in subjectAdminArray" :key="admin.userId" :label="admin.name" :value="admin.userId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSubjectDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubjectConfirm()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    return {
      subjectArray: [],

      addSubjectDialogVisible: false,
      addSubjectForm: {
        subjectId: '',
        subjectName: '',
        subjectGrade: ''
      },
      addSubjectFormRules: {
        subjectId: [
          { required: true, message: '请输入学科ID', trigger: 'blur' },
          { type: 'string', min: 1, max: 10, message: '学科名称长度应为1-10个字符', trigger: 'blur' }
        ],
        subjectName: [
          { required: true, message: '请输入学科名称', trigger: 'blur' },
          { type: 'string', min: 2, max: 10, message: '学科名称长度应为2-10个字', trigger: 'blur' }
        ],
        subjectGradeArray: [
          { type: 'array', required: true, message: '请至少选择一个年级', trigger: 'change' }
        ]
      },

      editSubjectDialogVisible: false,
      editSubjectForm: {
        subjectId: 0,
        subjectName: '',
        subjectGrade: '',
        subjectGradeArray: [],
        subjectAdmin: '',
        subjectAdminArray: []
      },
      addSubjectFormRules: {
        subjectName: [
          { required: true, message: '请输入学科名称', trigger: 'blur' },
          { type: 'string', min: 2, max: 10, message: '学科名称长度应为2-10个字', trigger: 'blur' }
        ],
        subjectGradeArray: [
          { type: 'array', required: true, message: '请至少选择一个年级', trigger: 'change' }
        ],
        subjectAdminArray: [
          { type: 'array', required: true, message: '请至少选择一个管理员', trigger: 'change' }
        ]
      },

      subjectAdminArray: [],

      // 记录修改之前的管理员userId列表，与修改后的管理员userId列表对比，决定添加/删除管理员
      subjectAdminArrayBeforeEdit: [],

      loading: false
    };
  },
  computed: {
    userRoleId () {
      let userInfo = this.getLs('userInfo')
      return userInfo.roleId
    }
  },
  mounted () {
    this.getSubjects()
  },
  methods: {
    getSubjects () {
      this.loading = true
      this.getRequest(this.httpUrl.subject, {})
        .then(response => {
          this.loading = false
          this.subjectArray = response.data
          this.subjectArray.forEach(element => {
            element.gradeNames = this.setupGradeNames(element.subjectGrade)
            element.adminNames = this.setupAdminNames(element.subjectAdminList)
          })
        })
        .catch(error => {
          this.loading = false
        })
    },

    //构造年级字符串
    setupGradeNames (subjectGrade) {
      let gradeNames = []
      if (subjectGrade.indexOf('@') !== -1) {
        let gradeStrings = subjectGrade.split('@')
        gradeStrings.forEach(gradeString => {
          let grade = parseInt(gradeString)
          let gradeName = this.global.grades[grade - 1].name
          gradeNames.push(gradeName)
        })
      } else if (subjectGrade !== '') {
        gradeNames.push(subjectGrade)
      }
      return gradeNames
    },

    setupAdminNames (subjectAdminList) {
      let adminNames = []
      subjectAdminList.forEach(admin => {
        adminNames.push(admin.name)
      })
      return adminNames
    },

    addSubject () {
      this.$refs.addSubjectForm.validate((valid) => {
        if (valid) {
          this.$store.commit('loading', true)
          this.addSubjectDialogVisible = false

          this.gradeSort(this.addSubjectForm.subjectGradeArray)
          let l = this.addSubjectForm.subjectGradeArray.length
          this.addSubjectForm.subjectGrade = ''
          for (let i = 0; i < l; i++) {
            let gradeName = this.addSubjectForm.subjectGradeArray[i]
            if (i < l - 1) {
              this.addSubjectForm.subjectGrade += gradeName + '@'
            } else {
              this.addSubjectForm.subjectGrade += gradeName
            }
          }
          this.postRequest(this.httpUrl.subject, this.addSubjectForm)
            .then(response => {
              this.$store.commit('loading', false)
              this.pm('科目添加成功', 'success')
              this.getSubjects()
            })
            .catch(error => {
              this.$store.commit('loading', false)
            })
        }
      })
    },

    beginEditSubject (index) {
      this.editSubjectForm.subjectId = this.subjectArray[index].subjectId
      this.editSubjectForm.subjectName = this.subjectArray[index].subjectName

      this.editSubjectForm.subjectGradeArray = []
      if (this.subjectArray[index].subjectGrade != '' && this.subjectArray[index].subjectGrade.indexOf('@') != -1) {
        let subjectGradeArrayString = this.subjectArray[index].subjectGrade.split('@')
        subjectGradeArrayString.forEach(element => {
          this.editSubjectForm.subjectGradeArray.push(parseInt(element))
        })
      }

      this.editSubjectForm.subjectAdminArray = []
      this.subjectAdminArrayBeforeEdit = []
      this.subjectArray[index].subjectAdminList.forEach(element => {
        this.editSubjectForm.subjectAdminArray.push(element.userId)
        this.subjectAdminArrayBeforeEdit.push(element.userId)
      })

      this.$store.commit('loading', true)
      let subjectId = this.subjectArray[index].subjectId
      let params = { subjectId: subjectId, roleId: 3 }
      this.getRequest(this.httpUrl.subjectMember, params)
        .then(response => {
          this.$store.commit('loading', false)
          this.setupAdminArray(response.data.list)
          this.editSubjectDialogVisible = true
        })
        .catch(error => {
          this.$store.commit('loading', false)
        })
    },

    setupAdminArray (array) {
      let array1 = []
      let array0 = []
      array.forEach(element => {
        if (element.isMember === 1) {
          array1.push(element)
        } else {
          array0.push(element)
        }
      })

      this.subjectAdminArray = []
      array1.forEach(element => {
        this.subjectAdminArray.push(element)
      })
      array0.forEach(element => {
        this.subjectAdminArray.push(element)
      })
    },

    editSubjectConfirm () {
      this.$refs.editSubjectForm.validate((valid) => {
        if (valid) {
          this.editSubjectDialogVisible = false
          this.$store.commit('loading', true)

          this.editGrade()
          this.eidtAdmin()
        } else {
          return false;
        }
      })
    },

    editGrade () {
      this.gradeSort(this.editSubjectForm.subjectGradeArray)
      let l = this.editSubjectForm.subjectGradeArray.length
      this.editSubjectForm.subjectGrade = ''
      for (let i = 0; i < l; i++) {
        let gradeName = this.editSubjectForm.subjectGradeArray[i]
        if (i < l - 1) {
          this.editSubjectForm.subjectGrade += gradeName + '@'
        } else {
          this.editSubjectForm.subjectGrade += gradeName
        }
      }
      this.putRequest(this.httpUrl.subject, this.editSubjectForm)
        .then(response => {
          this.$store.commit('loading', false)
          this.pm('科目编辑成功', 'success')
          this.getSubjects()
        })
        .catch(error => {
          this.$store.commit('loading', false)
        })
    },

    gradeSort (gradeArray) {
      var compare = function (x, y) {
        if (x < y) {
          return -1;
        } else if (x > y) {
          return 1;
        } else {
          return 0;
        }
      }
      // this.editSubjectForm.subjectGradeArray.sort(compare)
      gradeArray.sort(compare)
    },

    eidtAdmin () {
      this.editSubjectForm.subjectAdminArray.forEach(userId => {
        if (this.subjectAdminArrayBeforeEdit.indexOf(userId) === -1) {
          //该userId在修改之后的管理员userId列表内，但不在修改之前的管理员userId列表内，说明是添加管理员
          this.addAdmin(userId)
        }
      })
      this.subjectAdminArrayBeforeEdit.forEach(userId => {
        if (this.editSubjectForm.subjectAdminArray.indexOf(userId) === -1) {
          //该userId在修改之前的管理员userId列表内，但不在修改之后的管理员userId列表内，说明是删除管理员
          this.deleteAdmin(userId)
        }
      })
    },

    addAdmin (userId) {
      this.$store.commit('loading', false)
      let params = { userId: userId, subjectId: this.editSubjectForm.subjectId }
      this.postRequest(this.httpUrl.subjectMember, params)
        .then(response => {
          this.$store.commit('loading', false)
          this.pm('科目编辑成功', 'success')
          this.getSubjects()
        })
        .catch(error => {
          this.$store.commit('loading', false)
        })
    },

    deleteAdmin (userId) {
      this.$store.commit('loading', false)
      let params = { userId: userId, subjectId: this.editSubjectForm.subjectId }
      this.deleteRequest(this.httpUrl.subjectMember, params)
        .then(response => {
          this.$store.commit('loading', false)
          this.pm('科目编辑成功', 'success')
          this.getSubjects()
        })
        .catch(error => {
          this.$store.commit('loading', false)
        })
    },

    deleteSubject (index) {
      this.$confirm('删除科目后不可恢复，是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$store.commit('loading', true)
        this.deleteRequest(this.httpUrl.subject, { subjectId: this.subjectArray[index].subjectId })
          .then(response => {
            this.$store.commit('loading', false)
            this.pm('科目编辑成功', 'success')
            this.getSubjects()
          })
          .catch(error => {
            this.$store.commit('loading', false)
          })
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.item-box {
  display: flex;
  flex-wrap: wrap;
}

.admin-item {
  margin: 6px;
  padding: 6px 12px;

  color: $color-blue;
  border: 1px solid rgba(45, 171, 226, 0.2);
  border-radius: 4px;
  background-color: rgba(45, 171, 226, 0.1);

  font-size: 14px;
}

.admin-item-add {
  margin: 6px;
  padding: 6px 12px;

  color: $color-blue;
  border: 1px solid rgba(45, 171, 226, 0.2);
  border-radius: 4px;

  font-size: 14px;
  cursor: pointer;
}

.small {
  border-top: solid 1px lightgray;
  width: 100%;
  margin: 6px;
}
</style>

