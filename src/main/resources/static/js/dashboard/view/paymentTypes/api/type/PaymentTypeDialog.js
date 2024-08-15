Ext.define('Dashboard.view.paymentTypes.api.type.PaymentTypeDialog', {
    extend: 'Ext.Dialog',
    reference: 'paymentTypeDialog',
    requires: [
        'Dashboard.view.paymentTypes.api.type.PaymentTypesController'
    ],
    controller: 'paymentTypesController',

    title: 'Создание типа оплаты',
    width: 400,
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
                        },
                        function (val) {
                            let result
                            RequestUtil.request({
                                url: '/paymentTypes/api/exists/' + val,
                                method: 'GET',
                                async: false,
                                success: function (response) {
                                    if (response.data === true) {
                                        result = 'Данный ID уже занят'
                                    } else {
                                        result = true
                                    }
                                }
                            })
                            return result
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
                },
                {
                    xtype: 'combobox',
                    reference: 'addDealTypeField',
                    label: 'Тип сделки',
                    name: 'dealType',
                    displayField: 'nominative',
                    required: true,
                    editable: false,
                    queryMode: 'local',
                    valueField: 'name',
                    store: {
                        type: 'dealTypesStore',
                        listeners: {
                            load: function (me, records) {
                                ExtUtil.referenceQuery('addDealTypeField').setValue(me.getAt(0))
                            }
                        }
                    }
                },
                {
                    xtype: 'combobox',
                    reference: 'fiatCurrencyAddField',
                    label: 'Фиатная валюта',
                    name: 'fiatCurrency',
                    editable: false,
                    required: true,
                    displayField: 'code',
                    valueField: 'name',
                    queryMode: 'local',
                    store: {
                        type: 'fiatCurrenciesStore',
                        listeners: {
                            load: function (me, records) {
                                ExtUtil.referenceQuery('fiatCurrencyAddField').setValue(me.getAt(0))
                            }
                        }
                    }
                },
                {
                    xtype: 'numberfield',
                    decimals: 8,
                    label: 'Минимальная сумма(фиат)',
                    value: 0,
                    required: true,
                    name: 'minSum'
                }
            ]
        }
    ]
})