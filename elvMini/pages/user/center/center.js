// pages/user/center/center.js
const {
  get
} = require("../../../api/api");
const defaultHead = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0?wx_fmt=png'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultHead,
    user: "",
    enp:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
  },

  // 用户加载成功 ===== > 此处为监听 globalData.user.id 获取
  onLoadUser(options) {
    console.log(app.globalData.user);
    this.setData({
      user: app.globalData.user
    })

  },

  tpLogin() {
    wx.navigateTo({
      url: '/pages/user/login/login',
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
    this.setData({
      user: app.globalData.user
    })
    console.log(app.globalData.user);
    const user = app.globalData.user;
    this.setData({
      user: app.globalData.user
    })
    const belongto = user.belongto;
    console.log({belongto});
    get("/rbac/enterprise/index",{ id:
      belongto}).then((res) => {
      console.log({res});
      this.setData({
        enp:res.data.list[0].name,
      })
    }).catch(error => { 
      this.showErrorToast(error);
    });
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