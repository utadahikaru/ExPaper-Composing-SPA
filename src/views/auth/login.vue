<template>
  <section>
    <div class="bqteam-login">
      <div class="login-main">
        <el-row>
          <el-col :span="24" class="login-title">
            <span>登录系统</span>
          </el-col>
          <el-col :span="24">
            <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="120px">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="loginForm.username" style="width:200px"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input type='password' v-model="loginForm.password" style="width:200px"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="clickLoginBtn" size="medium">登录</el-button>
                <el-button @click="resetForm('loginForm')" size="medium">重置</el-button>
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
    return {
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 4, max: 11, message: "请输入长度在4到11位的用户名", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 18, message: "请输入长度在6-18位的字母和数字组合的密码", trigger: "blur" }
        ]
      }
    }
  },
  mounted () {
    this.clearStorge()
  },
  methods: {
    clearStorge () {
      // 既然要登陆，那就把本地存储的信息都删一下吧
      localStorage.clear()
    },

    clickLoginBtn () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.getPublicKey()
        } else {
          return false;
        }
      })
    },

    getPublicKey () {
      this.$store.dispatch('loading', true)
      this.getRequest(this.httpUrl.key, {})
        .then(response => {
          let requestId = response.data.requestId
          let publicKey = response.data.publicKey
          localStorage.setItem('username', this.loginForm.username)

          this.login(requestId, publicKey)
        })
        .catch(error => {
          this.$store.dispatch('loading', false)
        })
    },

    login (requestId, publicKey) {
      //这里保存用户名是为了首次登陆修改密码的时候在修改密码页面使用，在登陆成功或密码修改成功的时候要删掉
      localStorage.setItem('username', this.loginForm.username)

      let encrypt = new JSEncrypt()
      encrypt.setPublicKey(publicKey)
      let encryptedPassword = encrypt.encrypt(this.loginForm.password)
      let params = { username: this.loginForm.username, password: encryptedPassword, requestId: requestId }
      this.postRequest(this.httpUrl.login, params)
        .then(response => {
          let userInfo = response.data
          this.setLs('userInfo', userInfo)
          this.$store.commit('setUserInfo')
          console.log(userInfo);

          if (userInfo.roleId === 3 || userInfo.roleId === 4) {
            // 普通教师和学科管理员必须要在某个学科中才能登陆
            this.getUserSubjects()
          } else {
            this.$store.dispatch('loading', false)
            // 系统管理员和超级管理员直接登录
            this.$router.push("/home");
          }
        })
        .catch(error => {
          this.$store.dispatch('loading', false)
        })
    },

    getUserSubjects () {
      this.getRequest(this.httpUrl.userSubject, {})
        .then(response => {
          this.$store.dispatch('loading', false)
          if (response.data.length === 0) {
            this.$alert('您的账户不属于任何一个学科组，请联系学科组管理员', '登陆失败', {
              confirmButtonText: '我知道了'
            })
          } else {
            this.saveSubject(response.data)
            this.$router.push("/home");
          }
        })
        .catch(error => {
          this.$store.dispatch('loading', false)
        })
    },

    saveSubject (subjectArray) {
      let subjects = []
      subjectArray.forEach(element => {
        let subject = { id: element.subjectId, name: element.subjectName, grades: element.subjectGrade }
        subjects.push(subject)
      })
      this.setLs('userSubjects', subjects)
      this.setLs('userSubject', subjects[0])
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


