// pages/returned/returned.js
const { post } = require("../../api/api");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recorid:'',
    username:'',
    todoid:'',
    style: 'border: 2rpx solid var(--td-input-border-color-example);border-radius: 12rpx;',
    inputContent:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { user } = app.globalData;
    console.log({options});
    const recordid = options.recordid;
    const username = user.username;
    const todoid = options.todoid;
    this.setData({recordid,username,todoid});
  },
  onInput: function (event) {
    const inputValue = event.detail.value; // 获取用户输入的内容
    console.log('用户输入的具体操作内容:', inputValue);
    this.setData({
      inputContent: inputValue
    });
  },
  onSubmit(){
    const {recordid,username,todoid,inputContent} = this.data;
    console.log({recordid});
    console.log({username});
    console.log({todoid});
    console.log({inputContent});
        post("/maintain/record/update",{ id:recordid,safer:username,returned:2,reason:inputContent}).then((res) => {
      console.log({res});
      post("/todo/update",{ id:todoid,status:1,record:recordid}).then((res) => {
        console.log({res});
        wx.showToast({
          title: '退回成功',
          icon: 'success',
          duration: 4000,
          success: function() {
            // 用户点击确定后跳转到某个页面
            wx.switchTab({
              url: '/pages/home/home'  // 替换为你要跳转的页面路径
            });
          }
        });
      });
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