var now = new Date();
var now_year = now.getFullYear();
var now_month = now.getMonth() + 1;
var now_date = now.getDate();
var now_time = now.getTime();
var now_hour = now.getHours().toString();
var now_minute = now.getMinutes().toString();
var now_time_set = now_hour.padStart(2, '0') + ':' + now_minute.padStart(2, '0');

Page({
    data: {
        isSearching: false,
        isAddNewGroupTapped: false,
        user: true,
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
        popDeleteControl: false,
        groupList: [
            {
                name: '样例组名1',
                selected: true,
                noticeList: [
                    { noticeTitle: '公告一' },
                    { noticeTitle: '公告二' },
                    { noticeTitle: '公告三' },
                    { noticeTitle: '公告四' },
                    { noticeTitle: '公告五' },
                    { noticeTitle: '公告六' },
                    { noticeTitle: '公告七' }
                ]
            },
            {
                name: '样例组名2',
                selected: true,
                noticeList: [
                    { noticeTitle: '公告一' },
                    { noticeTitle: '公告二' }
                ]
            },
            {
                name: '样例组名3',
                selected: true,
                noticeList: [
                    { noticeTitle: '公告一' },
                    { noticeTitle: '公告二' }
                ]
            },
            {
                name: '样例组名4',
                selected: true,
                noticeList: [
                    { noticeTitle: '公告一' },
                    { noticeTitle: '公告二' }
                ]
            },
            {
                name: '样例组名5',
                selected: true,
                noticeList: [
                    { noticeTitle: '公告一' },
                    { noticeTitle: '公告二' }
                ]
            }
        ],
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


    /**
    * input字符串操作
    */
    inputTitle: function (e) {
        this.setData({
            task: e.detail.value
        })
    },
    inputArea: function (e) {
        this.setData({
            detailed: e.detail.value
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

    /**
     * 导航到公告管理界面 
     */
    gotoGroupArrange() {
        wx.navigateTo({
            url: '/pages/groupArrange/groupArrange'
        })
    },
    /**
     * 
     * 导航到任务界面
     */
    gotoAssignmentArrange() {
        this.setData({
            noticeAdd: true
        })
    },
    /**
     * 
     * 导航到成员列表 
     */
    gotoMemberArrage() {
        wx.navigateTo({
            url: '/pages/groups-memberArrange/groups-memberArrange',
        })
    },
    /**
     * 
     * 查看公告 
     */
    gotoNotice() {
        this.setData({
            noticeSelected: true
        })
    },
    //关闭公告
    closeNotice(e) {
        this.setData({
            noticeSelected: false
        }),
            console.log(e)
    }
})