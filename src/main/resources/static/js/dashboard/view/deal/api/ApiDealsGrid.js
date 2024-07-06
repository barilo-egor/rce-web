Ext.define('Dashboard.view.deal.api.ApiDealsGrid', {
    extend: 'Ext.Panel',
    xtype: 'apidealsgrid',
    reference: 'apiDealsGrid',
    requires: [
        'Dashboard.view.deal.api.ApiDealsController',
        'Dashboard.view.deal.api.ApiDealsGridMenu'
    ],
    controller: 'apiDealsController',

    shadow: true,
    margin: '5 5 10 10',
    tbar: {
        items: [
            {
                iconCls: 'x-fa fa-sync-alt',
                tooltip: 'Перезагрузить сделки',
                handler: 'reloadDeals'
            },
            {
                iconCls: 'x-fa fa-file-excel darkGreen',
                tooltip: 'Экспорт сделок в Excel',
                handler: 'dealsExport'
            }
        ]
    },

    layout: 'fit',
    items: [
        {
            xtype: 'grid',
            reference: 'apiDealsGrid',
            store: Ext.create('Dashboard.store.deal.api.ApiDealStore'),
            plugins: {
                pagingtoolbar: true
            },
            listeners: {
                childcontextmenu: 'gridMenu',
                select: 'selectDeal',
                painted: 'loadStore'
            },
            columns: [
                {
                    text: '№',
                    dataIndex: 'pid',
                    width: 80,
                    menuDisabled: true,
                },
                {
                    text: 'Статус',
                    dataIndex: 'apiDealStatus',
                    flex: 0.5,
                    cell: {
                        encodeHtml: false
                    },
                    renderer: function (val) {
                        return '<span class="' + val.color + '">' + val.description + '</span>'
                    },
                    menuDisabled: true,
                },
                {
                    text: 'Тип сделки',
                    dataIndex: 'dealType',
                    renderer: function (val) {
                        return val.displayName
                    },
                    flex: 0.3,
                    menuDisabled: true,
                },
                {
                    text: 'ID',
                    dataIndex: 'apiUser.id',
                    flex: 0.3,
                    menuDisabled: true,
                },
                {
                    text: 'Сумма в крипте',
                    dataIndex: 'cryptoAmount',
                    flex: 0.3,
                    menuDisabled: true,
                },
                {
                    text: 'Фиат сумма',
                    dataIndex: 'amount',
                    flex: 0.3,
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
                    dataIndex: 'requisite',
                    flex: 1,
                    menuDisabled: true
                }
            ]
        }
    ]
})