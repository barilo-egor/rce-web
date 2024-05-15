Ext.define('Dashboard.view.main.DashboardWorkspace', {
    extend: 'Ext.Panel',
    xtype: 'dashboardworkspace',
    reference: 'dashboardworkspace',
    requires: [
        'Dashboard.view.deal.bot.BotDealsContainer'
    ],

    shadow: true,
    margin: '10 10 10 10',

    layout: {
        type: 'fit'
    },
    items: [
        {
            xtype: 'botdealscontainer'
        }
    ]
})