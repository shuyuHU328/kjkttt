Page({
    data: {
        user: {
            userInfo: null
        },
        colorList: ["#EEDD82", "#87CEFA"],
        style: 0,
        isStyleSelectorPopup: false,
        styleOptions: [
            { value: "0", name: "土豆黄", checked: true },
            { value: "1", name: "晴天蓝", checked: false }
        ],
        isWelcomeShown: false
    },
    onLoad() {
        this.setData({
            user: {
                userInfo: wx.getStorageSync('userInfo')
            }
        })
    },
    onShow() {
        this.setData({
            isStyleSelectorPopup: false
        })
        if (this.data.user.userInfo === null) {
            console.log("user === null")
            this.setData({
                isWelcomeShown: true
            })
        }
    },
    userLogin() {
        wx.getUserProfile({
            desc: '完善个人信息',
            success: (res) => {
                wx.setStorageSync('userInfo', res.userInfo)
                this.setData({
                    user: {
                        userInfo: res.userInfo
                    },
                    isWelcomeShown: false
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
                        user: {
                            userInfo: null
                        }
                    })
                    wx.setStorageSync('userInfo', null)
                    this.onShow()
                }
            }
        })
    },
    goRemind() {
        wx.navigateTo({
            url: '/pages/settings-remind/settings-remind',
        })
    },
    goStyleSelector() {
        this.setData({
            isStyleSelectorPopup: true
        })
    },
    styleSelectorChange(e) {
        const items = this.data.styleOptions
        for (let i = 0, len = items.length; i < len; ++i) {
            items[i].checked = items[i].value === e.detail.value
            if (items[i].value === e.detail.value) {
                this.setData({
                    style: i
                })
                wx.setNavigationBarColor({
                    backgroundColor: this.data.colorList[this.data.style],
                    frontColor: "#000000"
                })
                wx.setTabBarStyle({
                    backgroundColor: this.data.colorList[this.data.style]
                })
            }
        }

        this.setData({
            styleOptions: items
        })
    }
})