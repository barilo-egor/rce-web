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
            reference: 'paymentTypesGrid',
            store: 'paymentTypeStore',

            listeners: {
                painted: 'loadPaymentTypes',
                select: 'selectPaymentType'
            },
            getPidOfSelected: function() {
                let selection = this.getSelection()
                if (selection) {
                    return selection.get('pid')
                }
                return null
            },

            columns: [
                {
                    text: 'Название',
                    dataIndex: 'name',
                    width: 250,
                    menuDisabled: true
                },
                {
                    text: 'ID',
                    dataIndex: 'id',
                    width: 150,
                    menuDisabled: true
                },
                {
                    text: 'Примечание',
                    dataIndex: 'comment',
                    flex: 1,
                    menuDisabled: true
                }
            ]
        },
    ]
})