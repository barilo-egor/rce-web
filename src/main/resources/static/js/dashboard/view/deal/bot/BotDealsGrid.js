Ext.define('Dashboard.view.deal.bot.BotDealsGrid', {
    extend: 'Ext.Panel',
    xtype: 'botdealsgrid',
    reference: 'botDealsGrid',

    requires: [
        'Dashboard.view.deal.bot.BotDealsController',
        'Dashboard.view.deal.bot.GridMenu'
    ],
    controller: 'botDealsController',

    flex: 1,
    shadow: true,
    margin: '10 10 10 10',
    layout: 'fit',
    tbar: {
        items: [
            {
                iconCls: 'x-fa fa-file-excel darkGreen'
            }
        ]
    },
    items: [
        {
            xtype: 'grid',
            reference: 'botDealsGrid',
            store: Ext.create('Dashboard.store.deal.bot.BotDealStore'),
            plugins: {
                pagingtoolbar: true
            },
            listeners: {
                childcontextmenu: function (me, eObj) {
                    me.deselectAll();
                    me.setSelection(eObj.record);
                    if (!me.menu) {
                        me.menu = Ext.create('Dashboard.view.deal.bot.GridMenu')
                    }
                    me.menu.setViewModel({
                        data: {
                            deal: eObj.record
                        }
                    })
                    me.menu.showAt(eObj.event.getX(), eObj.event.getY());
                    eObj.event.stopEvent()
                }
            },
            columns: [
                {
                    text: '№',
                    dataIndex: 'pid',
                    width: 60
                },
                {
                    text: 'Статус',
                    dataIndex: 'status',
                    width: 140,
                    renderer: function (val) {
                        return val.displayName
                    }
                },
                {
                    text: 'Тип оплаты',
                    dataIndex: 'paymentType',
                    flex: 1
                },
                {
                    text: 'Тип сделки',
                    dataIndex: 'dealType',
                    renderer: function (val) {
                        return val.displayName
                    }
                },
                {
                    text: 'Сумма в крипте',
                    dataIndex: 'cryptoAmount',
                    width: 120
                },
                {
                    text: 'Фиат сумма',
                    dataIndex: 'amount'
                },
                {
                    text: 'Доставка',
                    dataIndex: 'deliveryType'
                },
                {
                    text: 'Дата и время',
                    dataIndex: 'dateTime',
                    width: 150
                },
                {
                    text: 'Реквизит',
                    dataIndex: 'requisite',
                    flex: 1
                },
                {
                    text: 'Chat id',
                    dataIndex: 'user',
                    renderer: function (val) {
                        return val.chatId
                    }
                }
            ]
        }
    ]
})