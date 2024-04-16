const {
  post
} = require("../../../api/api");

const app = getApp()

// pages/user/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageLoading: false,
    uploadData: {
      username: "",
      password: ""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  // 输入框事件
  changeText(e) {
    const key = `uploadData.${e.currentTarget.dataset.name}`
    this.setData({
      [key]: e.detail.value
    })
  },


  toLogin() {
    this.setData({
      pageLoading: true
    })
    const data = this.data.uploadData
    // 去登录
    post("/login/account", data).then(res => {
      console.log(res);
      app.fillToken(res.data.token)
      this.setData({
        pageLoading: false
      })
      wx.switchTab({
        url: '/pages/home/home',
      })
    }).catch(res => {
      this.setData({
        pageLoading: false
      })
      wx.showToast({
        icon: "none",
        title: res.msg || res.message || "未知错误",
      })
    })




  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})