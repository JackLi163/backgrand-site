import request from "@/utils/request";
// 增加客户
export function addClient(data) {
  return request({
    url: "/client/save",
    method: "post",
    data,
  });
}
// 更新客户
export function upClient(data) {
  return request({
    url: "/client/update",
    method: "put",
    data,
  });
}
// 删除客户
export function rmClient(data) {
  return request({
    url: "/client/delete",
    method: "delete",
    headers: { "Content-Type": "application/json" },
    data,
  });
}
// 查询所有客户
export function getAllClient(pageNum = 1, pageSize = 10) {
  return request({
    url: "/client/findAll",
    method: "get",
    params: {
      pageNum,
      pageSize,
    },
  });
}

// 手机号查询客户
export function getPhoneClient(tel = "") {
  return request({
    url: "/client/findByTel",
    method: "get",
    params: {
      tel,
    },
  });
}

// id查询客户
export function getIdClient(id = "") {
  return request({
    url: "/client/findById",
    method: "get",
    params: {
      id,
    },
  });
}
// 姓名查询客户
export function getnameClient(name) {
  return request({
    url: "/client/findByName",
    method: "get",
    params: {
      name,
    },
  });
}
