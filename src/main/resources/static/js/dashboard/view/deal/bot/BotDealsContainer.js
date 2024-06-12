Ext.define('Dashboard.view.deal.bot.BotDealsContainer', {
    extend: 'Ext.Container',
    xtype: 'botdealscontainer',
    requires: [
        'Dashboard.view.deal.bot.BotUserInfoPanel',
        'Dashboard.view.deal.bot.BotDealsFilterPanel',
        'Dashboard.view.deal.bot.BotDealsGrid',
        'Dashboard.view.deal.bot.BotDealsPaymentPanel'
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
                    xtype: 'botdealsfilterpanel',
                },
                {
                    xtype: 'botdealsgrid',
                    flex: 1
                }
            ]
        },
        {
            xtype: 'botuserinfopanel',
            shadow: true,
            margin: '10 10 10 5',
            docked: 'right'
        },
        {
            xtype: 'botdealspaymentpanel',
            shadow: true,
            margin: '0 10 10 10',
            hidden: !IS_DEV,
            docked: 'bottom'
        }
    ]
})