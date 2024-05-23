Ext.define('Dashboard.view.main.DashboardWorkspace', {
    extend: 'Ext.Panel',
    xtype: 'dashboardworkspace',
    reference: 'dashboardworkspace',
    requires: [
        'Dashboard.view.deal.bot.BotDealsContainer'
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