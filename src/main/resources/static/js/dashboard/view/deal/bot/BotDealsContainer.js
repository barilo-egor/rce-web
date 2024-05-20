Ext.define('Dashboard.view.deal.bot.BotDealsContainer', {
    extend: 'Ext.Container',
    xtype: 'botdealscontainer',
    requires: [
        'Dashboard.view.deal.bot.DealInfoPanel',
        'Dashboard.view.deal.bot.FilterPanel',
        'Dashboard.view.deal.bot.BotDealsGrid'
    ],

    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'container',
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'filterpanel',
                },
                {
                    xtype: 'botdealsgrid',
                    flex: 1
                }
            ]
        },
        {
            xtype: 'dealinfopanel',
            shadow: true,
            flex: 0.3,
            margin: '10 10 10 10'
        }
    ]
})