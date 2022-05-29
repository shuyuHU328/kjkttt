var User;
Page(
    {
        /**
         * 页面的初始数据
         */
        data: {
            timeId:0,
            openId: "",
            taskIdList: [],
            taskList:[],
            pop_control: false,
            showCalendar: false,
            //基本数据
            task: '',
            DDL:null,
            detailed: '',
            year: null,
            month: null,
            date: null,
            time: null,
            //以下为优先级数组 
            priority_index: 0,
            state: ['普通', '紧急'],
            priority: ['low', 'high'],
            //任务的优先级信息与是否是群组任务
            popChangeTimeControl: false,
            personal:"个人"
        },
        //popUp页重置数据
        async popUp(e) {
            //再次获取时间并渲染
            var controler = false;
            var nowTime = new Date();
            var now_hour = nowTime.getHours().toString();
            var now_minute = nowTime.getMinutes().toString();
            var now_time_set = now_hour.padStart(2, '0') + ':' + now_minute.padStart(2, '0');
            if (this.data.pop_control == false) {
                controler = true;
            } else {
                controler = false;
            }
            this.setData({
                //回调数据
                showCalendar: false,
                task: '',
                detailed: '',
                year: nowTime.getFullYear(),
                month: nowTime.getMonth() + 1,
                date: nowTime.getDate(),
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
                showCalendar: true
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
        async bindTimeChange(e) {
            await this.setData({
                time: e.detail.value
            })
        },
        
        /**
         * 监听优先级picker
         */
        async bindPriChange(e) {
            await this.setData({
                priority_index: e.detail.value
            })
        },
        //更新用户数据
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
                obj = resp.result
                wx.hideLoading()
            }).catch((e) => {
                console.log(e)
                wx.hideLoading()
            });
            return obj
        },


        //添加任务
        async addTask() {
            var nowTask = await this.getMyObjects('task');
            nowTask.DDL = this.data.year + '-' + this.data.month + '-' + this.data.date + ' ' + this.data.time;
            nowTask.title = this.data.task;
            nowTask.content = this.data.detailed;
            nowTask.from = this.data.openId;
            nowTask.priority = this.data.priority_index;
            nowTask.type = 'ptask';
            nowTask.userFrom = this.data.openId;
            wx.showLoading({
                title: '',
            })
            await wx.cloud.callFunction({
                name: 'addData',
                data: {
                    collectionName: 'Tasks',
                    data: nowTask
                }
            }).then(async (resp) => {
                console.log("testAddUser 运行成功 resp=", resp)
                nowTask._id = resp.result._id
                User=await this.getUser(this.data.openId)
                User.taskIdList.push(nowTask._id);
                await this.updateUser();        
                await this.onShow()
                this.popUp(this.e)
            }).catch((e) => {
                console.log(e)
                wx.hideLoading()
            });
        },
        analyzeDDL: function(){
            var aDDL=new Date(this.data.DDL)
            var now=new Date()
            var difference=aDDL.valueOf()-now.valueOf()
            console.log("findme"+difference)
            if(difference<=0){
                return "dashboard_body_overdue"
            }else if(difference<86400000){
                return "dashboard_body_urgent"
            }else{
                return "dashboard_body"
            }
        },
        popUpChange: function (event) {
            //再次获取时间并渲染
            var controler = false;
            console.log(this.data.timeId)
            var taskList=this.data.taskList;
            var nowTime = new Date(taskList[this.data.timeId].DDL);
            console.log(nowTime);
            var now_hour = nowTime.getHours().toString();
            var now_minute = nowTime.getMinutes().toString();
            var now_time_set = now_hour.padStart(2, '0') + ':' + now_minute.padStart(2, '0');
            if (this.data.popChangeTimeControl == false) {
                controler = true;
            } else {
                controler = false;
            }
            this.setData({
                //回调数据
                showCalendar: false,
                task: '',
                detailed: '',
                year: nowTime.getFullYear(),
                month: nowTime.getMonth() + 1,
                date: nowTime.getDate(),
                time: now_time_set,
                popChangeTimeControl: controler,
                priority_index: 0,
                timeId:event.currentTarget.dataset.idx
            })
        },
        shutDownChange:function(){
            var controler;
            if (this.data.popChangeTimeControl == false) {
                controler = true;
            } else {
                controler = false;
            }this.setData({
                //回调数据
                popChangeTimeControl: controler
            })
        },
        //改时间
        async changeCalendar(event){    
            var taskList=this.data.taskList;
            taskList[this.data.timeId].DDL=this.data.year+'-'+this.data.month+'-'+this.data.date+' '+this.data.time;
            await this.updateTask(taskList[this.data.timeId]);
            await this.onShow()
            this.shutDownChange()
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


        /**
         * 生命周期函数--监听页面加载
         */
        async onLoad(options) {
            wx.cloud.init()
        },

        //获取模板对象
        async getTask(id) {
            var obj = null;
            wx.showLoading({
                title: '',
            })
            await wx.cloud.callFunction({
                name: 'getData',
                data: {
                    collectionName: 'Tasks',
                    id //可支持的值: user, group, task
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
        /**
         * 生命周期函数--监听页面显示
         */
        async onShow() {
            if (this.data.openId == "") {
                await this.getOpenId()
            }
            User = await this.getUser(this.data.openId) //从云端拉取用户数据
            this.data.taskIdList=User.taskIdList
            var List=[]
            for (let index = 0; index < this.data.taskIdList.length; index++) {
                const element = (await this.getTask(this.data.taskIdList[index])).data;
                if(element.isFinished==true){
                    continue;
                }else{
                    this.setData({
                        DDL:element.DDL
                    })
                    element.class=this.analyzeDDL()
                    List.push(element)
                }
            }
            await this.updateUser();
            this.setData({
                taskList:List
            })
                },
//更新Task
    async updateTask(task) {
        wx.showLoading({
            title: '',
        })
        await wx.cloud.callFunction({
            name: 'updateData',
            config: {
                env: this.data.envId
            },
            data: {
                collectionName: 'Tasks',
                id: task._id,
                data: task
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

    //完成任务
        async Finish(event){
            var taskList=this.data.taskList;
            for(var i = 0; i < taskList.length; i++){
                if(i==event.currentTarget.dataset.idx){
                    var aDDL=new Date(this.data.DDL)
                    var now=new Date()
                    var difference=aDDL.valueOf()-now.valueOf()
                    if(difference>0){
                        if (taskList[i].type=="ptask") {
                            User.counter.ptaskCounter+=1;
                        }else if (taskList[i].type=="gtask") {
                            User.counter.gtaskCounter+=1;
                        } 
                    }else{
                        User.counter.undoneTaskCounter+=1;
                    }
                    taskList[i].isFinished=true;
                    await this.updateTask(taskList[i]);
                    User.taskIdList.splice(i,1);
                    break;
                }
            }
            //User.taskIdList.remove(event.currentTarget.dataset.idx)
            await this.updateUser();  
            // wx.clearStorage()
            // wx.clearStorageSync()              
            await this.onShow()
        },
        async Delete(event){
            var taskList=this.data.taskList;
            for(var i = 0; i < taskList.length; i++){
                if(i==event.currentTarget.dataset.idx){
                    var aDDL=new Date(this.data.DDL)
                    var now=new Date()
                    var difference=aDDL.valueOf()-now.valueOf()
                    if(difference<=0){
                        User.counter.undoneTaskCounter+=1;
                    }
                    await this.updateTask(taskList[i]);
                    User.taskIdList.splice(i,1);
                    break;
                }
            }
            //User.taskIdList.remove(event.currentTarget.dataset.idx)
            await this.updateUser();            
            await this.onShow()
        },
        //完成notice
        async FinishNotice(event){
            var taskList=this.data.taskList;
            for(var i = 0; i < taskList.length; i++){
                if(i==event.currentTarget.dataset.idx){
                    // await this.updateTask(taskList[i]);
                    User.taskIdList.splice(i,1);
                    break;
                }
            }
            // //User.taskIdList.remove(event.currentTarget.dataset.idx)            
            // wx.clearStorage()
            // wx.clearStorageSync()    
            await this.updateUser();            
            await this.onShow()
        },
        //改变紧急情况
        async toUrgent(event){
            var taskList=this.data.taskList;
            for(var i = 0; i < taskList.length; i++){
                if(i==event.currentTarget.dataset.idx){
                    taskList[i].priority=taskList[i].priority==1?0:1;
                    await this.updateTask(taskList[i]);
                    break;
                }
            }        
            await this.onShow()
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
