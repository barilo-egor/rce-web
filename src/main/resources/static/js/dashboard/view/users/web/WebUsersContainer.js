Ext.define('Dashboard.view.users.web.WebUsersContainer', {
    extend: 'Ext.Container',
    xtype: 'webuserscontainer',
    reference: 'webUsersContainer',
    requires: [
        'Dashboard.view.users.web.WebUsersGrid',
        'Dashboard.view.users.web.WebUserInfoPanel',
        'Dashboard.view.users.web.WebUsersController',
        'Dashboard.view.users.web.WebUsersFilterPanel'
    ],

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    items: [
        {
            xtype: 'container',
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'webusersfilterpanel',
                    docked: 'top'
                },
                {
                    flex: 1,
                    xtype: 'webusersgrid'
                },
            ]
        },
        {
            xtype: 'webuserinfopanel'
        }
    ]
})