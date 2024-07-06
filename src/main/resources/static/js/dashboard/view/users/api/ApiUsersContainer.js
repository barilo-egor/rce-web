Ext.define('Dashboard.view.users.api.ApiUsersContainer', {
    extend: 'Ext.Container',
    xtype: 'apiuserscontainer',
    reference: 'apiUsersContainer',
    requires: [
        'Dashboard.view.users.api.ApiUsersGrid',
        'Dashboard.view.users.api.ApiUserInfoPanel',
        'Dashboard.view.users.api.ApiUsersFilterPanel'
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
                    xtype: 'apiusersfilterpanel',
                    docked: 'top'
                },
                {
                    flex: 1,
                    xtype: 'apiusersgrid'
                },
            ]
        },
        {
            xtype: 'apiuserinfopanel'
        }
    ]
})