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
        {
            text: 'Показать чек',
            reference: 'showCheckMenuButton',
            iconCls: 'x-fa fa-receipt lightBlue',
            handler: 'showCheck'
        },
        '-',
        {
            text: 'Подтвердить',
            reference: 'acceptDealMenuButton',
            iconCls: 'x-fa fa-check-circle darkGreen',
            handler: 'confirmDeal'
        },
        {
            text: 'Подтвердить с запросом',
            reference: 'acceptDealWithRequestMenuButton',
            iconCls: 'x-fa fa-check-circle darkGreen',
            handler: 'confirmDealWithRequest'
        },
        {
            text: 'Отклонить',
            reference: 'declineDealMenuButton',
            iconCls: 'x-fa fa-times-circle redColor',
            handler: 'declineDeal'
        }
    ]
})