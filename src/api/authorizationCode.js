import request from "@/utils/request";
// 生成客户授权码
export function addAuthorizationCode(data) {
  return request({
    url: "/clientAuthorizationCode/generate",
    method: "post",
    data,
  });
}

// 删除客户授权码
export function rmAuthorizationCode(data) {
  return request({
    url: "/clientAuthorizationCode/delete",
    method: "delete",
    data,
    headers: { "Content-Type": "application/json" },
  });
}

// 通过客户id获取客户授权码
export function getIdAuthorizationCode(clientId) {
  return request({
    url: "/clientAuthorizationCode/findListByClientId",
    method: "get",
    params: {
      clientId,
    },
  });
}

// 获取所有客户授权码;
export function getAllAuthorizationCode() {
  return request({
    url: "/clientAuthorizationCode/findAll",
    method: "get",
  });
}
