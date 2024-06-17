Ext.define('ApiDashboard.view.grid.DealGrid', {
    extend: 'Ext.Panel',
    xtype: 'dealgrid',
    reference: 'dealGrid',
    requires: [
        'ApiDashboard.view.grid.DealController',
        'ApiDashboard.view.grid.DealGridMenu'
    ],
    controller: 'dealController',

    shadow: true,

    tbar: {
        items: [
            {
                iconCls: 'x-fa fa-file-excel darkGreen',
                tooltip: 'Экспорт сделок в Excel',
                handler: 'exportDeals'
            }
        ]
    },

    layout: 'fit',
    items: [
        {
            xtype: 'grid',
            columnsMenuItem: null,
            store: Ext.create('ApiDashboard.store.DealStore'),

            listeners: {
                painted: function (me) {
                    me.getStore().load()
                },
                childcontextmenu: 'openGridMenu',
            },
            plugins: {
                pagingtoolbar: true
            },

            columns: [
                {
                    text: '№',
                    dataIndex: 'pid',
                    width: 80
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
                    }
                },
                {
                    text: 'Тип сделки',
                    dataIndex: 'dealType',
                    renderer: function (val) {
                        return val.displayName
                    },
                    flex: 0.3
                },
                {
                    text: 'Сумма в крипте',
                    dataIndex: 'cryptoAmount',
                    flex: 0.3
                },
                {
                    text: 'Фиат сумма',
                    dataIndex: 'amount',
                    flex: 0.3
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
                }
            ]
        }
    ]
})