<template>
  <!-- 教师管理页面 -->
  <div class="bqteam-main-wrap-inner">

    <div class="filter">
      <div class="filter-item">
        <div class="filter-label">用户账号</div>
        <el-input class="filter-input" size="medium" v-model="searchFilter.username" placeholder="请输入账号" clearable></el-input>
      </div>
      <div class="filter-item">
        <div class="filter-label">用户姓名</div>
        <el-input class="filter-input" size="medium" v-model="searchFilter.name" placeholder="请输入姓名" clearable></el-input>
      </div>
      <div class="filter-item">
        <div class="filter-label">用户类型</div>
        <el-select v-model="searchFilter.roleId" placeholder="请选择类型" clearable>
          <el-option v-for="item in global.userRoles" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="filter-item">
        <div class="filter-label">用户状态</div>
        <el-select v-model="searchFilter.status" placeholder="请选择状态" clearable>
          <el-option v-for="item in global.userStatus" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>
    </div>

    <el-button-group class="mb">
      <el-button size="medium" @click="getUsers">搜索</el-button>
      <el-button size="medium" @click="resetFilter">重置</el-button>
      <el-button size="medium" @click="addUserDialogVisible = true">添加</el-button>
    </el-button-group>

    <!-- 用户列表 -->
    <el-table :data="userArray" border v-loading="loading">
      <el-table-column prop="username" label="用户账号" min-width="100" align="center">
      </el-table-column>
      <el-table-column prop="name" label="用户姓名" min-width="120" align="center">
      </el-table-column>
      <el-table-column prop="roleName" label="用户类型" min-width="120" align="center">
      </el-table-column>
      <el-table-column prop="tel" label="用户手机" min-width="120" align="center">
      </el-table-column>
      <el-table-column prop="email" label="用户邮箱" min-width="180" align="center">
      </el-table-column>
      <el-table-column prop="statusString" label="用户状态" min-width="90" align="center">
        <template slot-scope="scope" fixed="right" label="操作">
          <el-tag v-if="scope.row.status === 0">正常</el-tag>
          <el-tag v-if="scope.row.status === 1" type="danger">锁定</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100">
        <template slot-scope="scope" fixed="right" label="操作">
          <button class="table-button" @click="editUser(scope.$index)" type="text">编辑</button>
          <button class="table-button" @click="disableUser(scope.$index)" type="text">{{scope.row.operateString}}</button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="mt">
      <el-pagination @current-change="pageChanged" :current-page="searchFilter.pageNum" layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <div>
      <!-- 新增用户弹框 -->
      <el-dialog title="添加用户" :visible.sync="addUserDialogVisible">
        <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserForm" label-width="80px">
          <el-form-item label="账号" prop="username">
            <el-input v-model="addUserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="addUserForm.name"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="tel">
            <el-input v-model="addUserForm.tel"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUserForm.email"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addUserDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 修改用户弹框 -->
      <el-dialog title="修改用户类型" :visible.sync="editUserDialogVisible">

        <el-form :model="editUserForm" :rules="editUserFormRules" ref="editUserFormRules" label-width="80px">
          <el-form-item label="账号" prop="username">
            <el-input v-model="editUserForm.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="editUserForm.name"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="tel">
            <el-input v-model="editUserForm.tel"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="用户类型" prop="roleId">
            <el-radio-group v-model="editUserForm.roleId">
              <el-radio v-for="role in roleArray" :key="role.roleId" :label="role.roleId">{{role.roleName}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="editUserDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserConfirm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    var checkEmail = (rule, value, callback) => {
      let mal = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
      if (!value) {
        return callback()
      }
      if (!(mal.test(value))) {
        callback(new Error('请输入正确邮箱'))
      } else {
        callback()
      }
    }
    return {
      userArray: [],
      roleArray: [],

      searchFilter: {
        username: '',
        name: '',
        roleId: '',
        status: '',
        pageSize: 10,
        pageNum: 1
      },
      total: 0,

      addUserDialogVisible: false,
      addUserForm: {
        username: '',
        name: '',
        tel: '',
        email: '',
        type: 1
      },
      addUserFormRules: {
        username: [
          { required: true, message: '请指定用户名', trigger: 'blur' },
          { min: 4, max: 18, message: '长度在 4 到 18 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字', trigger: 'blur' }
        ],
        tel: [
          { required: false, message: '', trigger: 'blur' },
          { type: 'string', len: 11, message: '请输入11位手机号', trigger: 'blur' }
        ],
        email: [
          { validator: checkEmail, trigger: 'blur' }
        ]
      },

      editUserDialogVisible: false,
      editUserForm: {
        username: '',
        name: '',
        tel: '',
        email: '',
        roleId: 0
      },
      editUserFormRules: {
        name: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字', trigger: 'blur' }
        ],
        tel: [
          { required: false, message: '', trigger: 'blur' },
          { type: 'string', len: 11, message: '请输入11位手机号', trigger: 'blur' }
        ],
        email: [
          { required: false, validator: checkEmail, trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请选择用户类型', trigger: 'change' }
        ]
      },

      loading: false,
    };
  },
  mounted () {
    this.getUsers()
    this.getRoles()
  },
  methods: {
    getUsers () {
      this.loading = true
      let params = this.deleteUselessAttribute(this.searchFilter)
      this.getRequest(this.httpUrl.sysUser, params)
        .then(response => {
          let statusStrings = ['正常', '锁定', '休眠', '已删除']
          let operateStrings = ['锁定', '解锁', '休眠', '已删除']
          this.loading = false
          this.userArray = []
          response.data.list.forEach(element => {
            element.statusString = statusStrings[element.status]
            element.operateString = operateStrings[element.status]
            this.userArray.push(element)
          })
          this.total = this.userArray.length
        })
        .catch(error => {
          this.loading = false
        })
    },

    getRoles () {
      this.getRequest(this.httpUrl.sysRole, {})
        .then(response => {
          this.roleArray = response.data.list
        })
        .catch(error => {
        })
    },

    addUser () {
      this.$refs.addUserForm.validate((valid) => {
        if (valid) {
          this.$store.commit('loading', true)
          this.postRequest(this.httpUrl.sysUser, this.addUserForm)
            .then(response => {
              this.$store.commit('loading', false)
              this.pm('用户添加成功', 'success')
              this.addUserDialogVisible = false
              this.getUsers()
            })
            .catch(error => {
              this.$store.commit('loading', false)
            })
        } else {
          return false;
        }
      })
    },

    editUser (index) {
      let user = this.userArray[index]
      this.editUserForm.username = user.username
      this.editUserForm.name = user.name
      this.editUserForm.tel = user.tel
      this.editUserForm.email = user.email
      this.editUserForm.roleId = user.roleId

      this.editUserDialogVisible = true
    },

    editUserConfirm () {
      this.$refs.editUserFormRules.validate((valid) => {
        if (valid) {
          this.editUserDialogVisible = false
          this.editUserInfo()
        } else {
        }
      })
    },

    editUserInfo () {
      this.$store.commit('loading', true)
      this.putRequest(this.httpUrl.sysUser, this.editUserForm)
        .then(response => {
          this.$store.commit('loading', false)
          this.pm('用户信息修改成功', 'success')
          this.getUsers()
        })
        .catch(error => {
          this.$store.commit('loading', false)
        })
    },

    disableUser (index) {
      this.$store.commit('loading', true)
      let user = this.userArray[index]
      user.lock = user.status === 0 ? 1 : 0
      this.putRequest(this.httpUrl.sysUser, user)
        .then(response => {
          this.$store.commit('loading', false)
          this.pm('操作成功', 'success')
          this.getUsers()
        })
        .catch(error => {
          this.$store.commit('loading', false)
        })
    },

    resetFilter () {
      this.searchFilter = {
        username: '',
        name: '',
        roleId: '',
        status: '',
        pageSize: 10,
        pageNum: 1
      }
      this.getUsers()
    },

    pageChanged (page) {
      this.searchFilter.pageNum = page
      this.getUsers()
    }
  }
};
</script>

<style lang="scss" scoped>
.el-input {
  width: 300px;
}

.filter {
  display: flex;
  margin: 12px 0;

  &-item {
    flex: 1;
  }

  &-label {
    font-size: 14px;
    margin-bottom: 8px;
  }

  &-input {
    width: 160px;
  }
}
</style>

