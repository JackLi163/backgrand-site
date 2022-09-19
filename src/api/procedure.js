import request from "@/utils/request";
// 添加程序;
export function addProcedure(data) {
  return request({
    url: "/procedure/save",
    method: "post",
    data,
  });
}
// 更新程序
export function upProcedure(data) {
  return request({
    url: "/procedure/update",
    method: "put",
    data,
  });
}

// 删除程序
export function rmProcedure(data) {
  return request({
    url: "/procedure/delete",
    method: "delete",
    data,
  });
}
// 通过id获取程序
export function getIdProcedure(id = "") {
  return request({
    url: "/procedure/findById",
    method: "get",
    params: {
      id,
    },
  });
}
// 通过类型获id取程序列表
export function getTypeIdProcedure(typeId = "", pageNum = 1, pageSize = 5) {
  return request({
    url: "/procedure/findListByTypeId",
    method: "get",
    params: {
      typeId,
      pageNum,
      pageSize,
    },
  });
}

// 获取所有程序
export function getAllProcedure(pageNum = 1, pageSize = 5) {
  return request({
    url: "/procedure/findAll",
    method: "get",
    params: {
      pageNum,
      pageSize,
    },
  });
}
