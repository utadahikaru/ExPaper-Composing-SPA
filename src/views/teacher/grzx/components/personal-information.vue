<template>
  <div>
    <!-- 用户信息 -->
    <div>
      <div class="item">
        <span class="label">姓 名:</span>
        <span class="value">{{userInfo.name}}</span>
      </div>
      <div class="item">
        <span class="label">电 话:</span>
        <span class="value">{{userInfo.tel}}</span>
      </div>
      <div class="item">
        <span class="label">邮 箱:</span>
        <span class="value">{{userInfo.email}}</span>
      </div>

      <el-button class="btn-edit el-icon-edit" type="text" @click="beforeEditUserInfo">修改资料</el-button>
    </div>

    <!-- 修改用户弹框 -->
    <el-dialog title="修改用户类型" :visible.sync="editUserDialogVisible">

      <el-form :model="editUserForm" :rules="editUserFormRules" ref="editUserFormRules" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editUserForm.name" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="editUserForm.tel" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email" style="width:200px"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "personal-information",
  data() {
    var checkEmail = (rule, value, callback) => {
      let mal = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (!value) {
        return callback();
      }
      if (!mal.test(value)) {
        callback(new Error("请输入正确邮箱"));
      } else {
        callback();
      }
    };
    return {
      editUserDialogVisible: false,
      editUserForm: {
        username: "",
        name: "",
        tel: "",
        email: ""
      },
      editUserFormRules: {
        name: [
          { required: true, message: "请输入用户姓名", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字", trigger: "blur" }
        ],
        tel: [
          { required: false, message: "", trigger: "blur" },
          {
            type: "string",
            len: 11,
            message: "请输入11位手机号",
            trigger: "blur"
          }
        ],
        email: [{ required: false, validator: checkEmail, trigger: "blur" }]
      }
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    }
  },
  methods: {
    beforeEditUserInfo() {
      this.editUserForm = {
        username: this.userInfo.username,
        name: this.userInfo.name,
        tel: this.userInfo.tel,
        email: this.userInfo.email
      };
      this.editUserDialogVisible = true;
    },

    editUserConfirm() {
      this.$refs.editUserFormRules.validate(valid => {
        if (valid) {
          this.editUserDialogVisible = false;
          this.editUserInfo();
        } else {
        }
      });
    },

    editUserInfo() {
      this.$store.commit("loading", true);
      this.putRequest(this.httpUrl.sysUser, this.editUserForm)
        .then(response => {
          this.$store.commit("loading", false);
          this.pm("用户信息修改成功", "success");
        })
        .catch(error => {
          this.$store.commit("loading", false);
        });
    },

    resetInfo() {
      let userInfo = this.getLs("userInfo");
      userInfo.name = this.editUserForm.name;
      userInfo.tel = this.editUserForm.tel;
      userInfo.email = this.editUserForm.email;

      this.setLs("userInfo", userInfo);
      this.$store.commit("setUserInfo");
    }
  }
};
</script>

<style lang="scss" scoped>
.new-form {
  width: 600px;
}

.item {
  margin-bottom: 24px;
}

.label {
  color: #444444;
}

.btn-edit {
  position: absolute;
  right: 0;
  top: 0;
}
</style>