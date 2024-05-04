// pages/maintain/maintain.js
const { get } = require("../../api/api");
const { post } = require("../../api/api");

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    which:'',
    style: 'border: 2rpx solid var(--td-input-border-color-example);border-radius: 12rpx;',
    cityText: '',
    action:'',
    cityValue: [],
    partsrecordlist:[],
    partsprofilelist:[],
    cityTitle: '',
    citys: [
      { label: '清洁', value: 'clean' },
      { label: '润滑', value: 'lubricate' },
      { label: '检查', value: 'inspect' },
      { label: '调整', value: 'adjust' },
      { label: '更换零件', value: 'replace' },
    ],
  },

  onPickerChange(e) {
    const { key } = e.currentTarget.dataset;
    const { value,label } = e.detail;

    console.log('picker change:', e.detail);

    this.setData({
      action:e.detail.value,
      [`${key}Visible`]: false,
      [`${key}Value`]: value,
      [`${key}Text`]: label.join(' '),
    });
  },
  onPickerCancel(e) {
    const { key } = e.currentTarget.dataset;
    console.log(e, '取消');
    console.log('picker1 cancel:');
    this.setData({
      [`${key}Visible`]: false,
    });
  },
  onTitlePicker() {
    this.setData({ cityVisible: true, cityTitle: '选择操作' });
  },
  navigateToAddPartsPage: function () {
    wx.navigateTo({
      url: '/pages/addParts/addParts?id='+this.data.id+"&which="+this.data.which // 这里的路径是你要跳转的页面路径
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const{id,eid} = options;
    this.setData({
      id:id,
      which:eid,
    })
    const { user } = app.globalData;
    const{belongto,username} = user;
     get("/parts/record/index",{ record_id: id}).then((res) => {
      console.log({res});
      this.setData({
        partsrecordlist:res.data.list,
      })
    }).catch(error => { 
      this.showErrorToast(error);
    });
    
    // post("/maintain/record/update",{ id: id}).then((res) => {
    //   wx.navigateTo({
    //     url: '/pages/maintain/maintain?id=' + res.data
    //   });
    // }).catch(error => { 
    //   this.showErrorToast(error);
    // });
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