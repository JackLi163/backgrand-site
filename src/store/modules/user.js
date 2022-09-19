import { loginApi } from "@/api/user";
import { removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const getDefaultState = () => {
  return {
    user: null, // 存储登录后的用户的信息
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },

  SET_USER: (state, payload) => {
    state.user = payload;
  },
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { loginId, loginPwd } = userInfo;
    return new Promise((resolve, reject) => {
      loginApi({
        tel: loginId.trim(),
        password: loginPwd,
        // remember: checked ? 7 : 0,
      })
        .then((response) => {
          const { data } = response;
          if (data) {
            commit("SET_USER", data.user);
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
      // getInfo(state.token).then((response) => {
      //   if (typeof response === "string") {
      //     const res = JSON.parse(response);
      //     if (res.code === 401) {
      //       reject(res.msg);
      //     }
      //   } else {
      //     commit("SET_USER", response.data);
      //     resolve();
      //   }
      // });
      let obj;
      if (sessionStorage.getItem("adminInfo")) {
        obj = JSON.parse(sessionStorage.getItem("adminInfo"));
      } else {
        obj = {};
      }

      commit("SET_USER", obj);
      resolve();
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
