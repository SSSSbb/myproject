// pages/todo/todo.js
const { get } = require("../../api/api");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [], // 存储待办事项列表数据
    profilelist:[],
    namelist:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { user } = app.globalData;
    const { belongto, username } = user;
    const status = 0;
    get("/todo/index",{belongto,username,status}).then(({ data: { list } }) => {
      console.log({list});
      this.setData({ list });
      this.setData({ todo: list.length });
    }).catch(error => { 
      this.showErrorToast(error);
    }); 
    get("/profile/index",{belongto}).then(({ data: { list } }) => {
      console.log({list});
      const transformedList = list.reduce((acc, item) => {
        acc[item.id] = item.location;
        return acc;
      }, {});
      const transformed2List = list.reduce((acc, item) => {
        acc[item.id] = item.name;
        return acc;
      }, {});
      this.setData({
        profilelist:transformedList,
        namelist:transformed2List,
      })
    }).catch(error => { 
      this.showErrorToast(error);
    }); 
  },
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  showErrorToast(error) {
    wx.showToast({
      icon: "none",
      title: error || "未知错误",
    });
  },
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