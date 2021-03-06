import computeOffset from "../behaviors/computeOffset";
import zIndex from "../behaviors/zIndex";
import watchShow from "../behaviors/watchShow";
Component({
    behaviors: [computeOffset, zIndex, watchShow],
    externalClasses: ["l-bg-class", "l-icon-class", "l-class", "l-image-class", "l-title-class "],
    properties: {
        show: {
            type: Boolean,
            value: !1
        },
        title: String,
        icon: String,
        iconSize: String,
        iconColor: String,
        image: String,
        placement: {
            type: String,
            value: "bottom"
        },
        duration: {
            type: Number,
            value: 1500
        },
        zIndex: {
            type: Number,
            value: 777
        },
        center: {
            type: Boolean,
            value: !0
        },
        mask: {
            type: Boolean,
            value: !1
        },
        openApi: {
            type: Boolean,
            value: !0
        },
        offsetX: Number,
        offsetY: Number
    },
    data: {
        status: !1,
        success: "",
        fail: "",
        complete: ""
    },
    observers: {
        icon: function () {}
    },
    attached() {
        this.data.openApi && this.initToast()
    },
    pageLifetimes: {
        show() {
            this.data.openApi && this.initToast(), this.offsetMargin()
        }
    },
    methods: {
        initToast() {
            wx.lin = wx.lin || {}, wx.lin.showToast = (t = {}) => (console.warn("wx.lin 已废弃，请使用开放函数代替：https://doc.mini.talelin.com//start/open-function.html"), this.linShow(t), this), wx.lin.hideToast = () => {
                console.warn("wx.lin 已废弃，请使用开放函数代替：https://doc.mini.talelin.com//start/open-function.html"), this.linHide()
            }
        },
        strlen(t) {
            for (var e = 0, o = 0; o < t.length; o++) {
                var i = t.charCodeAt(o);
                i >= "0x0001" && i <= "0x007e" || "0xff60" <= i && i <= "0xff9f" ? e++ : e += 2
            }
            return e
        },
        doNothingMove() {},
        onMaskTap() {
            !0 !== this.data.locked && this.setData({
                fullScreen: "hide",
                status: "hide"
            }), this.triggerEvent("lintap", !0, {
                bubbles: !0,
                composed: !0
            })
        },
        linShow(t) {
            t || (t = {});
            const {
                title: e = "",
                icon: o = "",
                image: i = "",
                placement: s = "bottom",
                duration: n = 1500,
                center: a = !0,
                mask: l = !1,
                success: c = null,
                complete: r = null,
                offsetX: h = 0,
                offsetY: m = 0,
                iconSize: p = "60",
                iconColor: f = ""
            } = t;
            this.setData({
                title: e,
                icon: o,
                image: i,
                placement: s,
                duration: n,
                center: a,
                mask: l,
                success: c,
                complete: r,
                offsetY: m,
                offsetX: h,
                iconSize: p,
                iconColor: f
            }), this.changeStatus()
        },
        linHide() {
            this.setData({
                status: !1
            })
        }
    }
});