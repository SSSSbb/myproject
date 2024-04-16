import CustomHook from 'spa-custom-hooks';

import {
  get
} from "./api/api"

let globalData = {
  // 是否已拿到token
  token: '',
  // 用户信息
  user: {
    id: '',
    nickname: '',
    avatar: ''
  }
}

// 因为获取用户信息是异步的


CustomHook.install({
  'User': {
    name: 'User',
    watchKey: 'user',
    deep: true,
    onUpdate(user) {
      return !!user.id;
    }
  }
})



App({
  fillToken(val) {
    console.log(val);
    globalData.token = val;
    wx.setStorageSync('token', val)
    get("/rbac/user/current").then(res => {
      console.log(res);
      globalData.user = res.data;
    })
  },
  onLaunch() {},
  globalData
})