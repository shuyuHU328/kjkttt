// app.js
App({
    onLaunch: function () {
        wx.cloud.init({
            env: 'cloud1-0gsz3v5x31215faf',
            traceUser: true,
        });

        this.globalData = {};
    }
});


// "selectedIconPath": "/assets/icons/groups_selected.png",
// "selectedIconPath": "/assets/icons/home_selected.png",
// "selectedIconPath": "/assets/icons/settings_selected.png",