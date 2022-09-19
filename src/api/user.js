import request from "@/utils/request";

// 添加用户
export function addUser(data) {
  return request({
    url: "/user/save",
    method: "post",
    data,
  });
}

// 更新用户
export function updataInfo(data) {
  return request({
    url: "/user/update",
    method: "put",
    data,
  });
}
// 删除用户
export function rmUser(data) {
  return request({
    url: "/user/delete",
    method: "delete",
    headers: { "Content-Type": "application/json" },
    data,
  });
}

// 获取所有用户
export function getAllUser(data) {
  return request({
    url: "/user/findAll",
    method: "get",
    data,
  });
}
// 登陆
export function loginApi(data) {
  return request({
    url: "/user/login",
    method: "post",
    data,
  });
}

// export function getInfo() {
//   return request({
//     url: "/api/admin/whoami",
//     method: "get",
//   });
// }
