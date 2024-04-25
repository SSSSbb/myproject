// pages/view/view.js
const { get } = require("../../api/api");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    schedulelist: [], 
    userlist:[],
    scheduleTable: [[], [], [], [], []], // 初始化排班表数据
    currentUser:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { user } = app.globalData;
    const { belongto, username } = user;
    this.setData({ currentUser:username });
    get("/schedule/schedulelist/index",{belongto}).then((res) => {
      this.setData({ schedulelist:res.data });
      get("/rbac/user/index",{belongto}).then(({ data: { list } }) => {
        console.log({list});
        this.setData({ userlist:list });
        const userIdToUsernameMap = {};
        this.data.userlist.forEach(user => {
                 userIdToUsernameMap[user.id] = user.username;
        });
             this.data.schedulelist.forEach(item => {
              item.username = userIdToUsernameMap[item.userid]; 
            });
            const scheduletable = [[], [], [], [], []];
            this.data.schedulelist.forEach(item => {
              const { slot, weekday } = item;
              scheduletable[slot][weekday] = item; 
            });
            this.setData({ scheduleTable: scheduletable });
            console.log(this.data.scheduleTable);
      }).catch(error => { 
        this.showErrorToast(error);
      }); 
    }).catch(error => { 
      console.log({error});
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
  showErrorToast(error) {
    wx.showToast({
      icon: "none",
      title: error || "未知错误",
    });
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