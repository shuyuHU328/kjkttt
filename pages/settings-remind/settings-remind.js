// pages/settings-remind/settings-remind.js
Page({
    data: {
        isDDLRemindActive: false,
        DDLRemindTimeOptions: ["12小时", "1天", "3天", "1周"],
        DDLRemindTimeIndex: 1,
        DDLRemindFrequencyOptions: ["每3小时", "每12小时", "每天", "每2天"],
        DDLRemindFrequencyIndex: 0,
        isFixedTimeRemindActive: false,
        FixedTimeRemindTime: "18:00",
        isDNDModeActive: false,
        DNDModeStartTime: "00:00",
        DNDModeEndTime: "08:00",
        isDNDModeRepetitionPopup: false,
        DNDModeRepetitionOptions: [
            { value: "0", name: "周日", checked: false },
            { value: "1", name: "周一", checked: false },
            { value: "2", name: "周二", checked: false },
            { value: "3", name: "周三", checked: false },
            { value: "4", name: "周四", checked: false },
            { value: "5", name: "周五", checked: false },
            { value: "6", name: "周六", checked: false }
        ]
    },

    switchDDLRemindTime(e) { //开启/关闭临近DDL提醒
        this.setData({
            isDDLRemindActive: e.detail.checked
        })
    },
    setDDLRemindTime(e) { //设置临近DDL提醒时间
        this.setData({
            DDLRemindTimeIndex: e.detail.value
        })
    },
    setDDLRemindFrequency(e) { //设置临近DDL提醒频率
        this.setData({
            DDLRemindFrequencyIndex: e.detail.value
        })
    },


    switchFixedTimeRemind(e) { //开启/关闭固定时间点提醒
        this.setData({
            isFixedTimeRemindActive: e.detail.checked
        })
    },
    setFixedTimeRemindTime(e) { //设置固定提醒时间
        this.setData({
            FixedTimeRemindTime: e.detail.value
        })
    },


    switchDNDMode(e) { //开启/关闭勿扰模式
        this.setData({
            isDNDModeActive: e.detail.checked
        })
    },
    setDNDModeStartTime(e) { //设置勿扰模式开启时间
        this.setData({
            DNDModeStartTime: e.detail.value
        })
    },
    setDNDModeEndTime(e) { //设置勿扰模式结束时间
        this.setData({
            DNDModeEndTime: e.detail.value
        })
    },
    tapDNDModeRepetition() { //监听点击“勿扰模式-重复”事件
        if (this.data.isDNDModeRepetitionPopup)
            this.setData({
                isDNDModeRepetitionPopup: false
            })
        this.setData({
            isDNDModeRepetitionPopup: true
        })
    },
    setDNDModeRepetition(e) { //设置勿扰模式重复
        const options = this.data.DNDModeRepetitionOptions
        const values = e.detail.value
        // console.log(values)
        for (let i = 0, lenI = options.length; i < lenI; i++) {
            options[i].checked = false
            for (let j = 0, lenJ = values.length; j < lenJ; j++) {
                if (options[i].value === values[j]) {
                    options[i].checked = true
                    break
                }
            }
        }
        this.setData({
            DNDModeRepetitionOptions: options
        })
    }
})