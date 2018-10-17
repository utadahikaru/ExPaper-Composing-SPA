import axios from "axios";
import { pm } from "./msg";
import qs from "qs";
import router from "../router";
import store from "../store";

export const httpUrl = {
  userSubject: "user/subject",
  key: "api/key",
  login: "api/login",
  logout: "api/logout",
  password: "api/password",
  exercise: "exercise",
  exerciseCollect: "exerciseCollection",
  paper: "paper",
  knowledge: "knowledge",
  knowledgeOrder: "knowledge/order",
  book: "book",
  bookOrder: "book/order",
  feature: "feature",
  featureExercise: "feature/exercise",
  subject: "subject",
  subjectMember: "subject/member",
  paperType: "type/paper",
  exerciseType: "type/exercise",
  sysUser: "sys/user",
  sysRole: "sys/role"
};

export function getRequest(url, data) {
  return fetch({
    url: url,
    method: "get",
    params: data
  });
}

export function postRequest(url, data) {
  return fetch({
    url: url,
    method: "post",
    data: qs.stringify(data)
  });
}

export function putRequest(url, data) {
  return fetch({
    url: url,
    method: "put",
    data: qs.stringify(data)
  });
}

export function deleteRequest(url, data) {
  return fetch({
    url: url,
    method: "delete",
    params: data
  });
}

function getToken() {
  let userInfoString = localStorage.getItem("userInfo");
  if (userInfoString === null) {
    return "";
  }
  let userInfo = JSON.parse(userInfoString);
  return userInfo.token;
}

export function fetch(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: process.env.BASE_API,
      timeout: 5000,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        token: getToken()
      }
    });

    instance(options)
      .then(response => {
        let res = response.data;
        let statusCode = res.statusCode;
        if (statusCode.length > 4) {
          if (statusCode[1] === "0") {
            // 成功
            resolve(res);
          } else {
            reject("");
            console.log("fail", res);
            if (statusCode[2] === "1") {
              // 跳转到登陆页
              localStorage.clear();
              store.commit("clearUserInfo");
              store.commit("clearExerciseType");
              store.commit("clearTextbook");
              store.commit("clearKnowledge");
              router.push("/auth/login");
              pm("登陆已过期，请重新登录", "warning");
            } else if (statusCode[2] === "2") {
              // 跳转到更改密码页
              router.push("/auth/resetPassword");
            } else if (statusCode[2] === "3") {
              // 跳转到首页
              router.push("/home");
            } else {
              // 不跳转
              if (statusCode[3] === "1") {
                // 正常，前端提示
                pm(res.message);
              } else if (statusCode[3] === "2") {
                // 错误，前端提示
                pm(res.message, "warning");
              } else if (statusCode[3] === "3") {
                // 严重错误，前端提示
                pm(res.message, "error");
              } else {
                // 正常，前端不提示
              }
            }
          }
        }
      })
      .catch(error => {
        reject(error);
        console.log("error", error);
        if (error.message.indexOf("timeout") !== -1) {
          pm(
            "数据查询超时,建议添加查询条件进行查询，请勿频繁提交！",
            "warning"
          );
        } else {
          pm("数据接口出错，请联系管理员 !", "error");
        }
      });
  });
}
