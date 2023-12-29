Ext.define('Main.view.webUser.control.WebUserControlPanel', {
    xtype: 'webusercontrolpanel',
    extend: 'Main.view.components.FramePanel',
    requires: [
        'Main.view.webUser.control.WebUserControlController'
    ],
    title: {
        xtype: 'mainframetitle',
        text: 'Управление веб-пользователями'
    },
    controller: 'webUserControlController',
    region: 'center',
    scrollable: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [
        {
            xtype: 'grid',
            padding: '10 10 0 10',
            store: {
                storeId: 'webUserStore',
                fields: [ 'username', 'role', 'isEnabled', 'chatId' ],
                autoLoad: true,
                proxy: {
                    type: 'ajax',
                    url: '/web/user/findAll',
                    reader: {
                        type: 'json',
                        rootProperty: 'body.data'
                    }
                }
            },
            columns: [
                {
                    dataIndex: 'username',
                    text: 'Логин',
                    flex: 0.5
                },
                {
                    dataIndex: 'role',
                    text: 'Роль',
                    flex: 0.5
                },
                {
                    dataIndex: 'isEnabled',
                    text: 'Активность',
                    width: 100
                },
                {
                    dataIndex: 'chatId',
                    text: 'Chat ID',
                    width: 100
                },
                {
                    xtype: 'actioncolumn',
                    handler: 'editUser',
                    width: 30,
                    items: [
                        {
                            iconCls: 'far fa-arrow-alt-circle-right'
                        }
                    ]
                }
            ]
        }
    ]
})