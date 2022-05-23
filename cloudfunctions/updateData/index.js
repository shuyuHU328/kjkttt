// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

/**
 * 向数据库中指定的集合内更新数据(该方法为整体替换，若想局部替换请自行调用数据库)
 * @param {*} event 需要2个参数: collectionName, id, data
 *      collectionName: 指定的集合名称(可选值: Users/Groups/Tasks)
 *      id: 准备更新的数据的_id
 *      data: 准备更新的新数据
 * @param {*} context 
 */
exports.main = async (event, context) => {
    let data = event.data
    delete data._id
    return await db.collection(event.collectionName).doc(event.id).set({
        data
    })
}