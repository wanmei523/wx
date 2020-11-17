//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    username:'',
    content:'',
    msgs:[],
    height:0,
  },
  //获取留言集合
  getMsgs:function(){
    wx.request({
      url: 'http://gbook.com/api/v1/msgs',
      header:{
        'Accept': 'application/json'
        },
      method:'GET',
      success: (data)=>{
        this.setData({
          msgs:data.data
        }),
        console.log(data.data)
      }
    })
  },
  //动态高度获取
  onShow:function(e){
    let h = wx.getSystemInfoSync().windowHeight
    let write = wx.createSelectorQuery().select('#write').boundingClientRect()
    write.exec(res=>{
      console.log(h-res[0].height)
      this.setData({
        height:h-res[0].height
      })
    })
  },
  more:function(){
    //console.log(this.data.msgs.meta)
    let current_page = this.data.msgs.meta.current_page
    let last_page = this.data.msgs.meta.last_page
    if(current_page<last_page){
      wx.request({
        url: 'http://gbook.com/api/v1/msgs',
        data:{page:current_page+1},
        header:{
          'Accept': 'application/json'
          },
        method:'GET',
        success: (data)=>{
          data.data.data = this.data.msgs.data.concat(data.data.data)
          this.setData({
            msgs:data.data
          })
        }
      })
    }else{
      wx.showToast({
        title: '无更多数据',
        icon: 'none'
      })
    }
  },
  onLoad: function () {
    this.getMsgs()
  },
  saveGbook:function(e){
    wx.request({
      url: 'http://gbook.com/api/v1/msgs',
      data: e.detail.value,
      header:{
        'Accept': 'application/json' // 默认值
        },
      method:'POST',
      success: (data)=>{
        if(data.statusCode==200){
          this.setData({
            username:'',
            content:''
          }),
          this.getMsgs(),
          wx.showToast({
            title: '发表成功',
          })
        }else{
          wx.showToast({
            title: '发表失败',
            icon: 'none'
          })
        }
      }
    })
  },
})
