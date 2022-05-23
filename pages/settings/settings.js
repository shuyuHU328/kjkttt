var User = null

Page({
    data: {
        user: User,
        colorList: ["#EEDD82", "#87CEFA"],
        isModifyPersonalInfoPopup: false,
        isStyleSelectorPopup: false,
        styleOptions: [
            { value: "0", name: "土豆黄", checked: true },
            { value: "1", name: "晴天蓝", checked: false }
        ],
        isWelcomeShown: false,
        envId: '',
        openId: ''
    },
    async syncUser() {
        this.setData({
            user: User
        })
        wx.setStorageSync('User', User)
        await this.updateUser()
    },
    async getOpenId() {
        wx.showLoading({
            title: '',
        });
        await wx.cloud.callFunction({
            name: 'getOpenId',
            config: {
                env: this.data.envId
            },
        }).then((resp) => {
            this.setData({
                openId: resp.result.openid
            });
            wx.hideLoading()
        }).catch((e) => {
            console.log(e)
            wx.hideLoading();
        });
    },
    async getMyObjects(className) {
        var obj = null;
        wx.showLoading({
            title: '',
        })
        await wx.cloud.callFunction({
            name: 'getMyObjects',
            config: {
                env: this.data.envId
            },
            data: {
                className //可支持的值: user, group, task
            }
        }).then((resp) => {
            console.log("testGetMyObjects 运行成功")
            obj = resp.result
            wx.hideLoading()
        }).catch((e) => {
            console.log(e)
            wx.hideLoading()
        });
        return obj
    },
    async addUser() {
        wx.showLoading({
            title: '',
        })
        await wx.cloud.callFunction({
            name: 'addData',
            config: {
                env: this.data.envId
            },
            data: {
                collectionName: 'Users',
                data: User
            }
        }).then((resp) => {
            console.log("testAddUser 运行成功")
            User._id = resp.result.id
            this.syncUser()
            wx.hideLoading()
        }).catch((e) => {
            console.log(e)
            wx.hideLoading()
        });
    },
    async getUser(openId) {
        let data = null
        wx.showLoading({
            title: '',
        })
        await wx.cloud.callFunction({
            name: 'getData',
            config: {
                env: this.data.envId
            },
            data: {
                collectionName: 'Users',
                id: openId
            }
        }).then(res => {
            console.log(res)
            data = res.result.data[0]
            wx.hideLoading()
        })
            .catch(e => {
                console.log(e)
                wx.hideLoading()
            })
        console.log("in getUser, data = ", data)
        return data
    },
    async updateUser() {
        wx.showLoading({
            title: '',
        })
        console.log('before update: ', User)
        await wx.cloud.callFunction({
            name: 'updateData',
            config: {
                env: this.data.envId
            },
            data: {
                collectionName: 'Users',
                id: User._id,
                data: User
            }
        }).then(res => {
            console.log('更新成功')
            wx.hideLoading()
        })
            .catch(e => {
                console.log(e)
                wx.hideLoading()
            })
    },
    async onLoad(options) {
        wx.cloud.init()
        console.log('这里是onload')
        this.setData({
            envId: options.envId
        })
        await this.getOpenId()
    },
    async onShow() {
        console.log('这里是onshow')
        // this.setData({
        //     isStyleSelectorPopup: false
        // })
        User = wx.getStorageSync('User') != "" ? wx.getStorageSync('User') : null //从本地缓存拉取用户数据
        if (User == null) {
            console.log('从云端拉取')
            User = await this.getUser(this.data.openId) //从云端拉取用户数据
            wx.setStorageSync('User', User)
        }
        if (User == null) { //本地&云端均无数据，
            console.log('新建用户')
            this.setData({
                isWelcomeShown: true
            })
            User = await this.getMyObjects('user')
            User.userId = this.data.openId
            await this.addUser()
        }
        this.setData({
            user: User
        })
    },
    userLogin() {
        wx.getUserProfile({
            desc: '完善个人信息',
            success: (res) => {
                User.userInfo = res.userInfo
                this.syncUser()
                this.setData({
                    isWelcomeShown: false
                })
            },
            fail: (res) => {
                console.log("登录失败", res)
            }
        })
    },
    userLogout() {
        wx.showModal({
            title: "确认退出？",
            success: res => {
                if (res.confirm) {
                    User.userInfo = null
                    this.syncUser()
                    this.setData({
                        isWelcomeShown: true
                    })
                }
            }
        })
    },
    goRemind() {
        wx.navigateTo({
            url: '/pages/settings-remind/settings-remind',
        })
    },
    goModifyPersonalInfo() {
        this.setData({
            isModifyPersonalInfoPopup: true
        })
    },
    cancelModifyPersonalInfo() {
        this.setData({
            isModifyPersonalInfoPopup: false
        })
    },
    inputName(e) {
        User.name = e.detail.value
    },
    inputStudentNumber(e) {
        User.studentNumber = e.detail.value
    },
    modifyPersonalInfo() {
        this.syncUser()
        this.setData({
            isModifyPersonalInfoPopup: false
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
                User.style = i
                this.syncUser()
                wx.setNavigationBarColor({
                    backgroundColor: this.data.colorList[this.data.user.style],
                    frontColor: "#000000"
                })
                wx.setTabBarStyle({
                    backgroundColor: this.data.colorList[this.data.user.style]
                })
            }
        }

        this.setData({
            styleOptions: items
        })
    },
    goHelp() {
        wx.navigateTo({
            url: '/pages/settings-help/settings-help',
        })
    },
    goAbout() {
        wx.navigateTo({
            url: '/pages/settings-about/settings-about',
        })
    }
})