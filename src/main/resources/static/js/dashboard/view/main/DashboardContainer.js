Ext.define('Dashboard.view.main.DashboardContainer', {
    extend: 'Ext.Container',
    xtype: 'dashboardcontainer',
    requires: [
        'Dashboard.view.main.DashboardNavigation',
        'Dashboard.view.main.DashboardToolbar',
        'Dashboard.view.main.DashboardWorkspace'
    ],

    layout: 'hbox',
    cls: 'backgroundMain',

    items: [
        {
            xtype: 'dashboardtoolbar',
        },
        {
            xtype: 'dashboardnavigation',

        },
        {
            xtype: 'dashboardworkspace',
            flex: 1
        }
    ]
})