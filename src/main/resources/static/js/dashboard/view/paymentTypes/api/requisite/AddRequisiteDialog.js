Ext.define('Dashboard.view.paymentTypes.api.requisite.AddRequisiteDialog', {
    extend: 'Ext.Dialog',
    reference: 'addRequisiteDialog',
    requires: [
        'Dashboard.view.paymentTypes.api.requisite.AddRequisiteController'
    ],
    controller: 'addRequisiteController',

    closable: true,
    title: 'Добавление реквизита',

    width: 550,
    height: 210,

    layout: 'fit',
    items: [
        {
            xtype: 'formpanel',
            reference: 'addRequisiteForm',

            jsonSubmit: true,
            buttons: [
                {
                    text: 'Создать',
                    handler: 'createRequisite'
                }
            ],

            items: [
                {
                    xtype: 'numberfield',
                    name: 'paymentTypePid',
                    hidden: true,
                    bind: {
                        value: '{paymentTypePid}'
                    }
                },
                {
                    xtype: 'textfield',
                    label: 'Реквизит',
                    name: 'requisite',
                    required: true,
                    requiredMessage: 'Реквизит обязателен для заполнения.'
                }
            ]
        }
    ]
})