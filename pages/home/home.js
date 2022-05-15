// pages/wxml/home.js
//胶囊栏操作

//对于时间获取的操作
var now = new Date();
var now_year = now.getFullYear();
var now_month = now.getMonth() + 1;
var now_date = now.getDate();
var now_time = now.getTime();
var now_hour = now.getHours().toString();
var now_minute = now.getMinutes().toString();
var now_time_set = now_hour.padStart(2, '0') + ':' + now_minute.padStart(2, '0');
//popUp页面控制
Page(
    {
        /**
         * 页面的初始数据
         */
        data: {
            pop_control: false,
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
                pop_control: controler,
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
        /**
         * 
         * 任务变紧急
         */
        toUrgent: function () {

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
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {

        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function () {

        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function () {

        },

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
    }
)
