Ext.application({
    extend: 'Ext.app.Application',
    name: 'ApiDashboard',
    requires: [
        'ApiDashboard.view.MainContainer'
    ],

    appFolder: '/js/apiDashboard',

    viewport: {
        layout: 'fit',
        items: [
            {
                xtype: 'maincontainer'
            }
        ]
    },
})