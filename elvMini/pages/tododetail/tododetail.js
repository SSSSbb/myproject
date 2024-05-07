// pages/tododetail/tododetail.js
const { get } = require("../../api/api");
const { post } = require("../../api/api");

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAuth: false,
    src: '',
    todoid:'',
    belongto:0,
    username:'',
    which:0,
    canvasWidth: 300, // 默认宽度
    canvasHeight: 500 // 默认高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      const {id,which} = options;
      const { user } = app.globalData;
    const { belongto, username } = user;
    this.setData({
      todoid:id,
      belongto:belongto,
      which:which,
      username:username,
    })
    const _this = this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.camera']) {
          // 用户已经授权
          _this.setData({
            isAuth: true
          })
        } else {
          // 用户还没有授权，向用户发起授权请求
          wx.authorize({
            scope: 'scope.camera',
            success() { // 用户同意授权
              _this.setData({
                isAuth: true
              })
            },
            fail() { // 用户不同意授权
              _this.openSetting().then(res => {
                _this.setData({
                  isAuth: true
                })
              })
            }
          })
        }
      },
      fail: res => {
        console.log('获取用户授权信息失败')
      }
    })
  },
  openSetting() {
    const _this = this;
    let promise = new Promise((resolve, reject) => {
      wx.showModal({
        title: '授权',
        content: '请先授权获取摄像头权限',
        success(res) {
          if (res.confirm) {
            wx.openSetting({
              success(res) {
                if (res.authSetting['scope.camera']) { // 用户打开了授权开关
                  resolve(true)
                } else { // 用户没有打开授权开关， 继续打开设置页面
                  _this.openSetting().then(res => {
                    resolve(true)
                  })
                }
              },
              fail(res) {
                console.log(res)
              }
            })
          } else if (res.cancel) {
            _this.openSetting().then(res => {
              resolve(true)
            })
          }
        }
      })
    })
    return promise;
  },
  takePhoto() { 
    const _this = this;
    const { belongto, username ,which,todoid} = _this.data;
    console.log({todoid});
    function getCurrentTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const second = now.getSeconds();
      return `${year}年${month}月${day}日 ${hour}:${minute}:${second}`;
  }
    wx.chooseImage({
      count: 1, 
      quality: 'high', 
      sizeType: ['compressed'],
      sourceType: ['camera'], 
      success: function (res) {       
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success: function (res) {
            const ctx = wx.createCanvasContext('imgCanvas');
            ctx.drawImage(res.path, 0, 0, 300, 500); 
            ctx.setFontSize(12) 
            ctx.setFillStyle('#ffffff');
            ctx.fillText(getCurrentTime(), 160, 240);
            ctx.draw(false, function () {
              setTimeout(function () {
                wx.canvasToTempFilePath({
                  quality: 1,
                  fileType: 'jpg',
                  canvasId: 'imgCanvas',
                  success: function (res) {
                    wx.hideLoading();
                    wx.getFileSystemManager().readFile({
                      filePath: res.tempFilePath,
                      encoding: 'base64',
                      success: function (res) {
                        console.log('data:image/jpeg;base64,' + res.data);
                        post("/maintain/record/create",{ pic: res.data ,belongto:belongto,maintainer:username,eid:which}).then((res) => {
                          console.log({res});
                          wx.navigateTo({
                            url: '/pages/maintain/maintain?id=' + res.data +'&eid='+ which+"&todo="+todoid
                          });
                        }).catch(error => { 
                          this.showErrorToast(error);
                        });
                      }
                    });
                  }
                })
              }, 600)
            })
          }
        })
      }
    })
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