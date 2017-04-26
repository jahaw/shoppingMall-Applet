const productUtil = require('../../utils/product.js')
var app = getApp()

Page({
  data: {
    items: [],
    slides: [],
    navs: [{icon: "../../images/icon-new-list1.png", name: "资产", typeId: 0},
           {icon: "../../images/icon-new-list2.png", name: "直销", typeId: 1},
           {icon: "../../images/icon-new-list3.png", name: "甄选", typeId: 2},
           {icon: "../../images/icon-new-list4.png", name: "管到", typeId: 3}],

    popularity_products: [],
    new_products: [],
    hot_products: [],
    promotions: []
  },

  onShareAppMessage: function () {
    return {
      title: "巴爷供销社",
      desc: "商城首页",
      path: `pages/index/index`
    }
  },

  bindShowProduct: function (e) {
    wx.navigateTo({
      url: `../show_product/show_product?id=${e.currentTarget.dataset.id}`
    })
  },

  catchTapCategory: function (e) {
    var data = e.currentTarget.dataset
    app.globalData.currentCateType = {typeName: data.type, typeId: data.typeid}
    wx.switchTab({
      url: `../category/category`
    })
  },

  onPullDownRefresh: function() {
    this.getSlidesFromServer()
    this.getProductsFromServer()
    wx.stopPullDownRefresh()
  },

  onLoad: function() {
    var that = this
// 从本地缓存中异步获取。
    wx.getStorage({
      key: 'products',
      success: function(res){
        var data = res.data
        // console.log(data);
        that.setData({
          items: data,
          popularity_products: data.filter(product => (product.flag === '最热' && product['promotion-url'])),
          new_products:        data.filter(product => (product.flag === '新品' && product['promotion-url'])),
          hot_products:        data.filter(product => (product.flag === '火爆' && product['promotion-url'])),
        })
      },
      fail: function() {},
      complete: function() {}
    })
// 从本地缓存中获取轮图相关数据
    wx.getStorage({
      key: 'indexSlides',
      success: function(res){
        that.setData({'slides': res.data})
      },
      fail: function() {},
      complete: function() {}
    })
  },
// 监听页面初次渲染完成
  onReady: function() {
    this.getProductsFromServer()
    this.getSlidesFromServer()
  },

  getSlidesFromServer: function() {
    var that = this
    productUtil.getSlides(function(result) {
      var data = app.store.sync(result.data)
      that.setData({'slides': data})
      wx.setStorage({
        key:'indexSlides',
        data:data
      })
    })
  },

  getProductsFromServer: function() {
    var that = this
    productUtil.getProducts(function(result) {
      /**result.data:获得的商品信息 */
      var data = app.store.sync(result.data)
      that.setData({
        items: data,
        popularity_products: data.filter(product => (product.flag === '最热' && product['promotion-url'])),
        new_products:        data.filter(product => (product.flag === '新品' && product['promotion-url'])),
        hot_products:        data.filter(product => (product.flag === '火爆' && product['promotion-url'])),
      })
      // 将数据存储在本地缓存中指定的 key 中
      wx.setStorage({
        key:'products',
        data:data
      })
    })
  }
})
