Ext.define('Main.view.deal.bot.BotDealsPanel', {
    extend: 'Main.view.components.FramePanel',
    xtype: 'botdealspanel',
    requires: ['Main.view.deal.bot.BotDealsController'],
    controller: 'botDealsController',
    title: {
        xtype: 'mainframetitle',
        text: 'Сделки из бота'
    },
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    listeners: {
        beforedestroy: function (me) {
            STORE_UPDATE_RUNNER.stop(STORE_UPDATE_RUNNER.tasks[0])
        }
    },

    items: [
        {
            xtype: 'grid',
            padding: '0 20 0 20',
            store: 'botDealStore',
            listeners: {
                afterrender: function (me) {
                    me.getStore().load()
                }
            },
            viewConfig  : {
                loadMask: false
            },
            dockedItems: [
                {
                    xtype: 'pagingtoolbar',
                    store: 'botDealStore',
                    displayInfo: false
                }
            ],
            emptyText: 'Сделки отсутствуют',
            columns: [
                {
                    text: 'Номер',
                    dataIndex: 'pid',
                    width: 65
                },
                {
                    text: 'Статус',
                    dataIndex: 'dealStatus',
                    flex: 1
                },
                {
                    text: 'Chat id',
                    dataIndex: 'chatId',
                    width: 100
                },
                {
                    xtype: 'actioncolumn',
                    handler: 'showDeal',
                    width: 30,
                    items: [
                        {
                            iconCls: 'far fa-arrow-alt-circle-right'
                        }
                    ]
                }
            ]
        }
    ]
})