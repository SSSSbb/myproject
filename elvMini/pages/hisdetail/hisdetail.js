// pages/hisdetail/hisdetail.js
const { get } = require("../../api/api");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    enable: false,
    loadingProps: {
      size: '50rpx',
    },
    scrollTop: 0,
    list: [], 
    safer:[],
    cur:{},
    item:[],
    belongto:'',
    profile:[],
    eid:'',
    id:'',
    parts:[],
    parts_beforelist:[],
    parts_afterlist:[],
    parts_before:0,
    parts_after:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  ready() {
    this.setData({ enable: true });
    setTimeout(() => {
      this.setData({ enable: false });
    }, 1000);
  },
  onRefresh() {
    this.setData({ enable: true });
    this.onLoad();
    setTimeout(() => {
      this.setData({ enable: false });
    }, 1500);
  },
  onScroll(e) {
    const { scrollTop } = e.detail;
    this.setData({ scrollTop });
  },
  onLoad(options) {
    const { user } = app.globalData;
    const { belongto } = user;
    const id = options.id;
    this.setData({id:id,belongto:belongto})
    get("/maintain/record/index",{belongto,id}).then(({ data: { list } }) => {
      console.log({list});
      this.setData({ list });
    }).catch(error => { 
      this.showErrorToast(error);
    });
    const saferUsername =options.safer;
    console.log({saferUsername});
    if(saferUsername){
      get("/rbac/user/index",{belongto,username: saferUsername}).then(({ data: { list } }) => {
        this.setData({ safer:list });
      }).catch(error => { 
        this.showErrorToast(error);
      }); 
    }
    const eid = options.eid;
    this.setData({eid:eid});
    console.log(this.data.id);
    console.log(this.data.eid);
    get("/profile/index",{belongto,id: eid}).then(({ data: { list } }) => {
      console.log({list});
      this.setData({ profile:list });
    }).catch(error => { 
      this.showErrorToast(error);
    }); 
    const partsRecord = options.parts_record;
    console.log({partsRecord});
    get("/parts/record/index",{belongto,record_id: id}).then(({ data: { list } }) => {
      console.log({list});
            this.setData({ parts:list });
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
navigateToAddPartsPage() {
  console.log(this.data.id);
    wx.navigateTo({
      url: '/pages/addParts/addParts?id='+this.data.id+"&which="+this.data.eid 
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