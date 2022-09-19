import request from "@/utils/request";
// 添加客户软件更新日志
export function addClientProcedureUpdateLog(data) {
  return request({
    url: "/clientProcedureUpdateLog/save",
    method: "post",
    data,
  });
}
// 更新客户软件更新日志
export function upClientProcedureUpdateLog(data) {
  return request({
    url: "/clientProcedureUpdateLog/update",
    method: "put",
    data,
  });
}
// 删除客户软件更新日志
export function rmClientProcedureUpdateLog(data) {
  return request({
    url: "/clientProcedureUpdateLog/delete",
    method: "delete",
    headers: { "Content-Type": "application/json" },
    data,
  });
}
// 通过程序id获取客户软件更新日志
export function getIdClientProcedureUpdateLog(
  procedureId,
  pageNum = 1,
  pageSize = 5
) {
  return request({
    url: "/clientProcedureUpdateLog/findListByProcedureId",
    method: "get",
    params: {
      procedureId,
      pageNum,
      pageSize,
    },
  });
}
// 通过客户id和软件id获取客户软件更新日志
export function getIdAndProIdClientProcedureUpdateLog(procedureId, clientId) {
  return request({
    url: "/clientProcedureUpdateLog/findByClientIdAndProcedureId",
    method: "get",
    params: {
      procedureId,
      clientId,
    },
  });
}
// 通过更新状态和客户id获取客户软件更新日志
export function getUptypeAndIdClientProcedureUpdateLog(data = {}) {
  return request({
    url: "/clientProcedureUpdateLog/findListByUpdateStateIdAndClientId",
    method: "get",
    params: {
      ...data,
    },
  });
}
