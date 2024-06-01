Ext.define('Dashboard.view.users.web.WebUsersGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'webusersgrid',
    requires: [
        'Dashboard.view.users.web.WebUsersController'
    ],
    controller: 'webUsersController',

    reference: 'webUsersGrid',
    scrollable: true,
    shadow: true,
    margin: '10 5 10 10',
    store: Ext.create('Dashboard.store.users.web.WebUserStore'),

    listeners: {
        select: 'select',
        deselect: 'deselect',
        painted: 'reloadStore'
    },

    columns: [
        {
            text: 'Логин',
            dataIndex: 'username',
            flex: 0.25
        },
        {
            text: 'Роль',
            dataIndex: 'role',
            flex: 0.25,
            editable: true,
            renderer: function (val) {
                return val.displayName
            }
        },
        {
            text: 'В бане',
            dataIndex: 'isEnabled',
            flex: 0.25,
            editable: true,
            renderer: function (val) {
                return val ? 'Нет' : 'Да'
            }
        },
        {
            text: 'Chat id',
            flex: 0.25,
            dataIndex: 'chatId'
        }
    ]
})