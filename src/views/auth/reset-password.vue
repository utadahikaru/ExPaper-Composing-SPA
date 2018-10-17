<template>
  <section>
    <div class="bqteam-login">
      <div class="login-main">
        <el-row>
          <el-col :span="24" class="login-title">
            <span>修改密码</span>
          </el-col>
          <el-col :span="24">
            <el-form :model="resetForm" :rules="rules" ref="resetForm" label-width="120px">
              <el-form-item label="原密码" prop="password">
                <el-input v-model="resetForm.password" style="width:200px"></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input type='password' v-model="resetForm.newPassword" style="width:200px"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input type='password' v-model="resetForm.confirmPassword" style="width:200px"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getPublicKey" size="medium">修改</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
  </section>
</template>

<script>
import { JSEncrypt } from 'jsencrypt'

export default {
  data () {
    var validateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.resetForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      resetForm: {
        password: "",
        newPassword: "",
        confirmPassword: ""
      },
      rules: {
        password: [
          {
            required: true,
            message: "请输入原密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 18,
            message: "请输入长度在6-18位的字母和数字组合的密码",
            trigger: "blur"
          }
        ],
        newPassword: [
          {
            required: true,
            message: "请输入新的密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 18,
            message: "请输入长度在6-18位的字母和数字组合的密码",
            trigger: "blur"
          }
        ],
        confirmPassword: [
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getPublicKey () {
      this.getRequest(this.httpUrl.key, {})
        .then(response => {
          let requestId = response.data.requestId
          let publicKey = response.data.publicKey

          this.reset(requestId, publicKey)
        })
    },

    reset (requestId, publicKey) {
      let username = localStorage.getItem('username')

      let encrypt = new JSEncrypt()
      encrypt.setPublicKey(publicKey)
      let encryptedPassword = encrypt.encrypt(this.resetForm.password)
      let encryptedNewPassword = encrypt.encrypt(this.resetForm.newPassword)

      let params = { username: username, original_password: encryptedPassword, new_password: encryptedNewPassword, requestId: requestId }
      console.log(username);
      console.log(this.resetForm.password);
      console.log(this.resetForm.newPassword);

      this.putRequest(this.httpUrl.password, params)
        .then(response => {
          this.$alert('密码修改成功，请重新登录', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.$router.go(-1)
              localStorage.removeItem('username')
            }
          })
        })
    }
  }
};
</script>

<style lang="scss" scoped>
.bqteam-login {
  position: absolute;
  width: 400px;
  top: 50%;
  left: 50%;
  margin-left: -200px;
  margin-top: -150px;
  background-color: #ffffff;
  vertical-align: middle;
  border-radius: 15px;
  box-shadow: 3px 3px 2px #aaaaaa;
  .login-main {
    position: relative;
  }
  .login-title {
    text-align: center;
    padding: 25px;
    span {
      font-size: 26px;
      color: $color-bqteam-main;
    }
  }
}
</style>


