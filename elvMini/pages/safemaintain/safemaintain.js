// pages/safemaintain/safemaintain.js
const { get } = require("../../api/api");
const { post } = require("../../api/api");

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordid:'',
    maintainrecord:[],
    maintainer:'',
    maintainerlist:[],
    which:'',
    visible:'',
    profile:[],
    item:[],
    belongto:'',
    parts:[],
    cur:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
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
    const { user } = app.globalData;
    const { belongto } = user;
    const id = options.id;
    const which = options.which;
    const safer = options.safer;
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