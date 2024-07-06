Ext.define('Dashboard.view.deal.api.ApiDealsGridMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'apidealsgridmenu',
    requires: [
        'Dashboard.view.deal.api.ApiDealsController'
    ],
    controller: 'apiDealsController',

    listeners: {
        beforeshow: 'updateMenuButtons'
    },

    items: [
        {
            text: 'Скопировать реквизит',
            iconCls: 'x-fa fa-copy blackColor',
            handler: 'copyRequisite'
        },
        '-',
        {
            text: 'Подтвердить',
            reference: 'acceptDealMenuButton',
            iconCls: 'x-fa fa-check-circle darkGreen',
            handler: 'confirmDeal'
        },
        {
            text: 'Отклонить',
            reference: 'declineDealMenuButton',
            iconCls: 'x-fa fa-times-circle redColor',
            handler: 'declineDeal'
        }
    ]
})