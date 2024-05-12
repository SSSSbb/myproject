// pages/safemaintain/safemaintain.js
const { get } = require("../../api/api");
const { post } = require("../../api/api");
var context = null; // 使用 wx.createContext 获取绘图上下文 context
var mCanvas = null;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordid:'',
    hasDraw: false, //默认没有画
    maintainrecord:[],
    maintainer:'',
    maintainerlist:[],
    which:'',
    visible:'',
    profile:[],
    item:[],
    id:'',
    safer:'',
    belongto:'',
    parts:[],
    cur:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onSubmit(){
    console.log(this.data.id);
    const recorid = this.data.id;
    const username = this.data.safer;
    const todoid = this.data.todoid;
     post("/maintain/record/update",{ id:recorid,safer:username}).then((res) => {
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
  handlePopup(e) {
    const { item } = e.currentTarget.dataset;
    console.log({ item });
    get("/parts/partsprofile/index", { belongto: this.data.belongto, id: item.part_id })
      .then(({ data: { list } }) => {
        console.log({ list });
        // 合并查询结果到cur对象
        const curWithList = { ...item, beforelist: list };
        console.log({curWithList});
        if(item.action=="replace"){
          console.log(item.replace_part);
          get("/parts/partsprofile/index",{belongto:this.data.belongto,id:item.replace_part}).then(({ data: { list } }) => {
            const afterlist = {...curWithList,afterlist:list};
            console.log({curWithList});
            this.setData(
              { cur: afterlist },
              () => {
                this.setData({ visible: true });
              }
            );
          }).catch(error => { 
            this.showErrorToast(error);
          }); 
                }
        // 设置cur和visible
        this.setData(
          { cur: curWithList },
          () => {
            this.setData({ visible: true });
          }
        );
      })
      .catch((error) => {
        this.showErrorToast(error);
      });
  },
  onVisibleChange(e) {
    this.setData({
      visible: e.detail.visible,
    });
  },
  onClose() {
    this.setData({
      visible: false,
    });
  },
  onLoad(options) {
    this.setData({
      hasDraw: false,
    })
    const { user } = app.globalData;
    const { belongto } = user;
    const id = options.id;
    const todoid = options.todoid;
    this.setData({id});
    const which = options.which;
    const safer = options.safer;
    this.setData({
      safer:safer,
      id:id,
      todoid:todoid,
    })
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
    this.setData({
      belongto:belongto,
      recordid:id,
      which:which,
    })
    get("/profile/index",{id: which}).then(({ data: { list } }) => {
      console.log({list});
      this.setData({ profile:list });
    }).catch(error => { 
      this.showErrorToast(error);
    }); 
    get("/parts/record/index",{belongto,record_id: id}).then(({ data: { list } }) => {
      console.log({list});
            this.setData({ parts:list });
    }).catch(error => { 
      this.showErrorToast(error);
    });
    get("/maintain/record/index",{ id:
      id}).then((res) => {
      console.log({res});
      this.setData({
        maintainrecord:res.data.list,
        maintainer:res.data.list[0].maintainer,
      })
      get("/rbac/user/index",{ username:
        this.data.maintainer}).then((res) => {
        console.log({res});
        this.setData({
          maintainerlist:res.data.list,
        })
      }).catch(error => { 
        this.showErrorToast(error);
      });
    }).catch(error => { 
      this.showErrorToast(error);
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
        const tempFilePath = res.tempFilePath;
          wx.getFileSystemManager().readFile({
            filePath: tempFilePath,
            encoding: 'base64', // 指定编码格式为 base64
            success: function (result) {
                console.log('base64编码：', result.data);
                console.log({recordid});
post("/maintain/record/update",{ id:recordid,safe_sign:result.data}).then((res) => {
    console.log({res});
  }).catch(error => { 
    this.showErrorToast(error);
  });              },
            fail: function (error) {
                console.error('读取临时文件失败：', error);
            }
        });
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