Ext.define('Dashboard.view.paymentTypes.api.type.PaymentTypesPanel', {
    extend: 'Ext.Panel',
    xtype: 'paymenttypespanel',
    requires: [
        'Dashboard.view.paymentTypes.api.type.PaymentTypesController'
    ],
    controller: 'paymentTypesController',

    shadow: true,
    title: 'Типы оплат',

    tbar: {
        items: [
            {
                iconCls: 'x-fa fa-plus forestgreenColor',
                tooltip: 'Добавить тип оплаты',
                handler: 'createDialog'
            },
            '->',
            {
                iconCls: 'x-fa fa-question',
                tooltip: 'Помощь'
            }
        ]
    },

    layout: 'fit',
    items: [
        {
            xtype: 'grid',

            columns: [
                {
                    text: 'Название',
                    flex: 1,
                    menuDisabled: true
                },
                {
                    text: 'ID',
                    flex: 1,
                    menuDisabled: true
                },
                {
                    text: 'Количество реквизитов',
                    width: 180,
                    menuDisabled: true
                },
                {
                    text: 'Количество клиентов',
                    width: 170,
                    menuDisabled: true
                }
            ]
        },
    ]
})