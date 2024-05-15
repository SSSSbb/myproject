// pages/home/home.js
const { get } = require("../../api/api");
const app = getApp();

Page({
  options: {
    styleIsolation: 'apply-shared',
  },
  data: {
    belongto:'',
    content: ['欢迎来到电梯维保系统'],
    profilelistData: [], // 初始化列表数据
    todo: 0,
    data: {
      visible: true,
      marquee1: {
        speed: 80,
        loop: -1,
        delay: 0,
      },
    },
  },
  onLoad(options) {
  },
  navigateToTodoPage() {
    wx.navigateTo({
      url: '/pages/todo/todo',
    });
  },
  navigateToHisPage() {
    wx.navigateTo({
      url: '/pages/his/his',
    });
  },
  onShow() {
    this.getUserInfo();
    this.getProfileList();
    get("/main/notice/index", { belongto: this.data.belongto ,status:1}).then(({ data: { list } }) => {
      console.log({ list });
      const contentArray = list.map(item => item.content);
      this.setData({
        content: contentArray,
      });
    }).catch(error => { 
      this.showErrorToast(error);
    });
    
  },
  onUnload() {
    this.setData({ profilelistData: [] });
  },
  getUserInfo() {
    const { user } = app.globalData;
    const { belongto, username } = user;
    const status = 0 ;
    this.setData({belongto});
    get("/todo/index",{belongto,username,status}).then(({ data: { list } }) => {
      console.log({list});
      this.setData({ todo: list.length });
    }).catch(error => {
      this.showErrorToast(error);
    });
  },
  getProfileList() {
    const { belongto } = app.globalData.user;
    get("/profile/index", { belongto }).then(({ data: { list } }) => {
      this.setData({ profilelistData: list });
    }).catch(error => {
      this.showErrorToast(error);
    });
  },
  showErrorToast(error) {
    wx.showToast({
      icon: "none",
      title: error || "未知错误",
    });
  },
});
