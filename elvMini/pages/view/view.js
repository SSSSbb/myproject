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
    date:'',
    slot:[],
    slotList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad(options) {

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
    const today = new Date();
    const dayOfYear = (today - new Date(today.getFullYear(), 0, 0)) / 86400000;
    const weekNumber = Math.ceil((dayOfYear + 1) / 7);
    const date =today.getFullYear()+""+weekNumber;
    this.setData({date});
        const { user } = app.globalData;
        const { belongto, username } = user;
        this.setData({ currentUser:username });
        console.log(this.data.currentUser);
        get("/schedule/schedulelist/index",{belongto}).then((res) => {
          console.log({res});
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
                  const date = new Date(item.create_time);
                   const year = date.getFullYear();
                   const dayOfyear = (date - new Date(date.getFullYear(), 0, 0)) / 86400000;
    const weeknumber = Math.ceil((dayOfyear + 1) / 7);
                   const temp = year+''+weeknumber;
                  //  console.log({temp});
                  //  console.log(this.data.date);
                   if(temp==this.data.date){
                    scheduletable[slot][weekday] = item; 
                   }
                });
                this.setData({ scheduleTable: scheduletable });
                console.log(this.data.scheduleTable); 
          }).catch(error => { 
            this.showErrorToast(error);
          }); 
        }).catch(error => { 
          console.log({error});
        }); 
        console.log({belongto})
        get("/schedule/slot/index", { belongto: belongto })
  .then((res) => {
    console.log({ res });
    const slotList = res.data.list.reduce((acc, curr) => {
      acc[curr.code] = curr.slot;
      return acc;
    }, {});
    console.log(slotList);
    this.setData({slotList});
    // 可以将 slotList 存储在状态中或者进行其他操作
  })
  .catch((error) => {
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