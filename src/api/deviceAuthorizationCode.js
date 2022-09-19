import request from "@/utils/request";
// 生成设备授权码
export function adddeviceAuthorizationCode(data) {
  return request({
    url: "/deviceAuthorizationCode/generate",
    method: "post",
    data,
  });
}

// 更换设备授权码
export function updeviceAuthorizationCode(data) {
  return request({
    url: "/deviceAuthorizationCode/change",
    method: "put",
    data,
  });
}

// 获取所有设备授权码
export function getAlldeviceAuthorizationCode(pageNum = 1, pageSize = 10) {
  return request({
    url: "/deviceAuthorizationCode/findAll",
    method: "get",
    params: {
      pageNum,
      pageSize,
    },
  });
}
// 通过客户id获取设备授权码列表
export function getIddeviceAuthorizationCode(
  clientId,
  pageNum = 1,
  pageSize = 5
) {
  return request({
    url: "/deviceAuthorizationCode/findListByClientId",
    method: "get",
    params: {
      clientId,
      pageNum,
      pageSize,
    },
  });
}
