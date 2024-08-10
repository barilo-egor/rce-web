Ext.define('Dashboard.view.paymentTypes.api.type.CreatePaymentTypeDialog', {
    extend: 'Ext.Dialog',
    reference: 'createPaymentTypeDialog',
    requires: [
        'Dashboard.view.paymentTypes.api.type.PaymentTypesController'
    ],
    controller: 'paymentTypesController',

    title: 'Создание типа оплаты',
    width: 400,
    height: 370,
    closable: true,

    layout: {
        type: 'vbox',
        align: 'center'
    },
    items: [
        {
            xtype: 'formpanel',
            reference: 'createPaymentTypeForm',

            width: '100%',
            jsonSubmit: true,

            buttons: [
                {
                    text: 'Создать',
                    handler: 'create'
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

                    label: 'Примечение',
                    name: 'comment'
                }
            ]
        }
    ]
})