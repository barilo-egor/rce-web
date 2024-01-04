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
    }
})