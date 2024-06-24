Ext.define('Dashboard.view.deal.bot.BotDealsGrid', {
    extend: 'Ext.Panel',
    xtype: 'botdealsgrid',
    reference: 'botDealsGrid',

    requires: [
        'Dashboard.view.deal.bot.BotDealsController',
        'Dashboard.view.deal.bot.BotDealsGridMenu',
        'Dashboard.view.deal.bot.add.AddDialog'
    ],
    controller: 'botDealsController',

    flex: 1,
    shadow: true,
    margin: '5 5 10 10',
    layout: 'fit',
    tbar: {
        items: [
            {
                iconCls: 'x-fa fa-plus forestgreenColor',
                tooltip: 'Добавление ручных сделок',
                handler: 'manualAddDeal'
            },
            {
                iconCls: 'x-fa fa-file-excel darkGreen',
                tooltip: 'Экспорт сделок в Excel',
                handler: 'exportDeals'
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
                childcontextmenu: 'openGridMenu',
                select: 'selectDeal',
                painted: 'loadStore'
            },
            columns: [
                {
                    text: '№',
                    dataIndex: 'pid',
                    width: 150,
                    menuDisabled: true,
                },
                {
                    text: 'Статус',
                    dataIndex: 'dealStatus',
                    width: 180,
                    cell: {
                        encodeHtml: false
                    },
                    renderer: function (val) {
                        return '<span class="' + val.color + '">' + val.displayName + '</span>'
                    },
                    menuDisabled: true,
                },
                {
                    text: 'Тип оплаты',
                    dataIndex: 'paymentType.name',
                    flex: 0.6,
                    menuDisabled: true,
                },
                {
                    text: 'Username',
                    width: 150,
                    dataIndex: 'user',
                    renderer: function (val) {
                        return val.username
                    },
                    menuDisabled: true,
                },
                {
                    text: 'Тип сделки',
                    dataIndex: 'dealType',
                    renderer: function (val) {
                        return val.displayName
                    },
                    menuDisabled: true,
                },
                {
                    text: 'Сумма в крипте',
                    dataIndex: 'cryptoAmount',
                    width: 150,
                    menuDisabled: true,
                },
                {
                    text: 'Фиат сумма',
                    dataIndex: 'amount',
                    menuDisabled: true,
                },
                {
                    text: 'Доставка',
                    dataIndex: 'deliveryType',
                    menuDisabled: true,
                },
                {
                    text: 'Дата и время',
                    dataIndex: 'dateTime',
                    width: 150,
                    menuDisabled: true,
                },
                {
                    text: 'Реквизит',
                    dataIndex: 'wallet',
                    flex: 1,
                    menuDisabled: true,
                }
            ]
        }
    ]
})