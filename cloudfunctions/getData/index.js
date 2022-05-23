// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

/**
 * 向数据库中指定的集合内拉取数据
 * @param {*} event 需要2个参数: collectionName, id
 *      collectionName: 指定的集合名称(可选值: Users/Groups/Tasks)
 *      data: 准备拉取的数据的_id字段 (若拉取user对象则是openid)
 * @param {*} context 
 * @returns result.data 所拉取的数据
 */
exports.main = async (event, context) => {
    var data = null
    if (event.collectionName != "Users") {
        await db.collection(event.collectionName).doc(event.id)
            .get().then(res => {
                data = res.data
            })
    } else {
        await db.collection(event.collectionName).where({
            userId: event.id
        }).get().then(res => {
            data = res.data
        })
    }
    return {
        data
    }
}