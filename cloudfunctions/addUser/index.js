// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const db = wx.cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    console.log("已调用云函数addnewuser")
    const wxContext = cloud.getWXContext()
    let user = event.user
    user.userId = wxContext.OPENID
    await db.collection('Users').add({
        data: {
            price: 1
        }
    })
        .then(res => {
            console.log(res)
        })

    return {
        event,
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,
    }
}