// pages/assignmentArrange/assignmentArrange.js

var now = new Date();
var now_year = now.getFullYear();
var now_month = now.getMonth() + 1;
var now_date = now.getDate();
var now_time = now.getTime();
var now_hour = now.getHours().toString();
var now_minute = now.getMinutes().toString();
var now_time_set = now_hour.padStart(2, '0') + ':' + now_minute.padStart(2, '0');
var User = null

Page({

    /**
     * 页面的初始数据
     */
    data: {
        //传过来的参数
        memberId: '',
        group_id: '',
        group: '',
        member: '',
        openId: '',
        tasks: [],
        isAdmin: false,
        //上传任务数据
        taskTitle: '',
        taskContent: '',

        user: null,
        noticeSelected: false,
        noticeAdd: false,
        show_cal: false,
        //基本数据
        task: '',
        detailed: '',
        year: now_year,
        month: now_month,
        date: now_date,
        time: now_time_set,
        //以下为优先级数组 
        priority_index: 0,
        state: ['普通', '紧急'],
        priority: ['low', 'high'],
        //任务的优先级信息与是否是群组任务
        isUrgent: [1, 0],
        isPersonalWork: false,
        popFinishControl: false,
        popChangeTimeControl: false,
        popDeleteControl: false

    },
    //添加任务
    async addTask(data) {
        let id = ""
        wx.showLoading({
            title: '',
        })
        await wx.cloud.callFunction({
            name: 'addData',
            data: {
                collectionName: 'Tasks',
                data
            }
        }).then((resp) => {
            id = resp.result._id //注意：模版对象是不包含_id字段的，需要自己添加
            wx.hideLoading()
        }).catch((e) => {
            console.log(e)
            wx.hideLoading()
        });
        return id
    },
    //添加个人任务
    async addMemberTask() {
        var newTask = await this.getMyObjects('task')
        newTask.type = 'gtask'
        newTask.title = this.data.taskTitle
        newTask.content = this.data.taskContent
        newTask.userFrom = this.data.openId
        newTask.groupFrom = this.data.group.name
        newTask.DDL = this.data.year + '-' + this.data.month + '-' + this.data.date + ' ' + this.data.time;
        var basicTaskId = await this.addTask(newTask)
        var tempCurrent = this.data.group
        for (var i = 0; i < tempCurrent.memberList.length; i++) {
            if (tempCurrent.memberList[i].memberId == this.data.memberId) {
                console.log('taaskid', i, basicTaskId)
                tempCurrent.memberList[i].taskIdList.push(basicTaskId)
                break;
            }
        }
        var temem = this.data.member
        var temT = this.data.tasks
        var temt = await this.getData(basicTaskId, 'Tasks')
        temT.push(temt)
        temem.taskIdList.push(basicTaskId)
        console.log('ttt', temem)
        this.setData({
            group: tempCurrent,
            member: temem,
            tasks: temT,
            noticeAdd: false
        })
        console.log('ccc', tempCurrent)
        await this.updateGroup(this.data.group._id, tempCurrent)
        await this.updateUser(temem._id, temem)
        this.setData({
            group: tempCurrent
        })
    },
    //删除任务
    async deleteTask(e) {
        wx.showModal({
            title: '是否确定删除？',
        }).then(async res => {
            if (res.confirm) {
                var delId = e.currentTarget.dataset.taskid
                var temG = this.data.group
                var temM = this.data.member
                var temT = this.data.tasks
                for (var i = 0; i < temG.memberList.length; i++) {
                    if (temG.memberList[i].memberId == temM.userId) {
                        for (var j = 0; j < temG.memberList[i].taskIdList.length; j++) {
                            if (temG.memberList[i].taskIdList[j] == delId) {
                                temG.memberList[i].taskIdList.splice(j, 1)
                            }
                        }
                    }
                }
                for (var i = 0; i < temM.taskIdList.length; i++) {
                    if (temM.taskIdList[i] == delId) {
                        temM.taskIdList.splice(i, 1)
                    }
                }
                for (var i = 0; i < temT.length; i++) {
                    if (temT[i]._id == delId) {
                        temT.splice(i, 1)
                    }
                }
                this.setData({
                    tasks: temT,
                    group: temG,
                    member: temM
                })
                await this.updateGroup(this.data.group._id, temG)
                console.log(temM)
                await this.updateUser(temM._id, temM)
            }
        }).catch(e => {
            console.log(e)
        })
    },
    async getMyObjects(className) {
        var obj = null;
        wx.showLoading({
            title: '',
        })
        await wx.cloud.callFunction({
            name: 'getMyObjects',
            // config: {
            //     env: this.data.envId
            // },
            data: {
                className //可支持的值: user, group, task
            }
        }).then((resp) => {
            obj = resp.result
            wx.hideLoading()
        }).catch((e) => {
            console.log(e)
            wx.hideLoading()
        });
        return obj
    },
    //更新用户
    async updateUser(id, data) {
        wx.showLoading({
            title: '',
        })
        await wx.cloud.callFunction({
            name: 'updateData',
            // config: {
            //     env: this.data.envId
            // },
            data: {
                collectionName: 'Users',
                id,
                data
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
    //更新群组
    async updateGroup(id, data) {
        wx.showLoading({
            title: '',
        })
        await wx.cloud.callFunction({
            name: 'updateData',
            data: {
                collectionName: 'Groups',
                id,
                data
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
    //popUp页重置数据
    popUp: function (e) {
        //再次获取时间并渲染
        var controler = false;
        var now_time = new Date();
        var now_hour = now_time.getHours().toString();
        var now_minute = now_time.getMinutes().toString();
        var now_time_set = now_hour.padStart(2, '0') + ':' + now_minute.padStart(2, '0');
        if (this.data.pop_control == false) {
            controler = true;
        } else {
            controler = false;
        }
        this.setData({
            //回调数据
            show_cal: false,
            task: '',
            detailed: '',
            year: now_year,
            month: now_month,
            date: now_date,
            time: now_time_set,
            noticeAdd: controler,
            priority_index: 0,
        })
    },

    async getOpenId() {
        wx.showLoading({
            title: '',
        });
        await wx.cloud.callFunction({
            name: 'getOpenId',
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


    /**
    * input字符串操作
    */
    inputTitle: function (e) {
        this.setData({
            taskTitle: e.detail.value
        })
    },
    inputArea: function (e) {
        this.setData({
            taskContent: e.detail.value
        })
    },
    /**
     * 日历操作
     */
    showCalendar: function (e) {
        this.setData({
            show_cal: true
        })
    },
    upDate: function (event) {
        //获取更改后的时间
        var time = new Date(event.detail);
        var change_year = time.getFullYear();
        var change_month = time.getMonth() + 1;
        var change_date = time.getDate();
        this.setData({
            year: change_year,
            month: change_month,
            date: change_date
        })
    },
    /**
     * 监听时间picker
     */
    bindTimeChange: function (e) {
        this.setData({
            time: e.detail.value
        })
    },
    /**
     * 监听优先级picker
     */
    bindPriChange: function (e) {
        this.setData({
            priority_index: e.detail.value
        })
    },

    /*
    结束任务图标
    **/
    popUpFinish: function () {
        var controler = false;
        if (this.data.popFinishControl == false) {
            controler = true;
        } else {
            controler = false;
        }
        this.setData({
            popFinishControl: controler
        })
    },
    popUpChange: function () {
        //再次获取时间并渲染
        var controler = false;
        var now_time = new Date();
        var now_hour = now_time.getHours().toString();
        var now_minute = now_time.getMinutes().toString();
        var now_time_set = now_hour.padStart(2, '0') + ':' + now_minute.padStart(2, '0');
        if (this.data.popChangeTimeControl == false) {
            controler = true;
        } else {
            controler = false;
        }
        this.setData({
            //回调数据
            show_cal: false,
            task: '',
            detailed: '',
            year: now_year,
            month: now_month,
            date: now_date,
            time: now_time_set,
            popChangeTimeControl: controler,
            priority_index: 0,
        })
    },
    popUpDelete: function () {
        var controler = false;
        if (this.data.popDeleteControl == false) {
            controler = true;
        } else {
            controler = false;
        }
        this.setData({
            popDeleteControl: controler,
        })
    },

    gotoAssignmentArrange() {
        this.setData({
            noticeAdd: true
        })
    },


    async getUser(openId) {
        let data = null
        wx.showLoading({
            title: '',
        })
        await wx.cloud.callFunction({
            name: 'getData',
            // config: {
            //     env: this.data.envId
            // },
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
        return data
    },
    //获取数据
    async getData(id, collectionName) {
        let data = null
        wx.showLoading({
            title: '',
        })
        await wx.cloud.callFunction({
            name: 'getData',
            // config: {
            //     env: this.data.envId
            // },
            data: {
                collectionName,
                id
            }
        }).then(res => {
            console.log('拉取成功', res)
            if (res.result.data instanceof Array) {
                data = res.result.data[0]
            }
            else {
                data = res.result.data
            }
            wx.hideLoading()
        })
            .catch(e => {
                console.log('拉取失败', id, collectionName)
                console.log(e)
                wx.hideLoading()
            })
        return data
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onLoad: function (options) {
        console.log('传过来的', options)
        this.setData({
            memberId: options.userId,
            group_id: options.group_id,
        })
    },
    async onShow() {
        if (this.data.openId == '') {
            await this.getOpenId()
        }
        var tempM = await this.getUser(this.data.memberId)
        var tempG = await this.getData(this.data.group_id, 'Groups')

        var temT = this.data.tasks
        for (var i = 0; i < tempG.memberList.length; i++) {
            if (tempG.memberList[i].memberId == tempM.userId) {
                for (var j = 0; j < tempG.memberList[i].taskIdList.length; j++) {
                    var temt = await this.getData(tempG.memberList[i].taskIdList[j], 'Tasks')
                    temT.push(temt)
                }
                break
            }

        }
        this.setData({
            group: tempG,
            member: tempM,
            tasks: temT
        })
        console.log('M', tempM)
        console.log('G', tempG)
        var usId = await this.get
        if (this.data.group.administratorId == this.data.openId) {
            this.setData({
                isAdmin: true
            })
        }

    },
    /**
      * 生命周期函数--监听页面加载
      */

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})