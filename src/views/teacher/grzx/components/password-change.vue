<template>
  <div class="new-form">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="150px">
      <el-form-item label="旧密码" prop="old_password">
        <el-input type="password" v-model="ruleForm.old_password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_password">
        <el-input type="password" v-model="ruleForm.new_password"></el-input>
      </el-form-item>
      <el-form-item label="再次输入新密码" prop="new_password_again">
        <el-input type="password" v-model="ruleForm.new_password_again"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即保存</el-button>
        <el-button @click="clearpassword('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import je from "jsencrypt";
let encrypt = new je.JSEncrypt();
let decrypt = new je.JSEncrypt();

export default {
  name:'password-change',
  data() {
    var checkold = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入旧密码"));
      } else {
        if (this.ruleForm.new_password !== "") {
          this.$refs.ruleForm.validateField("new_password");
        }
        callback();
      }
    };
    var checknew = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        if (this.ruleForm.new_password_again !== "") {
          this.$refs.ruleForm.validateField("new_password_again");
        }
        callback();
      }
    };
    var checknewagain = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.ruleForm.new_password) {
        callback(new Error("两次输入密码不一致!"));
      } else if (
        !(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,20}$/.test(value) &&
          value.length >= 6
        )
      ) {
        callback(new Error("密码必须包含大小写字母和数字！长度至少六位!"));
      } else {
        callback();
      }
    };

    return {
      ruleForm: {
        old_password: "",
        new_password: "",
        new_password_again: "",
        requestID: "",
        publickey: ""
      },
      savejson: {},
      username: "nmsl",
      rules: {
        old_password: [
          { validator: checkold, trigger: "blur", required: true }
        ],
        new_password: [
          { validator: checknew, trigger: "blur", required: true }
        ],
        new_password_again: [
          { validator: checknewagain, trigger: "blur", required: true }
        ]
      }
    };
  },
  methods: {
    savepassword() {
      if (!(this.new_password === this.new_password_again)) {
        alert("两次输入密码不一致！");
      }
    },
    clearpassword(formName) {
      // (this.ruleForm.old_password = ""),
      //   (this.ruleForm.new_password = ""),
      //   (this.ruleForm.new_password_again = "");
      this.$refs[formName].resetFields();
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {};
          this.getRequest("api/key", params).then(response => {
            this.requestID = response.data.requestId;
            this.publickey = response.data.publicKey;
            // console.log(response.data.requestId);
            // console.log(response.data.publicKey);
            // console.log("ok");
            encrypt.setPublicKey(this.publickey);
            let encryptedoldpassword = encrypt.encrypt(
              this.ruleForm.old_password
            );
            let encryptednewpassword = encrypt.encrypt(
              this.ruleForm.new_password
            );
            // console.log("1");
            let putparams = {
              username: this.username,
              original_password: encryptedoldpassword,
              new_password: encryptednewpassword,
              requestId: this.requestID
            };
            this.putRequest("api/password", putparams).then(response2 => {
              // console.log(response2);
              this.$refs[formName].resetFields();
              alert("修改密码成功");
              this.$refs[formName].resetFields();
            });
            this.$refs[formName].resetFields();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  mounted() {
    let userInfoString = localStorage.getItem("userInfo");
    this.savejson = JSON.parse(userInfoString);
    this.username = this.savejson.username;
    console.log(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,20}$/.test("Luhaihunb110,.")
    );
  }
};
</script>
<style lang="scss" scoped>
.new-form {
  width: 600px;
}
</style>