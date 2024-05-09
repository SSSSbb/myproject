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
    inputContent:'',
    which:'',
    todoid:'',
    style: 'border: 2rpx solid var(--td-input-border-color-example);border-radius: 12rpx;',
    cityText: '',
    action:'',
    cityValue: [],
    partsrecordlist:[],
    partsprofilelist:[],
    cityTitle: '',
    citys: [
      { label: '维修', value: 'repair' },
      { label: '维保', value: 'maintain' },
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
  onSubmit(){
    console.log(this.data.id);
    console.log(this.data.inputContent);
    const action = this.data.cityValue[0];
     post("/maintain/record/update",{ id:this.data.id,action:action,project:this.data.inputContent,safer:'0'}).then((res) => {
      console.log({res});
      post("/todo/update",{ id:this.data.todoid,status:1,record:this.data.id}).then((res) => {
        console.log({res});
      }).catch(error => { 
        this.showErrorToast(error);
      });
    }).catch(error => { 
      this.showErrorToast(error);
    });
  },
  onInput: function (event) {
    const inputValue = event.detail.value; // 获取用户输入的内容
    console.log('用户输入的具体操作内容:', inputValue);
    // 可以将输入的内容存储到 data 中，或者进行其他操作
    this.setData({
      inputContent: inputValue
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const id = options.id;
    const todoid = options.todo;
    console.log({todoid});
    this.setData({
      id:id,
      todoid:todoid,
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