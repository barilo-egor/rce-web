Ext.define('Dashboard.view.main.DashboardWorkspace', {
    extend: 'Ext.Panel',
    xtype: 'dashboardworkspace',
    reference: 'dashboardWorkspace',
    requires: [
        'Dashboard.view.deal.bot.BotDealsContainer'
        // 'Dashboard.view.deal.api.ApiDealsContainer'
    ],

    shadow: true,
    margin: '5 10 10 5',

    layout: {
        type: 'fit'
    },
    items: [
        {
            xtype: 'botdealscontainer'
        }
    ]
})