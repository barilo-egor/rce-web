Ext.define('ApiDashboard.view.grid.DealGridMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'dealgridmenu',
    requires: [
        'ApiDashboard.view.grid.DealGridMenuController'
    ],
    controller: 'dealGridMenuController',

    listeners: {
        beforeshow: 'updateDisabled'
    },

    items: [
        {
            text: 'Отменить',
            reference: 'cancelMenuButton',
            iconCls: 'x-fa fa-ban orangeColor',
            handler: 'cancelHandler'
        },
        {
            text: 'Удалить',
            reference: 'deleteMenuButton',
            iconCls: 'x-fa fa-trash-alt redColor',
            handler: 'deleteHandler'
        }
    ]
})