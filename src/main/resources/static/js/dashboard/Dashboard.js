Ext.application({
    extend: 'Ext.app.Application',
    name: 'Dashboard',
    requires: [
        'Dashboard.view.main.DashboardContainer'
    ],

    appFolder: '/js/dashboard',

    viewport: {
        items: [
            {
                xtype: 'dashboardcontainer'
            }
        ]
    }
})