import request from "@/utils/request";

// 添加用户角色
export function addUserRole(data) {
  return request({
    url: "/userRole/save",
    method: "post",
    data,
  });
}
// 删除用户角色
export function rmUserRole(data) {
  return request({
    url: "/userRole/delete",
    method: "delete",
    data,
  });
}
// 通过用户id角色列表
export function getIdUserRole(userId) {
  return request({
    url: "/userRole/findRoleByUserId",
    method: "get",
    params: {
      userId,
    },
  });
}

// 通过角色id获取用户列表
export function getRoleIdUserRole(roleId) {
  return request({
    url: "/userRole/findUserByRoleId",
    method: "get",
    params: {
      roleId,
    },
  });
}
