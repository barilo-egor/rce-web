Ext.define('Dashboard.view.deal.bot.add.AddDialog', {
    extend: 'Common.dialog.CommonDialog',
    requires: [
        'Dashboard.view.deal.bot.add.AddController'
    ],
    controller: 'addController',
    reference: 'addDialog',

    width: 600,
    padding: '0 20 40 20',
    closable: true,

    title: 'Добавление сделки',
    titleAlign: 'center',

    buttonAlign: 'center',
    buttons: [
        {
            text: 'Добавить',
            handler: 'saveDeal'
        }
    ],

    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    defaults: {
        xtype: 'container',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        defaults: {
            margin: '0 15 0 15'
        }
    },
    items: [
        {
            flex: 1,
            items: [
                {
                    xtype: 'combobox',
                    label: 'Тип сделки',
                    displayField: 'nominative',
                    editable: false,
                    required: true,
                    queryMode: 'local',
                    valueField: 'name',
                    store: {
                        type: 'dealTypesStore',
                        listeners: {
                            load: function (me, records) {
                                ExtUtil.referenceQuery('dealTypeAddField').setValue(me.getAt(0))
                            }
                        }
                    },
                    reference: 'dealTypeAddField',
                    listeners: {
                        change: 'comboChange'
                    }
                },
                {
                    xtype: 'combobox',
                    label: 'Криптовалюта',
                    displayField: 'shortName',
                    editable: false,
                    required: true,
                    valueField: 'name',
                    queryMode: 'local',
                    store: {
                        type: 'cryptoCurrenciesStore',
                        listeners: {
                            load: function (me, records) {
                                ExtUtil.referenceQuery('cryptoCurrencyAddField').setValue(me.getAt(0))
                            }
                        }
                    },
                    reference: 'cryptoCurrencyAddField',
                    listeners: {
                        change: 'comboChange',
                    }
                },
                {
                    xtype: 'container',
                    reference: 'cryptoAmountFieldContainer',
                    layout: 'fit',
                    items: [
                        {
                            xtype: 'numberfield',
                            reference: 'cryptoAmountField',
                            required: true,
                            decimals: 8,
                            label: 'Сумма в крипте',
                            requiredMessage: 'Введите сумму',
                            clearable: false,
                            triggers: {
                                calculate: {
                                    xtype: 'trigger',
                                    iconCls: 'x-fa fa-arrow-right',
                                    handler: 'calculateFiatAmount'
                                }
                            }
                        },
                    ]
                },
                {
                    margin: '20 15 0 15',
                    xtype: 'checkbox',
                    label: 'Ввод в крипте',
                    checked: true,
                    reference: 'enterInCryptoCheckbox',
                    listeners: {
                        change: 'checkBoxChange'
                    },
                }
            ]
        },
        {
            flex: 1,
            items: [
                {
                    xtype: 'combobox',
                    label: 'Фиатная валюта',
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
                    },
                    reference: 'fiatCurrencyAddField',
                    listeners: {
                        change: 'comboChange',
                    }
                },
                {
                    xtype: 'numberfield',
                    label: 'Процент корректировки',
                    tooltip: 'Положительное значение для скидки, отрицательное для надбавки.',
                    reference: 'personalDiscountAddField',
                    listeners: {
                        change: 'comboChange'
                    }
                },
                {
                    xtype: 'container',
                    reference: 'fiatAmountFieldContainer',
                    layout: 'fit',
                    items: [
                        {
                            xtype: 'numberfield',
                            reference: 'fiatAmountField',
                            label: 'Фиат сумма',
                            required: true,
                            requiredMessage: 'Введите сумму',
                            editable: false,
                            clearable: false,
                            triggers: {
                                calculate: {
                                    xtype: 'trigger',
                                    hidden: true,
                                    iconCls: 'x-fa fa-arrow-left',
                                    handler: 'calculateCryptoAmount'
                                }
                            },
                            listeners: {
                                focus: function () {
                                    let value = ExtUtil.referenceQuery('fiatAmountField').getValue()
                                    if (!value) return
                                    navigator.clipboard.writeText(value)
                                    ExtMessages.topToast('Фиатная сумма скопирована в буфер обмена')
                                }
                            }
                        },
                    ]
                },
                {
                    margin: '20 15 0 15',
                    xtype: 'checkbox',
                    reference: 'enterInFiatCheckbox',
                    label: 'Ввод в фиате',
                    listeners: {
                        change: 'checkBoxChange'
                    }
                }
            ]
        }
    ]
})