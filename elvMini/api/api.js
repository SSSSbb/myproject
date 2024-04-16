const base_api = "http://localhost:8080"

const request = (url, options) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${base_api}${url}`,
      method: options.method,
      data: options.method === 'GET' ? options.data : JSON.stringify(options.data),
      header: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': wx.getStorageSync('token')
      },
      success(request) {
        if (request.data.code === 200) {
          resolve(request.data)
        } else {
          if (request.data.code === 401) {
            reject(request.data)
            wx.showModal({
              title: '请登录',
              content: '登录已经失效',
              confirmText: '重新登录',
              cancelText: '不了',
              success(res) {
                console.log(res.confirm);
                if (res.confirm) {
                  wx.navigateTo({
                    url: "/pages/user/login/login"
                  })
                } else if (res.cancel) {}
              }
            })
          } else {
            reject(request.data)
          }
        }
      },
      fail(error) {
        reject(error.data)
      }
    })
  })
}

const get = (url, options = {}) => {
  return request(url, {
    method: 'GET',
    data: options
  })
}

const post = (url, options) => {
  return request(url, {
    method: 'POST',
    data: options
  })
}

const put = (url, options) => {
  return request(url, {
    method: 'PUT',
    data: options
  })
}

const remove = (url, options) => {
  return request(url, {
    method: 'DELETE',
    data: options
  })
}

module.exports = {
  get,
  post,
  put,
  remove
}