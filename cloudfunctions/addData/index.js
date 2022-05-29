// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

/**
 * 向数据库中指定的集合内添加数据
 * @param {*} event 需要2个参数: collectionName, data
 *      collectionName: 指定的集合名称(可选值: Users/Groups/Tasks)
 *      data: 准备添加的单条数据(即本地的User/Group/Task对象)
 * @param {*} context 
 * @returns result._id 包含新生成的_id字段
 */
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    return await db.collection(event.collectionName).add({
        data: event.data
    })
}