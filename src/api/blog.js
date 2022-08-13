import request from "@/utils/request";
// 分页获取文章
export function getBlog(page = 1, limit = 5) {
  return request({
    url: "/api/blog",
    method: "get",
    params: {
      page,
      limit,
    },
  });
}
// 删除相应文章
export function deleteBlog(id) {
  return request({
    url: `/api/blog/${id}`,
    method: "delete",
  });
}
// 获取文章分类
export function getBlogType() {
  return request({
    url: "/api/blogtype",
    method: "get",
  });
}
// 添加文章分类
export function addBlogType(data) {
  return request({
    url: "/api/blogtype",
    method: "post",
    data,
  });
}
// 修改文章分类
export function editBlogType(id, data) {
  return request({
    url: `/api/blogtype/${id}`,
    method: "put",
    data,
  });
}

// 删除文章分类
export function deleteBlogType(id) {
  return request({
    url: `/api/blogtype/${id}`,
    method: "delete",
  });
}
// 发布文章
export function addBlog(data) {
  return request({
    url: "/api/blog",
    method: "post",
    data,
  });
}

// 修改文章
export function editBlog(id, data) {
  return request({
    url: `/api/blog/${id}`,
    method: "put",
    data,
  });
}
// 获取单篇文章
export function getOneBlog(id) {
  return request({
    url: `/api/blog/${id}`,
    method: "get",
  });
}
