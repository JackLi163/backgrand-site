// 判断表单是否存在空值
export function formContentIsNull(data) {
  for (const key in data) {
    if (
      !data[key].toString().trim() &&
      key !== "id" &&
      key !== "thumb" &&
      key !== "toc" &&
      key !== "github"
    ) {
      console.log(key, data[key]);
      return true;
    }
  }

  return false;
}
