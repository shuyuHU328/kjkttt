// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

/**
 * 向数据库中指定的集合内删除数据
 * @param {*} event 需要2个参数: collectionName, id
 *      collectionName: 指定的集合名称(可选值: Users/Groups/Tasks)
 *      id: 准备删除的数据的_id字段
 * @param {*} context 
 */
exports.main = async (event, context) => {
    return await db.collection(event.collectionName).doc(event.id).remove()
}