var User = null

Page({
    data: {
        user: null,
        colorList: ["#EEDD82", "#87CEFA"],
        selectedColorList: ["#FFA500", "#00BFFF"],
        isModifyPersonalInfoPopup: false,
        isStyleSelectorPopup: false,
        styleOptions: [
            { value: "0", name: "土豆黄", checked: true },
            { value: "1", name: "晴天蓝", checked: false }
        ],
        isWelcomeShown: false,
        openId: ''
    },
    async syncUser() {
        this.setData({
            user: User
        })
        // wx.setStorageSync('User', User)
        await this.updateUser()
    },
    async getOpenId() {
        wx.showLoading({
            title: '',
        });
        await wx.cloud.callFunction({
            name: 'getOpenId'
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
            data: {
                collectionName: 'Users',
                data: User
            }
        }).then((resp) => {
            console.log("testAddUser 运行成功 resp=", resp)
            User._id = resp.result._id
            this.setData({ user: User })
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
            data: {
                collectionName: 'Users',
                id: openId
            }
        }).then(res => {
            console.log('getUser ==', res)
            data = res.result.data[0]
            wx.hideLoading()
        })
            .catch(e => {
                console.log(e)
                wx.hideLoading()
            })
        return data
    },
    async updateUser() {
        wx.showLoading({
            title: '',
        })
        console.log('before update: ', User)
        await wx.cloud.callFunction({
            name: 'updateData',
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
    async onLoad() {
        wx.cloud.init()
    },
    async onShow() {
        console.log('这里是onShow')
        if (this.data.openId == '')
            await this.getOpenId()
        console.log('openid = ', this.data.openId)
        // console.log('这里是onshow')
        await this.getUser(this.data.openId).then(res => {
            console.log('onShow getUser res=', res)
            User = res
            this.setData({
                user: res
            })
        }).catch(e => {
            console.log(e)
        })
        console.log('User ====', User)
        // User = wx.getStorageSync('User') != "" ? wx.getStorageSync('User') : null //从本地缓存拉取用户数据

        console.log('从云端拉取')
        User = await this.getUser(this.data.openId) //从云端拉取用户数据
        // wx.setStorageSync('User', User)
        if (User == null) { //云端无数据，
            console.log('新建用户')
            User = await this.getMyObjects('user')
            User.userId = this.data.openId
            await this.addUser()
        }
        if (User.userInfo == null) {
            this.setData({
                isWelcomeShown: true
            })
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
        // wx.showModal({
        //     title: '还在开发中，敬请期待~',
        // })
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
    goCounter() {
        wx.navigateTo({
            url: '/pages/settings-counter/settings-counter',
        })
    },
    /*
    goStyleSelector() {
        wx.showModal({
            title: '还在开发中，敬请期待~',
        })
        // this.setData({
        //     isStyleSelectorPopup: true
        // })
    },
    styleSelectorChange(e) {
        const items = this.data.styleOptions
        for (let i = 0, len = items.length; i < len; ++i) {
            items[i].checked = items[i].value === e.detail.value
            if (items[i].value === e.detail.value) {
                User.style = i
                this.syncUser()
                wx.setNavigationBarColor({
                    backgroundColor: this.data.colorList[User.style],
                    frontColor: "#000000"
                })
                wx.setTabBarStyle({
                    backgroundColor: this.data.colorList[User.style],
                    selectedColor: this.data.selectedColorList[User.style],
                    // color: this.data.selectedColorList[User.style]
                })
            }
        }

        this.setData({
            styleOptions: items
        })
    },
    */
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