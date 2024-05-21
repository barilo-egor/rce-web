Ext.define('Dashboard.view.main.DashboardContainer', {
    extend: 'Ext.Container',
    xtype: 'dashboardcontainer',
    requires: [
        'Dashboard.view.main.DashboardNavigation',
        'Dashboard.view.main.DashboardToolbar',
        'Dashboard.view.main.DashboardWorkspace'
    ],

    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    cls: 'backgroundMain',

    items: [
        {
            xtype: 'dashboardtoolbar',
            docked: 'top',
            height: 48
        },
        {
            xtype: 'dashboardnavigation',
        },
        {
            xtype: 'dashboardworkspace',
            flex: 1,
        }
    ]
})