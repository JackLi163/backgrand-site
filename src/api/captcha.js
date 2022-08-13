import request from "@/utils/request";

export function getcaptcha(params) {
  return request({
    url: "/res/captcha",
    method: "get",
    params,
  });
}