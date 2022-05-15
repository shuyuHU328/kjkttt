// pages/memberArrange/memberArrage.js
const sideBarData = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

const nameData = [
    ['A1', 'A2'],
    ['B1', 'B2'],
    ['C1', 'C2'],
    ['D1', 'D2'],
    ['E1', 'E2'],
    ['F1', 'F2'],
    ['G1', 'G2'],
    ['H1', 'H2'],
    ['I1', 'I2'],
    ['J1', 'J2'],
    ['K1', 'K2'],
    ['L1', 'L2'],
    ['M1', 'M2'],
    ['N1', 'N2'],
    ['O1', 'O2'],
    ['P1', 'P2'],
    ['Q1', 'Q2'],
    ['R1', 'R2'],
    ['S1', 'S2'],
    ['T1', 'T2'],
    ['U1', 'U2'],
    ['V1', 'V2'],
    ['W1', 'W2'],
    ['X1', 'X2'],
    ['Y1', 'Y2'],
    ['Z1', 'Z2'],
];
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nameData,
        sideBarData
    },

    /**
     * 点击头像
     */

    onPageScroll(e) {
        this.setData({
            scrollTop: e.scrollTop
        });
    },
    // 页面垂直滑动的距离
    scrollTop: undefined,

    // 页面监听函数
    onPageScroll(res) {
        this.setData({
            scrollTop: res.scrollTop,
        })
    },
    //查看任务
    goToAssignment() {
        wx.navigateTo({
            url: '/pages/groups-memberArrange-assignmentArrange/groups-memberArrange-assignmentArrange',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

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
})