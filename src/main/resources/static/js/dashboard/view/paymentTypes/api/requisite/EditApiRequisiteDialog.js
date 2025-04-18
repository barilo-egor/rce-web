Ext.define('Dashboard.view.paymentTypes.api.requisite.EditApiRequisiteDialog', {
    extend: 'Ext.Dialog',
    reference: 'editApiRequisiteDialog',
    requires: [
        'Dashboard.view.paymentTypes.api.requisite.AddApiRequisiteController'
    ],
    controller: 'addApiRequisiteController',

    closable: true,
    title: 'Редактирование реквизита',

    width: 550,

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
                },
                {
                    xtype: 'textfield',
                    reference: 'commentField',
                    label: 'Примечание',
                    dataIndex: 'comment',
                    flex: 0.4,
                    bind: {
                        value: '{comment}'
                    }
                }
            ]
        }
    ]
})