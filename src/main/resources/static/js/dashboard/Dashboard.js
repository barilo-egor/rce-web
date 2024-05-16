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
    },
    //
    // stores: [
    //     'Dashboard.store.deal.bot.BotDealStore'
    // ]
})