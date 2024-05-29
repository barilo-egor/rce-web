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
                    required: true,
                    valueField: 'name',
                    store: {
                        type: 'dealTypesStore'
                    },
                    reference: 'dealTypeAddField',
                    listeners: {
                        painted: ExtUtil.forceComboFirstValue,
                        change: 'comboChange'
                    },
                    validators: ValidatorUtil.validateNotEmpty
                },
                {
                    xtype: 'combobox',
                    label: 'Криптовалюта',
                    displayField: 'shortName',
                    editable: false,
                    required: true,
                    valueField: 'name',
                    store: {
                        type: 'cryptoCurrenciesStore'
                    },
                    reference: 'cryptoCurrencyAddField',
                    listeners: {
                        painted: ExtUtil.forceComboFirstValue,
                        change: 'comboChange',
                    },
                    validators: ValidatorUtil.validateNotEmpty
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
                            },
                            validators: ValidatorUtil.validateNotEmpty
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
                    store: {
                        type: 'fiatCurrenciesStore'
                    },
                    reference: 'fiatCurrencyAddField',
                    listeners: {
                        painted: ExtUtil.forceComboFirstValue,
                    },
                    validators: ValidatorUtil.validateNotEmpty
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
                            validators: ValidatorUtil.validateNotEmpty
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