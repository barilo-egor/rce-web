Ext.define('Main.view.webUser.control.WebUserControlController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.webUserControlController',
    requires: [
        'Main.view.webUser.control.EditWebUserWindow'
    ],

    editUser: function (view, rowIndex, collIndex, item, e, record) {
        Ext.create('Main.view.webUser.control.EditWebUserWindow', {
            viewModel: {
                data: {
                    user: record.getData()
                }
            }
        })
    },

    deleteUser: function (view, rowIndex, collIndex, item, e, record) {
        Ext.Msg.show({
            title: 'Удаление веб-пользователя',
            message: 'Вы действительно хотите удалить веб-пользователя <b>' + record.getData().username + '</b>?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function(btn) {
                if (btn === 'yes') {
                    ExtUtil.loadingByReference('webUserControlPanel')
                    ExtUtil.request({
                        url: '/web/user/remove',
                        params: {
                            pid: record.getData().pid
                        },
                        loadingComponent: ExtUtil.referenceQuery('webUserControlPanel'),
                        success: function (response) {
                            Ext.getStore('webUserStore').reload()
                            ExtUtil.turnOffLoadingByReference('webUserControlPanel')
                        }
                    })
                }
            }
        });
    }
})