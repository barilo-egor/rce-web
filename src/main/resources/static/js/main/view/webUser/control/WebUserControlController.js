Ext.define('Main.view.webUser.control.WebUserControlController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.webUserControlController',

    editUser: function (view, rowIndex, collIndex, item, e, record) {
        Ext.create('Main.view.webUser.control.EditUserWindow', {
            viewModel: {
                data: {
                    user: record.getData()
                }
            }
        })
    }
})