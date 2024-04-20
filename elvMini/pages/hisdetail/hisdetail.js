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
    parts_beforelist:[],
    parts_afterlist:[],
    parts_before:0,
    parts_after:0,
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
            this.setData({ parts:list ,parts_before:list[0].part_id,
              parts_after:list[0].replace_part});
      get("/parts/partsprofile/index",{belongto,id: this.data.parts_before}).then(({ data: { list } }) => {
        console.log({list});
        this.setData({ parts_beforelist:list });
      }).catch(error => { 
        this.showErrorToast(error);
      }); 
      get("/parts/partsprofile/index",{belongto,id: this.data.parts_after}).then(({ data: { list } }) => {
        console.log({list});
        this.setData({ parts_afterlist:list });
      }).catch(error => { 
        this.showErrorToast(error);
      }); 
    }).catch(error => { 
      this.showErrorToast(error);
    }); 
    console.log(this.data.parts_before);
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