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
            },
            '->',
            {
                xtype: 'button',
                iconCls: 'x-fa fa-question',
                tooltip: 'Статусы сделок',
                handler: function (me) {
                    ExtMessages.info('Статусы сделок',
                        '<span class="blackColor" style="font-size: 14px; margin-bottom: 10px; display: inline-block;">Создана</span> - <span style="font-size: 14px">CREATED</span><br>' +
                        '<span class="mediumSeaGreenColor" style="font-size: 14px; margin-bottom: 10px; display: inline-block;">Оплачена</span> - <span style="font-size: 14px">PAID</span><br>' +
                        '<span class="orangeColor" style="font-size: 14px; margin-bottom: 10px; display: inline-block;">Отменена клиентом</span> - <span style="font-size: 14px">CANCELED</span><br>' +
                        '<span class="lightGrey" style="font-size: 14px; margin-bottom: 10px; display: inline-block;">Подтверждена оператором</span> - <span style="font-size: 14px">ACCEPTED</span><br>' +
                        '<span class="redColor" style="font-size: 14px; margin-bottom: 10px; display: inline-block;">Отклонена оператором</span> - <span style="font-size: 14px">DECLINED</span><br>')
                }
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