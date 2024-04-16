// pages/home/home.js
const {
  get
} = require("../../api/api");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  options: {
    styleIsolation: 'apply-shared',
  },
  data: {
    imageSrc: 'https://tdesign.gtimg.com/mobile/demos/image1.jpeg',
    profilelistData: [], // 初始化列表数据
    data: {
      visible: true,
      marquee1: {
        speed: 80,
        loop: -1,
        delay: 0,
      },
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) { 
    get("/profile/index").then(res => {
      console.log(res.data.list);
      this.setData({
        profilelistData: res.data.list
      });
    }).catch(res => {
      wx.showToast({
        icon: "none",
        title: res || "未知错误",
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