import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
// import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";

NProgress.configure({ showSpinner: false }); // NProgress Configuration
router.beforeEach(async (to, from, next) => {
  // 开始进度条加载
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  // const hasToken = getToken();

  if (to.meta.auth) {
    if (store.getters.user) {
      next();
    } else {
      if (localStorage.getItem("adminToken")) {
        try {
          await store.dispatch("user/getInfo");
          next();
        } catch (error) {
          next(`/login?redirect=${to.path}`);
          await store.dispatch("user/resetToken");
          Message.error(error);
        }
      } else {
        next(`/login?redirect=${to.path}`);
        Message.error("请登录");
      }
    }

    NProgress.done();
  } else {
    if (to.path === "/login" && store.getters.user) {
      next({ path: "/" });
    } else {
      next();
    }
    NProgress.done();
  }

  /* if (hasToken) {
    if (to.path === "/login") {
      // if is logged in, redirect to the home page
      next({ path: "/" });
      NProgress.done();
    } else {
      const hasGetUserInfo = store.getters.name;
      if (hasGetUserInfo) {
        next();
      } else {
        try {
          // get user info
          await store.dispatch("user/getInfo");
          next();
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch("user/resetToken");
          Message.error(error || "Has Error");
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  } */
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
