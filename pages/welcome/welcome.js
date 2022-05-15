Page({
    data: {
        userInfo: null
    },
    onLoad() {
        wx.showTabBar()
        this.setData({
            userInfo: wx.getStorageSync('userInfo')
        })
    },
    userLogin() {
        wx.getUserProfile({
            desc: '完善个人信息',
            success: (res) => {
                wx.setStorageSync('userInfo', res.userInfo)
                this.setData({
                    userInfo: res.userInfo
                })
            },
            fail: (res) => {
                console.log("失败", res)
            }
        })
    },
    userLogout() {
        wx.showModal({
            title: "确认退出？",
            success: res => {
                if (res.confirm) {
                    this.setData({
                        userInfo: null
                    })
                    wx.setStorageSync('userInfo', null)
                }
            }
        })
    }
})
