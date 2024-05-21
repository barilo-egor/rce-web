Ext.application({
    extend: 'Ext.app.Application',
    name: 'Dashboard',
    requires: [
        'Dashboard.view.main.DashboardContainer'
    ],

    appFolder: '/js/dashboard',

    viewport: {
        layout: 'fit',
        items: [
            {
                xtype: 'dashboardcontainer'
            }
        ]
    }
})