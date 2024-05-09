// pages/addParts/addParts.js
const { get } = require("../../api/api");
const { post } = require("../../api/api");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Cityaction:'',
    style: 'border: 2rpx solid var(--td-input-border-color-example);border-radius: 12rpx;',
    action:'',
    partsprofilelist:[],
    cityText: '',
    inputContent:'',
    belongto:'',
    cityValue: [],
    cityTitle: '',
    actionText:'',
    id:'',
    which:'',
    actionValue:[],
    actionTitle:'',
    afterAction:'',
    afterText:'',
    afters:[],
    afterValue:'',
    afterTitle:'',
    citys: [
      { label: '清洁', value: 'clean' },
      { label: '润滑', value: 'lubricate' },
      { label: '检查', value: 'inspect' },
      { label: '调整', value: 'adjust' },
      { label: '更换零件', value: 'replace' },
    ],
  },
  onPickerChange(e) {
    const { value,label } = e.detail;
    console.log('picker change:', e.detail);
    this.setData({
      Cityaction:e.detail.value,
      cityVisible: false, 
      cityValue: value,
      cityText: label.join(' '),
    });
  },
  onAfterPickerChange(e) {
    const { value,label } = e.detail;
    console.log('picker change:', e.detail);
    this.setData({
      afterAction:e.detail.value,
      afterVisible: false, 
      afterValue: value,
      afterText: label.join(' '),
    });
  },
  onActionPickerChange(e) {
    const { value,label } = e.detail;
    console.log('picker change:', e.detail);
    this.setData({
      action:e.detail.value,
      actionVisible:false,
      actionText:label.join(' '),
      actionValue:value,
    });
  },
  onColumnChange(e) {
    console.log('picker pick:', e);
  },
  onPickerCancel(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({
      [`${key}Visible`]: false,
    });
  },
  onAfterPickerCancel(e) {
    this.setData({
      afterVisible: false,
    });
  },
  onActionPickerCancel(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({
      [`${key}Visible`]: false,
    });
  },
  onActionPicker() {
    this.setData({ actionVisible: true, actionTitle: '选择具体操作' });
  },
  onAfterPicker() {
    this.setData({ afterVisible: true, afterTitle: '选择更换后的零件' });
  },
  onPicker() {
    this.setData({ cityVisible: true, cityTitle: '选择零件' });
  },
  onSubmit() {
    const {id,which,belongto} = this.data;
    const {cityValue,actionValue,afterValue} = this.data;
    console.log({cityValue});
    console.log({actionValue});
    console.log({afterValue});
    post("/parts/record/create",{ part_id:cityValue[0],action:actionValue[0],replace_part:afterValue[0],extrainfo:this.data.inputContent,record_id:id,which: which,belongto:belongto}).then((res) => {
      console.log({res});  
  wx.navigateBack(); // 返回上一页
    }).catch(error => { 
      this.showErrorToast(error);
    });  
   },
  /**
   * 生命周期函数--监听页面加载
   */
  onInput: function (event) {
    const inputValue = event.detail.value; // 获取用户输入的内容
    console.log('用户输入的具体操作内容:', inputValue);
    // 可以将输入的内容存储到 data 中，或者进行其他操作
    this.setData({
      inputContent: inputValue
    });
  },
  showErrorToast(error) {
    wx.showToast({
      icon: "none",
      title: error || "未知错误",
    });
  },
  onLoad(options) {
    const { user } = app.globalData;
    const{belongto,username} = user;
    const id = options.id;
    console.log({id});
    const which = options.which;
    this.setData({
      id: id,
      which:which,
      belongto:belongto,
    });
    console.log('ID:', this.data.id);
    get("/parts/partsprofile/index",{ which: which,belongto:belongto}).then((res) => {
      const partsprofilelist = res.data.list.map(item => {
        return {
          value: item.id,
          label: item.name
        };
      });
      this.setData({
        partsprofilelist: partsprofilelist,
      });
      console.log(this.data.partsprofilelist);
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