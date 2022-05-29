var User = null
Page({

    /**
     * 页面的初始数据
     */
    data: {
        counter: {
            ptaskCounter: 0,
            gtaskCounter: 0,
            undoneTaskCounter: 0
        },
        openId: ""
    },
    async getOpenId() {
        wx.showLoading({
            title: '',
        });
        await wx.cloud.callFunction({
            name: 'getOpenId'
        }).then((resp) => {
            console.log('获取成功', resp)
            this.setData({
                openId: resp.result.openid
            });
            wx.hideLoading()
        }).catch((e) => {
            console.log(e)
            wx.hideLoading();
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
        if (this.data.openId == '') {
            await this.getOpenId()
        }
        User = await this.getUser(this.data.openId)
        this.setData({ counter: User.counter })
        console.log('user == ', User)
    },
    resetCounter() {
        wx.showModal({
            title: '是否确定清零？'
        }).then(async res => {
            if (res.confirm) {
                User.counter = {
                    ptaskCounter: 0,
                    gtaskCounter: 0,
                    undoneTaskCounter: 0
                }
                this.setData({ counter: User.counter })
                await this.updateUser()
            }
        }).catch(e => {
            console.log('清零失败', e)
        })
    }

})