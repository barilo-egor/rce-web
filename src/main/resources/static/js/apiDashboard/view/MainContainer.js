Ext.define('ApiDashboard.view.MainContainer', {
    extend: 'Ext.Container',
    xtype: 'maincontainer',
    requires: [
        'ApiDashboard.view.grid.DealGrid',
        'ApiDashboard.view.MainToolbar'
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
            flex: 1,
            xtype: 'dealgrid',
            margin: '5 10 10 10'
        }
    ]
})