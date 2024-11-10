Ext.define('Dashboard.view.paymentTypes.bot.details.CreateSecurePaymentDetailsDialog', {
    extend: 'Ext.Dialog',
    reference: 'createSecurePaymentDetailsDialog',
    requires: [
        'Dashboard.view.paymentTypes.bot.details.SecurePaymentDetailsController',
    ],
    controller: 'securePaymentDetailsController',

    bind: {
        title: '{title}'
    },
    width: 400,
    closable: true,

    layout: 'fit',
    items: [
        {
            xtype: 'formpanel',

            jsonSubmit: true,
            buttons: [
                {
                    text: 'Сохранить',
                    handler: 'saveNewDetails'
                }
            ],
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'numberfield',
                    hidden: true,
                    name: 'pid',
                    bind: {
                        value: '{pid}'
                    }
                },
                {
                    xtype: 'numberfield',
                    reference: 'minDealCountField',
                    readOnly: true,
                    label: 'Количество сделок для отображения реквизита',
                    tooltip: 'Значение формируется автоматически',
                    name: 'minDealCount',
                    updateCount: function () {
                        let fiat = ExtUtil.referenceQuery('fiatCurrencyAddField').getValue()
                        if (fiat) {
                            this.setValue(this.up('dialog').getViewModel().getData().minDealCount[fiat])
                        }
                    },
                    listeners: {
                        painted: function (me) {
                            me.updateCount()
                        }
                    }
                },
                {
                    xtype: 'textareafield',
                    label: 'Реквизит',
                    height: 140,
                    bind: {
                        value: '{details}'
                    },
                    name: 'details',
                    required: true,
                    requiredMessage: 'Заполните реквизит.'
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
                                ExtUtil.referenceQuery('minDealCountField').updateCount()
                            }
                        }
                    },
                    listeners: {
                        change: function () {
                            ExtUtil.referenceQuery('minDealCountField').updateCount()
                        }
                    }
                }
            ]
        }
    ]
})