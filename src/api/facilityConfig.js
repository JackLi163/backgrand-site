import request from "@/utils/request";
// 添加设备配置
export function addFacilityConfig(data) {
  return request({
    url: "/facilityConfig/save",
    method: "post",
    data,
  });
}

// 更新设备配置
export function upFacilityConfig(data) {
  return request({
    url: "/facilityConfig/update",
    method: "put",
    data,
  });
}
// 通过客户id获取设备配置
export function getIdFacilityConfig(clientId) {
  return request({
    url: "/facilityConfig/findByClientId",
    method: "get",
    params: {
      clientId,
    },
  });
}
