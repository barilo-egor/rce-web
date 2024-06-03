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
                    width: 60
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
                    }
                },
                {
                    text: 'Тип оплаты',
                    dataIndex: 'paymentType.name',
                    flex: 0.6
                },
                {
                    text: 'Username',
                    width: 150,
                    dataIndex: 'user',
                    renderer: function (val) {
                        return val.username
                    }
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
                    width: 150
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
                    dataIndex: 'wallet',
                    flex: 1
                }
            ]
        }
    ]
})