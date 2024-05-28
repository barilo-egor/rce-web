Ext.define('Dashboard.view.deal.bot.add.AddDialog', {
    extend: 'Ext.Dialog',
    requires: [
        'Dashboard.view.deal.bot.add.AddController'
    ],
    controller: 'addController',

    width: 600,
    padding: '0 20 40 20',
    closable: true,

    title: 'Добавление сделки',
    titleAlign: 'center',

    buttonAlign: 'center',
    buttons: [
        {
            text: 'Добавить'
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
                        painted: function (me) {
                            me.setValue(me.getStore().getAt(0))
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    label: 'Реквизит'
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
                        painted: function (me) {
                            me.setValue(me.getStore().getAt(0))
                        }
                    }
                },
                {
                    xtype: 'numberfield',
                    reference: 'cryptoAmountField',
                    decimals: 8,
                    label: 'Сумма в крипте',
                    listeners: {
                        change: function (me, newValue) {
                            if (newValue === 0) return
                            ExtUtil.mRequest({
                                url: '/deal/bot/calculate',
                                method: 'GET',
                                async: false,
                                params: {
                                    cryptoAmount: newValue,
                                    fiatCurrency: ExtUtil.referenceQuery('fiatCurrencyAddField').getValue(),
                                    cryptoCurrency: ExtUtil.referenceQuery('cryptoCurrencyAddField').getValue(),
                                    dealType: ExtUtil.referenceQuery('dealTypeAddField').getValue(),
                                    personalDiscount: ExtUtil.referenceQuery('personalDiscountAddField').getValue()
                                },
                                success: function (response) {
                                    me.setValue(response.body.data)
                                }
                            })
                        }
                    }
                },
                {
                    margin: '20 15 0 15',
                    xtype: 'checkbox',
                    label: 'Ввод в крипте',
                    checked: true,
                    reference: 'enterInCryptoCheckbox',
                    listeners: {
                        change: function (me, newValue) {
                            if (newValue) {
                                ExtUtil.referenceQuery('enterInAmountCheckbox').setChecked(false)
                                ExtUtil.referenceQuery('fiatAmountField').setValue(null)
                                ExtUtil.referenceQuery('cryptoAmountField').setEditable(false)
                                ExtUtil.referenceQuery('fiatAmountField').setEditable(true)
                            }
                        }
                    }
                }
            ]
        },
        {
            flex: 1,
            items: [
                {
                    xtype: 'combobox',
                    label: 'Доставка',
                    displayField: 'displayName',
                    editable: false,
                    valueField: 'name',
                    store: {
                        type: 'deliveryTypesStore'
                    },
                    reference: 'deliveryTypeFilterField',
                    listeners: {
                        painted: function (me) {
                            me.setValue(me.getStore().getAt(1))
                        }
                    }
                },
                {
                    xtype: 'numberfield',
                    label: 'Процент корректировки',
                    tooltip: 'Положительное значение для скидки, отрицательное для надбавки.',
                    reference: 'personalDiscountAddField'
                },
                {
                    xtype: 'combobox',
                    label: 'Фиатная валюта',
                    displayField: 'code',
                    editable: false,
                    valueField: 'name',
                    store: {
                        type: 'fiatCurrenciesStore'
                    },
                    reference: 'fiatCurrencyAddField',
                    listeners: {
                        painted: function (me) {
                            me.setValue(me.getStore().getAt(0))
                        }
                    }
                },
                {
                    xtype: 'numberfield',
                    reference: 'fiatAmountField',
                    label: 'Фиат сумма',
                    editable: false
                },
                {
                    margin: '20 15 0 15',
                    xtype: 'checkbox',
                    reference: 'enterInAmountCheckbox',
                    label: 'Ввод в фиате',
                    listeners: {
                        change: function (me, newValue) {
                            if (newValue) {
                                ExtUtil.referenceQuery('enterInCryptoCheckbox').setChecked(false)
                                ExtUtil.referenceQuery('cryptoAmountField').setValue(null)
                                ExtUtil.referenceQuery('fiatAmountField').setEditable(false)
                                ExtUtil.referenceQuery('cryptoAmountField').setEditable(true)
                            }
                        }
                    }
                }
            ]
        }
    ]
})