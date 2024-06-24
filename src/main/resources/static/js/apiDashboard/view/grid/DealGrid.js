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
                painted: 'checkTie',
                childcontextmenu: 'openGridMenu',
            },
            plugins: {
                pagingtoolbar: true
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
                    menuDisabled: true,
                }
            ]
        }
    ]
})