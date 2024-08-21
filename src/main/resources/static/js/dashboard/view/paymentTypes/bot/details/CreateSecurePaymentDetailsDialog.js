Ext.define('Dashboard.view.paymentTypes.bot.details.CreateSecurePaymentDetailsDialog', {
    extend: 'Ext.Dialog',
    reference: 'createSecurePaymentDetailsDialog',
    requires: [
        'Dashboard.view.paymentTypes.bot.details.SecurePaymentDetailsController',
    ],
    controller: 'securePaymentDetailsController',

    bind: {
        title: '{title}'
    },
    width: 400,
    closable: true,

    layout: 'fit',
    items: [
        {
            xtype: 'formpanel',

            jsonSubmit: true,
            buttons: [
                {
                    text: 'Сохранить',
                    handler: 'saveNewDetails'
                }
            ],
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'numberfield',
                    hidden: true,
                    name: 'pid',
                    bind: {
                        value: '{pid}'
                    }
                },
                {
                    xtype: 'numberfield',
                    readOnly: true,
                    label: 'Количество сделок для отображения реквизита',
                    tooltip: 'Значение формируется автоматически',
                    bind: {
                        value: '{minDealCount}'
                    },
                    name: 'minDealCount'
                },
                {
                    xtype: 'textareafield',
                    label: 'Реквизит',
                    height: 140,
                    bind: {
                        value: '{details}'
                    },
                    name: 'details',
                    required: true,
                    requiredMessage: 'Заполните реквизит.'
                }
            ]
        }
    ]
})