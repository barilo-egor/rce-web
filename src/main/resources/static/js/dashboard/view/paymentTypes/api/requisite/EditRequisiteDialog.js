Ext.define('Dashboard.view.paymentTypes.api.requisite.EditRequisiteDialog', {
    extend: 'Ext.Dialog',
    reference: 'editRequisiteDialog',
    requires: [
        'Dashboard.view.paymentTypes.api.requisite.AddRequisiteController'
    ],
    controller: 'addRequisiteController',

    closable: true,
    title: 'Редактирование реквизита',

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
                    text: 'Сохранить',
                    handler: 'editRequisite'
                }
            ],

            items: [
                {
                    xtype: 'numberfield',
                    reference: 'paymentTypePidField',
                    name: 'paymentTypePid',
                    hidden: true,
                    bind: {
                        value: '{requisitePid}'
                    }
                },
                {
                    xtype: 'textfield',
                    reference: 'requisiteField',
                    label: 'Реквизит',
                    name: 'requisite',
                    required: true,
                    requiredMessage: 'Реквизит обязателен для заполнения.',
                    bind: {
                        value: '{requisite}'
                    }
                }
            ]
        }
    ]
})