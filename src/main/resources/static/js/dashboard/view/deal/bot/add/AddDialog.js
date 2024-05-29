Ext.define('Dashboard.view.deal.bot.add.AddDialog', {
    extend: 'Ext.Dialog',
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
                    valueField: 'name',
                    store: {
                        type: 'dealTypesStore'
                    },
                    reference: 'dealTypeAddField',
                    listeners: {
                        painted: ExtUtil.forceComboFirstValue,
                        change: 'comboChange'
                    }
                },
                {
                    xtype: 'combobox',
                    label: 'Криптовалюта',
                    displayField: 'shortName',
                    editable: false,
                    valueField: 'name',
                    store: {
                        type: 'cryptoCurrenciesStore'
                    },
                    reference: 'cryptoCurrencyAddField',
                    listeners: {
                        painted: ExtUtil.forceComboFirstValue,
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
                            decimals: 8,
                            label: 'Сумма в крипте',
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
                    }
                }
            ]
        },
        {
            flex: 1,
            items: [
                {
                    xtype: 'combobox',
                    label: 'Фиатная валюта',
                    displayField: 'code',
                    valueField: 'name',
                    store: {
                        type: 'fiatCurrenciesStore'
                    },
                    reference: 'fiatCurrencyAddField',
                    listeners: {
                        painted: ExtUtil.forceComboFirstValue,
                    }
                },
                {
                    xtype: 'numberfield',
                    label: 'Процент корректировки',
                    tooltip: 'Положительное значение для скидки, отрицательное для надбавки.',
                    reference: 'personalDiscountAddField'
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
                            editable: false,
                            clearable: false,
                            triggers: {
                                calculate: {
                                    xtype: 'trigger',
                                    hidden: true,
                                    iconCls: 'x-fa fa-arrow-left',
                                    handler: 'calculateCryptoAmount'
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