Ext.define('Dashboard.view.deal.bot.BotDealsContainer', {
    extend: 'Ext.Container',
    xtype: 'botdealscontainer',
    reference: 'botDealsContainer',
    requires: [
        'Dashboard.view.deal.bot.BotUserInfoPanel',
        'Dashboard.view.deal.bot.BotDealsFilterPanel',
        'Dashboard.view.deal.bot.BotDealsGrid',
        'Dashboard.view.deal.bot.BotDealsPaymentPanel'
    ],

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'container',
            reference: 'topContainer',
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
            ],
            resizable: {
                split: true,
                edges: 'south'
            }
        },
        {
            xtype: 'botuserinfopanel',
            shadow: true,
            margin: '10 10 10 5',
            docked: 'right',
        },
        {
            xtype: 'botdealspaymentpanel',
            resizable: {
                split: true,
                edges: 'north'
            },
            shadow: true,
            margin: '0 5 10 10',
            hidden: !IS_DEV,
            docked: 'bottom',
            listeners: {
                collapse: function(me) {
                    Ext.getStore('dealPaymentStore').reload()
                    Ext.getStore('botDealStore').reload()
                },
                expand: function (me) {
                    Ext.getStore('dealPaymentStore').reload()
                    Ext.getStore('botDealStore').reload()
                },
                resize: function (me) {
                    Ext.getStore('dealPaymentStore').reload()
                    Ext.getStore('botDealStore').reload()
                }
            }
        }
    ]
})