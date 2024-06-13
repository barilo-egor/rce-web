Ext.define('ApiDashboard.view.MainContainer', {
    extend: 'Ext.Container',
    xtype: 'maincontainer',
    requires: [
        'ApiDashboard.view.grid.DealGrid',
        'ApiDashboard.view.MainToolbar',
        'ApiDashboard.view.grid.DealFilterPanel'
    ],

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [
        {
            xtype: 'maintoolbar',
            docked: 'top',
            margin: '10 10 5 10'
        },
        {
            xtype: 'container',
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'dealfilterpanel',
                    margin: '5 10 5 10',
                },
                {
                    flex: 1,
                    xtype: 'dealgrid',
                    margin: '5 10 10 10'
                }
            ]
        }
    ]
})