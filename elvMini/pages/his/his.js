// pages/his/his.js
const { get } = require("../../api/api");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [], 
    codeid:'',
    profilelist:[],
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { user } = app.globalData;
    const { belongto, username } = user;
    console.log({user});
    get("/profile/index",{belongto}).then(({ data: { list } }) => {
      console.log({list});
      const transformedList = list.reduce((acc, item) => {
        acc[item.id] = item.location;
        return acc;
      }, {});
      console.log(transformedList[15]);
      this.setData({
        profilelist:transformedList,
      })
    }).catch(error => { 
      this.showErrorToast(error);
    }); 
    get("/rbac/user/index",{username:username}).then(({ data: { list } }) => {
      const codeid = list[0].role.id;
      this.setData({codeid:codeid})
      const maintainer = username;
      if(codeid==4){
        get("/maintain/record/index",{belongto,safer:maintainer}).then(({ data: { list } }) => {
          console.log({list});
          this.setData({ list });
        }).catch(error => { 
          this.showErrorToast(error);
        });
       }else{
        get("/maintain/record/index",{belongto,maintainer}).then(({ data: { list } }) => {
          console.log({list});
          this.setData({ list });
        }).catch(error => { 
          this.showErrorToast(error);
        });
       } 
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