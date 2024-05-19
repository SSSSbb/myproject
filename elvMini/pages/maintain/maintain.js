// pages/maintain/maintain.js
const { get } = require("../../api/api");
const { post } = require("../../api/api");

var picdata = null;
var context = null; // 使用 wx.createContext 获取绘图上下文 context
var mCanvas = null;
var base = null;

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    inputContent:'',
    eid:'',
    maintainer:'',
    sign:'',
    username:'',
    belongto:'',
    hasDraw: false, //默认没有画
    todoid:'',
    style: 'border: 2rpx solid var(--td-input-border-color-example);border-radius: 12rpx;',
    cityText: '',
    action:'',
    cityValue: [],
    data:'',
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
    if (!this.data.hasDraw) {
      wx.showModal({
        title: '提示',
        content: '签名内容不能为空！',
        showCancel: false
      });
      return false;
    };
    const inputContent = this.data.inputContent;
    const data = this.data.data;
    const todoid = this.data.todoid;
    const belongto = this.data.belongto;
    const username = this.data.username;
    const eid = this.data.eid;
    const action = this.data.cityValue[0];
    console.log({picdata});
    post("/maintain/record/create",{ belongto:belongto,enp_sign:base,safer:'0',pic:app.globalData.pic}).then((res) => {
       console.log({res});
       const record_id = res.data;
       console.log({record_id});
       post("/maintain/record/update",{ id:record_id,eid:eid,maintainer:username,action:action,project:inputContent,returned:0}).then((res) => {
        console.log({res});
        console.log({record_id});
        post("/todo/update",{ id:todoid,status:1,record:record_id}).then((res) => {
          console.log({res});
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 4000,
            success: function() {
              wx.switchTab({
                url: '/pages/home/home'  // 替换为你要跳转的页面路径
              });
            }
          });
        });
     });
    });
    
  },
  onInput: function (event) {
    const inputValue = event.detail.value; // 获取用户输入的内容
    console.log('用户输入的具体操作内容:', inputValue);
    this.setData({
      inputContent: inputValue
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  showErrorToast(error) {
    wx.showToast({
      icon: "none",
      title: error || "未知错误",
    });
  },
  onLoad(options) {
    picdata = options.data;
    const data = options.data;
    const eid = options.eid;
    const { user } = app.globalData;
    const { belongto, username } = user;
    console.log({options});
    this.setData({
      data:data,
      eid:eid,
      belongto:belongto,
      username:username,
    });
    wx.createSelectorQuery()
    .select('#canvas') // 在 WXML 中填入的 id
    .fields({
      node: true,
      size: true
    })
    .exec((res) => {
      // Canvas 对象
      const canvas = res[0].node
      mCanvas = res[0].node
      // 渲染上下文
      context = canvas.getContext('2d')
      // Canvas 画布的实际绘制宽高
      const width = res[0].width
      const height = res[0].height
      // 初始化画布大小
      const dpr = wx.getWindowInfo().pixelRatio
      canvas.width = width * dpr
      canvas.height = height * dpr
      context.scale(dpr, dpr)
      //绘制背景
      context.fillStyle = '#fff'
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.fillRect(0, 0, canvas.width, canvas.height)
    })
    const id = options.id;
    const todoid = options.todo;
    console.log({todoid});
    this.setData({
      id:id,
      todoid:todoid,
    });
  },
  canvasIdErrorCallback: function (e) {},
  //开始
  canvasStart: function (event) {
    context.moveTo(event.touches[0].x, event.touches[0].y);
  },
  //过程
  canvasMove: function (event) {
    var x = event.touches[0].x;
    var y = event.touches[0].y;
    context.lineWidth = 4
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.lineTo(x, y);
    context.stroke();
    this.setData({
      hasDraw: true,
    });
  },
  canvasEnd: function (event) {
 
  },
  clickClear: function () {
    context.clearRect(0, 0, mCanvas.width, mCanvas.height); //清除画布
    context.beginPath() //清空画笔
    this.setData({
      hasDraw: false,
    });
  },
  //保存签名
  clickSave: function () {
    let that = this
    console.log(this.data.id);
    const recordid = this.data.id;
    if (!this.data.hasDraw) {
      wx.showModal({
        title: '提示',
        content: '签名内容不能为空！',
        showCancel: false
      });
      return false;
    };
    //生成图片
    wx.canvasToTempFilePath({
      canvas: mCanvas,
      success: function (res) {
          // 获取临时文件路径
          const tempFilePath = res.tempFilePath;
          // 使用 wx.getFileSystemManager().readFile 方法读取临时文件并转换为 base64 编码
          wx.getFileSystemManager().readFile({
              filePath: tempFilePath,
              encoding: 'base64', // 指定编码格式为 base64
              success: function (result) {
                  console.log('base64编码：', result.data);
                  base = result.data;
                  that.setData({
                    sign:result.data,
                  })
                  // post("/maintain/record/update",{ id:recordid,enp_sign:result.data}).then((res) => {
                  //   console.log({res});
                  // }).catch(error => { 
                  //   this.showErrorToast(error);
                  // });  
                },
              fail: function (error) {
                  console.error('读取临时文件失败：', error);
              }
          });
      },
      fail: function (error) {
          console.error('error：', error);
      }
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