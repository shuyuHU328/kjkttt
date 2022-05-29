wx.cloud.init();
var now = new Date();
var now_year = now.getFullYear();
var now_month = now.getMonth() + 1;
var now_date = now.getDate();
var now_time = now.getTime();
var now_hour = now.getHours().toString();
var now_minute = now.getMinutes().toString();
var now_time_set = now_hour.padStart(2, '0') + ':' + now_minute.padStart(2, '0');
const db = wx.cloud.database();

var User = null
// var Groups = []

Page({
    data: {
        //云函数数据
        openId: "",
        isSearching: false,
        isAddNewGroupTapped: false,
        user: User,
        newGroupName: "",
        newGroupContent: "",
        groups: [],
        newNoticeName: '',
        newNoticeContent: '',
        currentGroup: '',
        //选择的公告信息
        noticeSelectedTitle: '',
        noticeSelectedContent: '',
        noticeSelectedFrom: '',
        noticeSelectedId: '',
        noticeSelected: false,
        noticeSelectedTime: '',
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
    //实现User与this.data.user的同步, 每当User更改后都会调用该方法
    async syncUser() {
        this.setData({
            user: User
        })
        // wx.setStorageSync('User', User) //实现本地同步
        await this.updateUser(User._id, User) //实现云端同步
    },
    //获取openid(微信自带的云函数)
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
    //获取模板对象
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
            obj = resp.result
            wx.hideLoading()
        }).catch((e) => {
            console.log(e)
            wx.hideLoading()
        });
        return obj
    },
    //根据openId拉取用户数据
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
    //更新用户数据
    async updateUser(id, data) {
        wx.showLoading({
            title: '',
        })
        console.log('before update: ', User)
        await wx.cloud.callFunction({
            name: 'updateData',
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
    //添加群组数据
    async addGroup(data) {
        return await wx.cloud.callFunction({
            name: 'addData',
            data: {
                collectionName: 'Groups',
                data
            }
        })
    },
    /*
    async getGroup(id) {
        let data = null
        wx.showLoading({
            title: '',
        })
        await wx.cloud.callFunction({
            name: 'getData',
            data: {
                collectionName: 'Groups',
                id
            }
        }).then(res => {
            console.log(res)
            if (Array.isArray(res.result.data))
                data = res.result.data[0]
            else
                data = res.result.data
            wx.hideLoading()
        })
            .catch(e => {
                console.log(e)
                wx.hideLoading()
            })
        return data
    },
    */
    //获取群组
    async getGroup() {
        var tmpGroup = []
        for (var i = 0; i < User.groupIdList.length; i++) {
            var grp = null
            grp = await this.getData(User.groupIdList[i], 'Groups')
            tmpGroup.push(grp)
        }
        console.log('User grouplll', tmpGroup)

        for (var l = 0; l < tmpGroup.length; l++) {
            tmpGroup[l].noticeList = []
            for (var i = 0; i < tmpGroup[l].noticeIdList.length; i++) {
                var tempNotice = await this.getData(tmpGroup[l].noticeIdList[i], 'Tasks')
                tmpGroup[l].noticeList.push(tempNotice)
            }
            for (var i = 0; i < tmpGroup[l].memberList.length; i++) {
                tmpGroup[l].memberList[i].member = this.getData(tmpGroup[l].memberList[i].memberId, 'Users')
            }
        }
        this.setData({
            groups: tmpGroup
        })
        console.log('groups==', this.data.groups)
    },
    //添加任务数据
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
    async onLoad() {
        wx.cloud.init()
        console.log('这里是onLoad')
    },
    async onShow() {
        if (this.data.openId === "") {
            await this.getOpenId()
        }
        console.log('openid=', this.data.openId)
        User = await this.getUser(this.data.openId)
        this.setData({ user: User })
        console.log('onShow User==', User)
        /*
        Groups = []
        for (var i = 0, len = User.groupIdList.length; i < len; i++) {
            await this.getGroup(User.groupIdList[i]).then(res => {
                console.log('onShow getGroup', res)
                Groups.push(res)
            }).catch(e => {
                console.log(e)
            })
        }
        */
        await this.getGroup()
    },
    inputSearchText(e) { //监听搜索框输入文本
        this.setData({
            isSearching: true
        })
        var searchText = e.detail.value
        console.log(searchText)
    },
    cancelSearch() { //点击了搜索框“取消”按钮
        this.setData({
            isSearching: false
        })
    },
    tapAddNewGroup() { //点击 “创建群组”
        this.setData({
            isAddNewGroupTapped: true
        })
    },
    cancelAddNewGroup() { //取消 "创建群组"
        this.setData({
            isAddNewGroupTapped: false
        })
    },
    inputNewGroupTitle(e) { //监听 “创建群组” 名称输入
        this.setData({
            newGroupName: e.detail.value
        })
    },
    inputNewGroupArea(e) { //监听 “创建群组” 详情输入
        this.setData({
            newGroupContent: e.detail.value
        })
    },
    async addNewGroup(e) {
        var newGroup = await this.getMyObjects('group')
        newGroup.name = this.data.newGroupName
        newGroup.administratorId = this.data.openId
        newGroup.memberList[0].memberId = this.data.openId
        // var basicNotice = await this.getMyObjects('task')
        // basicNotice.type = "notice"
        // basicNotice.title = "本群简介"
        // basicNotice.content = this.data.newGroupContent
        // basicNotice.userFrom = this.data.openId
        // basicNotice.groupFrom = newGroup.name
        // let basicNoticeId = await this.addTask(basicNotice)
        // User.taskIdList.push(basicNoticeId)
        // newGroup.noticeIdList.push(basicNoticeId)
        console.log('newGroup=', newGroup)
        wx.showLoading({
            title: '',
        })
        await this.addGroup(newGroup)
            .then(async res => {
                var Groups = this.data.groups
                console.log('addGroup返回', res)
                newGroup._id = res.result._id
                newGroup.noticeList = []
                User.groupIdList.push(newGroup._id)
                await this.syncUser()
                Groups.push(newGroup)
                // wx.setStorageSync('Groups', Groups)
                this.setData({
                    isAddNewGroupTapped: false,
                    groups: Groups,
                    currentGroup: newGroup,
                    newNoticeName: '本群简介',
                    newNoticeContent: this.data.newGroupContent
                })
                await this.addNotice()
                wx.hideLoading()
                wx.showToast({
                    title: '添加成功',
                    icon: 'success'
                })
                this.setData({ isAddNewGroupTapped: false })
            })
            .catch(res => {
                console.log(res)
                wx.hideLoading()
                wx.showToast({
                    title: '添加失败，请重新提交',
                    icon: 'error'
                })
            })
    },

    //添加公告
    async addNotice() {//点击提交按钮
        var newNotice = await this.getMyObjects('task')
        newNotice.type = "notice"
        newNotice.title = this.data.newNoticeName
        newNotice.content = this.data.newNoticeContent
        newNotice.userFrom = this.data.openId
        newNotice.groupFrom = this.data.currentGroup.name
        newNotice.DDL = this.data.year + '-' + this.data.month + '-' + this.data.date + ' ' + this.data.time;
        var basicNoticeId = await this.addTask(newNotice)
        var tempCurrent = this.data.currentGroup
        tempCurrent.noticeIdList.push(basicNoticeId)
        newNotice = await this.getData(basicNoticeId, 'Tasks')
        tempCurrent.noticeList.push(newNotice)
        this.setData({
            noticeAdd: false,
            currentGroup: tempCurrent
        })
        var tempgroups = this.data.groups
        for (var i = 0; i < this.data.groups.length; i++) {
            if (tempgroups[i]._id == this.data.currentGroup._id) {
                tempgroups[i] = this.data.currentGroup
                this.setData({
                    groups: tempgroups
                })
                break;
            }
        }
        var tem = this.data.currentGroup
        delete tem.noticeList
        await this.updateGroup(this.data.currentGroup._id, tem)
        for (var i = 0; i < this.data.currentGroup.memberList.length; i++) {
            var us = await this.getUser(this.data.currentGroup.memberList[i].memberId)
            us.taskIdList.push(basicNoticeId)
            await this.updateUser(us._id, us)
        }
    },
    //删除公告
    async removeNotice(e) {
        var id = e.currentTarget.dataset.id

        await wx.cloud.callFunction({
            name: 'removeData',
            data: {
                collectionName: 'Tasks',
                id
            }
        }).then((resp) => {
            console.log('删除公告成功')
        }).catch((e) => {
            console.log(e)
            wx.hideLoading()
        });
        console.log(this.data.currentGroup)
        var tempCurrent = this.data.currentGroup
        for (var i = 0; i < tempCurrent.noticeIdList.length; i++) {
            if (tempCurrent.noticeIdList[i] == id) {
                if (tempCurrent.hasOwnProperty('noticeList'))
                    tempCurrent.noticeList.splice(i, 1);
                tempCurrent.noticeIdList.splice(i, 1);
                break
            }
        }
        this.setData({
            noticeSelected: false,
            currentGroup: tempCurrent
        })
        console.log('删除后', this.data.currentGroup)
        var tem = await this.getMyObjects('group');
        var tem1 = this.data.currentGroup
        tem.name = tem1.name
        tem.memberList = tem1.memberList
        tem.noticeIdList = tem1.noticeIdList
        tem.administratorId = tem1.administratorId
        await this.updateGroup(this.data.currentGroup._id, tem)
        var tempgroups = this.data.groups
        for (var i = 0; i < this.data.groups.length; i++) {
            if (tempgroups[i].name == this.data.currentGroup.name) {
                tempgroups[i] = this.data.currentGroup
                this.setData({
                    groups: tempgroups
                })
                break;
            }
        }
        for (var i = 0; i < this.data.currentGroup.memberList.length; i++) {
            var us = await this.getUser(this.data.currentGroup.memberList[i].memberId)
            for (var j = 0; j < us.taskIdList.length; j++) {
                if (us.taskIdList[j] == id) {
                    us.taskIdList.splice(j, 1)
                }
            }
            await this.updateUser(us._id, us)
        }

    },

    //input字符串操作
    inputNoticeTitle: function (e) {
        console.log(e.detail.value)
        this.setData({
            newNoticeName: e.detail.value
        })
    },
    inputNoticeArea: function (e) {
        this.setData({
            newNoticeContent: e.detail.value
        })
    },
    tapAddNewGroup() { //点击 “创建群组”
        this.setData({
            isAddNewGroupTapped: true
        })
    },
    cancelAddNewGroup() { //取消 "创建群组"
        this.setData({
            isAddNewGroupTapped: false
        })
    },
    inputArea: function (e) { //监听群组详情内容
        console.log("群组详情：", e);
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



    //日历操作
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
    //监听时间picker
    bindTimeChange: function (e) {
        this.setData({
            time: e.detail.value
        })
    },
    //监听优先级picker
    bindPriChange: function (e) {
        this.setData({
            priority_index: e.detail.value
        })
    },

    //结束任务图标
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

    //导航到公告管理界面 
    gotoGroupArrange() {
        wx.navigateTo({
            url: '/pages/groupArrange/groupArrange'
        })
    },
    //导航到任务界面
    gotoAssignmentArrange(e) {
        console.log("a", e.currentTarget.dataset)
        var tempGroup = e.currentTarget.dataset.currentgroup
        this.setData({
            noticeAdd: true,
            currentGroup: tempGroup
        })
        console.log(this.data.currentGroup)
    },
    //导航到成员列表
    gotoMemberArrage(e) {
        wx.navigateTo({
            url: '/pages/groups-memberArrange/groups-memberArrange?_id=' +
                e.currentTarget.dataset.group._id,
        })
    },
    //查看公告 
    async gotoNotice(e) {
        var tempGroup = e.currentTarget.dataset.currentgroup
        var tempId = e.currentTarget.dataset.noticecontent.userFrom
        var userName = await this.getUser(tempId)
        this.setData({
            currentGroup: tempGroup,
            noticeSelected: true,
            noticeSelectedTitle: e.currentTarget.dataset.noticecontent.title,
            noticeSelectedContent: e.currentTarget.dataset.noticecontent.content,
            noticeSelectedFrom: userName.name,
            noticeSelectedId: e.currentTarget.dataset.noticecontent._id,
            noticeSelectedTime: e.currentTarget.dataset.noticecontent.DDL
        })
    },
    //关闭公告
    closeNotice(e) {
        this.setData({
            noticeSelected: false
        })
    },
    //解散群组
    async deleteGroup(e) {
        wx.showModal({
            title: '是否确定解散？',
        }).then(async res => {
            if (res.confirm) {
                console.log()
                var delG = e.currentTarget.dataset.group
                this.setData({
                    currentgroup: delG
                })
                for (var i = 0; i < delG.noticeIdList.length; i++) {
                    var ee = {
                        currentTarget: {
                            dataset: {
                                id: delG.noticeIdList[i]
                            }
                        }
                    }
                    this.removeNotice(ee)
                }
                console.log('delG.id == ', delG._id)
                for (var i = 0; i < delG.memberList.length; i++) {
                    var temM = await this.getUser(delG.memberList[i].memberId)
                    for (var j = 0; j < temM.groupIdList.length; j++) {
                        if (temM.groupIdList[j] == delG._id) {
                            console.log('123243123423')
                            temM.groupIdList.splice(j, 1)
                            console.log('grpidlist == ', temM.groupIdList)
                            await this.updateUser(temM._id, temM)
                            break;
                        }
                    }
                }
                var teGs = this.data.groups
                for (var i = 0; i < teGs.length; i++) {
                    if (teGs[i]._id == delG._id) {
                        teGs.splice(i, 1)
                        break
                    }
                }
                this.setData({
                    groups: teGs
                })
                var id = delG._id
                await wx.cloud.callFunction({
                    name: 'removeData',
                    data: {
                        collectionName: 'Groups',
                        id
                    }
                }).then((resp) => {
                    console.log('删除群组成功')
                }).catch((e) => {
                    console.log(e)
                    wx.hideLoading()
                });
            }
        }).catch(e => {
            console.log(e)
        })
    },

})