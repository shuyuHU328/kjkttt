// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

/**
 * 获得User/Group/Task的模板对象
 * @param {*} event 需要1个参数: className (可选值: user/group/task)
 * @returns result即为所需的模板类
 */
exports.main = async (event, context) => {
    var User = {
        userId: "0", //用户Id: openid
        userInfo: null, //用户信息: UserInfo()类 (参见https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/UserInfo.html)
        taskIdList: [], //用户所拥有的任务列表: [string (taskId)]
        groupIdList: [], //用户所在的群组列表: [string (groupId)]
        name: "南土豆", //姓名: string
        studentNumber: "100000000", //学号: string
        style: 0, //风格序号: number

        //提醒设置部分
        remind: {
            isDDLRemindActive: false, //是否开启"临近DDL提醒"功能: boolean
            DDLRemindTimeOptions: [], //临近DDL提醒时间 选项: []
            DDLRemindTimeIndex: 0, //临近DDL提醒时间索引: number
            DDLRemindFrequencyOptions: [], //临近DDL提醒频率 选项: []
            DDLRemindFrequencyIndex: 0, //临近DDL提醒频率索引: number
            isFixedTimeRemindActive: false, //是否开启"固定时间点提醒"功能: boolean
            FixedTimeRemindTime: "00:00", //固定提醒时间: string ("HH:MM")
            isDNDModeActive: false, //是否开启"勿扰模式": boolean
            DNDModeStartTime: "00:00", //勿扰模式开始时间: string ("HH:MM")
            DNDModeEndTime: "08:00", //勿扰模式结束时间: string ("HH:MM")
            DNDModeRepetitionOptions: [] //勿扰模式重复 选项: []
        },
        //统计部分
        counter: {
            ptaskCounter: 0, //个人任务完成数: number
            gtaskCounter: 0, //群组任务完成数: number
            undoneTaskCounter: 0 //未完成任务数: number
        }
    }
    //群组
    var Group = {
        name: "", //群组名称: string
        memberList: [{ //成员列表
            memberId: "", //用户id: string (userId)
            taskIdList: [], //用户在该群组内的任务列表: [string (taskId)]
        }],
        noticeIdList: [], //公告id列表: string (taskId)
        administratorId: "", //管理员id: string (userId)
    }
    /* 实际存储
    var Group = {
        name: "", //群组名称: string
        memberList: [{ //成员列表
            memberId: "", //用户id: string (userId)
            member: {}, //用户数据: User()类
            taskIdList: [], //用户在该群组内的任务列表: [string (taskId)]
            taskList: [] //用户任务列表数据: [Task()类]
        }],
        noticeIdList: [], //公告id列表: string (taskId)
        noticeList: [], //公告数据列表: Task()类
        administratorId: "", //管理员id: string (userId)
        administrator: {} //管理员数据: User() 类
        //注意！！！为了避免无限套娃，用户数据与管理员数据请不要全部存进来
        //按需存储，比如对于group, 只需name, studentNumber
    }
    */
    //任务
    var Task = {
        type: "", //类型: string (公告:"notice" 个人任务:"ptask" 群组任务:"gtask")
        title: "", //标题: string
        content: "", //详情: string
        userFrom: "", //来自的用户: string (userId)
        groupFrom: "0", //来自的群组: string (groupId)   若为ptask类型此项值为0
        DDL: "", //DDL: Date()类 "yyyy-mm-ss hh:mm:ss"
        isFinished: false, //是否完成/收到: boolean
        priority: 0 //优先级: number (普通:0 紧急:1)
    }

    var myObject = null
    switch (event.className) {
        case "user":
            myObject = User
            break
        case "group":
            myObject = Group
            break
        case "task":
            myObject = Task
            break
    }

    return myObject
}