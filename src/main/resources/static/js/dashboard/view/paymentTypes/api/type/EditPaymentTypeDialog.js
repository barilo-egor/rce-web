Ext.define('Dashboard.view.paymentTypes.api.type.EditPaymentTypeDialog', {
    extend: 'Ext.Dialog',
    reference: 'editPaymentTypeDialog',
    requires: [
        'Dashboard.view.paymentTypes.api.type.PaymentTypesController'
    ],
    controller: 'paymentTypesController',

    title: 'Редактирование типа оплаты',
    width: 400,
    closable: true,

    layout: {
        type: 'vbox',
        align: 'center'
    },
    items: [
        {
            xtype: 'formpanel',
            reference: 'editPaymentTypeForm',

            width: '100%',
            jsonSubmit: true,

            buttons: [
                {
                    text: 'Сохранить',
                    handler: 'edit'
                }
            ],

            items: [
                {
                    xtype: 'textfield',

                    label: 'ID',
                    name: 'id',
                    msgTarget: 'side',
                    required: true,
                    requiredMessage: 'ID обязателен для заполнения',
                    bind: {
                        value: '{id}'
                    },

                    validators: [
                        {
                            type: 'length',
                            min: 3,
                            message: 'Длина ID должна быть больше 3-х символов'
                        },
                        {
                            type: 'format',
                            matcher: /^[a-zA-Z0-9_]+$/,
                            message: 'ID может содержать только буквы, цифры и подчеркивания'
                        }
                    ]
                },
                {
                    xtype: 'textfield',

                    label: 'Название',
                    name: 'name',
                    required: true,
                    requiredMessage: 'Название обязательно для заполнения',
                    bind: {
                        value: '{name}'
                    },

                    validators: [
                        {
                            type: 'length',
                            min: 3,
                            message: 'Длина названия должна быть больше 3-х символов'
                        }
                    ]
                },
                {
                    xtype: 'textareafield',
                    bind: {
                        value: '{comment}'
                    },

                    label: 'Примечение',
                    name: 'comment'
                }
            ]
        }
    ]
})