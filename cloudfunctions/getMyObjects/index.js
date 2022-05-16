// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

    var User = {
        userId: "", //用户id: string (openid等)
        userInfo: null, //用户信息: UserInfo()类 (参见https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/UserInfo.html)
        taskList: [ //用户所拥有的任务列表: [string (taskId)]
            ""
        ],
        groupList: [ //用户所在的群组列表: [string (groupId)]
            ""
        ],
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
        }
    }

    //群组
    var Group = {
        groupId: "", //群组id: string
        memberList: [{ //成员列表
            member: "", //用户: string (userId)
            taskList: [ //用户在该群组内的任务列表: [string (taskId)]
                ""
            ],
            isAdministrator: false //是否为管理员: boolean
        }],
        administratorList: [ //管理员列表: [string (userId)]
            ""
        ]
    }

    //任务
    var Task = {
        taskId: "", //任务id: string
        type: "", //类型: string (公告:"notice" 个人任务:"ptask" 群组任务:"gtask")
        title: "", //标题: string
        content: "", //详情: string
        userFrom: "", //来自的用户: string (userId)
        //来自的群组: string (groupId)
        //若为ptask类型此项值为0
        groupFrom: "0",
        DDL: null, //DDL: Date()类
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