import { loginApi, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const getDefaultState = () => {
  return {
    // token: getToken(),
    // name: "",
    // avatar: "",
    user: null, // 存储登录后的用户的信息
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  // SET_TOKEN: (state, token) => {
  //   state.token = token;
  // },
  // SET_NAME: (state, name) => {
  //   state.name = name;
  // },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar;
  // },
  SET_USER: (state, payload) => {
    state.user = payload;
  },
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { loginId, loginPwd, captcha, checked } = userInfo;
    return new Promise((resolve, reject) => {
      loginApi({
        loginId: loginId.trim(),
        loginPwd: loginPwd,
        captcha: captcha,
        remember: checked ? 7 : 0,
      })
        .then((response) => {
          const { data } = response;
          if (data) {
            commit("SET_USER", data);
            resolve();
          } else {
            reject(response);
          }
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then((response) => {
        if (typeof response === "string") {
          const res = JSON.parse(response);
          if (res.code === 401) {
            reject(res.msg);
          }
        } else {
          commit("SET_USER", response.data);
          resolve();
        }
      });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken(); // must remove  token  first
      resetRouter();
      commit("RESET_STATE");
      resolve();
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
