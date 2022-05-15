//用户
var User = {
    userId: "", //用户id: string (openid等)
    userInfo: null, //用户信息: UserInfo()类 (参见https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/UserInfo.html)
    taskList: [ //用户所拥有的任务列表: [Task()类]
        null
    ],
    groupList: [ //用户所在的群组列表: [string (groupId)]
        ""
    ],
    name: "", //姓名: string
    studentNumber: "", //学号: string
    remindSettings: null, //提醒设置: Remind()类
    style: 0 //风格序号: number
}

//群组
var Group = {
    groupId: "", //群组id: string
    memberList: [{ //成员列表
        member: null, //用户: User()类
        taskList: [ //用户在该群组内的任务列表: [Task()类]
            null
        ],
        isAdministrator: false //是否为管理员: boolean
    }],
    administratorList: [ //管理员列表: string (userId)
        ""
    ]
}

//任务
var Task = {
    type: "", //类型: string (公告-"notice" 个人任务-"ptask" 群组任务-"gtask")
    title: "", //标题: string
    content: "", //详情: string
    from: "", //来自哪一个个人/群组: string (userId/groupId)
    DDL: null, //DDL: Date()类
    isFinished: false, //是否完成/收到: boolean
    priority: 0, //优先级: number (普通-0 紧急-1)
}

//提醒设置 (我负责的，你们可以不看。因微信小程序订阅消息限制，下述部分功能可能无法实现)
var Remind = {
    isDDLRemindActive: false, //是否开启"临近DDL提醒"功能: boolean
    DDLRemindTimeOptions: [], //临近DDL提醒时间 选项: []
    DDLRemindTimeIndex: 0, //临近DDL提醒时间索引: number
    DDLRemindFrequencyOptions: [], //临近DDL提醒频率 选项: []
    DDLRemindFrequencyIndex: 0, //临近DDL提醒频率索引: number
    isFixedTimeRemindActive: false, //是否开启"固定时间点提醒"功能: boolean
    FixedTimeRemindTime: "00:00", //固定提醒时间: string ("HH:MM")
    isDNDModeActive: false, //是否开启"勿扰模式": boolean
    DNDModeStartTime: "00:00", //勿扰模式开始时间: string ("HH:MM")
    DNDModeEndTime: "00:00", //勿扰模式结束时间: string ("HH:MM")
    DNDModeRepetitionOptions: [] //勿扰模式重复 选项: []
}