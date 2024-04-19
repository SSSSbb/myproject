// pages/hisdetail/hisdetail.js
const { get } = require("../../api/api");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [], 
    safer:[],
    profile:[],
    parts:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { user } = app.globalData;
    const { belongto } = user;
    const id = options.id;
    get("/maintain/record/index",{belongto,id}).then(({ data: { list } }) => {
      this.setData({ list });
    }).catch(error => { 
      this.showErrorToast(error);
    });
    const saferUsername =options.safer;
    get("/rbac/user/index",{belongto,username: saferUsername}).then(({ data: { list } }) => {
      this.setData({ safer:list });
    }).catch(error => { 
      this.showErrorToast(error);
    }); 
    const eid = options.eid;
    get("/profile/index",{belongto,id: eid}).then(({ data: { list } }) => {
      console.log({list});
      this.setData({ profile:list });
    }).catch(error => { 
      this.showErrorToast(error);
    }); 
    const partsRecord = options.parts_record;
    console.log({partsRecord});
    get("/parts/record/index",{belongto,id: partsRecord}).then(({ data: { list } }) => {
      console.log({list});
      this.setData({ parts:list });
    }).catch(error => { 
      this.showErrorToast(error);
    }); 
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