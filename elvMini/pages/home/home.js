// pages/home/home.js
const { get } = require("../../api/api");
const app = getApp();

Page({
  options: {
    styleIsolation: 'apply-shared',
  },
  data: {
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
  onShow() {
    this.getUserInfo();
    this.getProfileList();
  },
  onUnload() {
    this.setData({ profilelistData: [] });
  },
  getUserInfo() {
    const { user } = app.globalData;
    const { belongto, username } = user;
    const status = 0;
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
