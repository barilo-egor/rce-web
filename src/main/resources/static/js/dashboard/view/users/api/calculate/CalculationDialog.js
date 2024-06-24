Ext.define('Dashboard.view.users.api.calculate.CalculationDialog', {
    extend: 'Common.dialog.CommonDialog',
    reference: 'calculationDialog',

    title: 'Расчёт клиента',
    titleAlign: 'center',
    closable: true,
    width: '45%',

    buttons: [
        {
            text: 'Подтвердить расчет',
            handler: function (me) {
                let lastDealPid = ExtUtil.referenceQuery('lastDealPidField').getValue()
                ExtMessages.confirm('Подтверждение расчета',
                    'Вы действительно хотите подтвердить расчет? Новой крайней расчетной сделкой станет сделка №'
                    + lastDealPid + '.',
                    function () {
                        ExtUtil.mask('calculationDialog')
                        ExtUtil.mRequest({
                            url: '/users/api/saveCalculation',
                            async: false,
                            params: {
                                lastPaidDealPid: lastDealPid,
                                userPid: ExtUtil.referenceQuery('apiUsersGrid').getSelection().get('pid')
                            },
                            success: function (response) {
                                ExtUtil.maskOff('calculationDialog')
                                ExtUtil.referenceQuery('calculationDialog').close()
                            }
                        })
                    })
            }
        }
    ],
    buttonAlign: 'center',

    listeners: {
        painted: function (me) {
            let userPid = ExtUtil.referenceQuery('apiUsersGrid').getSelection().get('pid')
            let lastPaidDeal
            let lastDeal
            let isEmpty = false
            ExtUtil.mRequest({
                url: '/deal/api/getCalculationDeals',
                method: 'GET',
                params: {
                    userPid: userPid
                },
                async: false,
                success: function (response) {
                    if (response.body.data.isEmpty) {
                        isEmpty = true
                    } else {
                        lastPaidDeal = response.body.data.lastPaidDeal
                        lastDeal = response.body.data.lastDeal
                    }
                }
            })
            if (isEmpty) {
                ExtMessages.error('Внимание', 'У пользователя отсутствуют сделки для расчёта, либо она одна.')
                me.close()
                return
            }

            ExtUtil.referenceQuery('lastDealPidField').setValue(lastDeal.pid)
            ExtUtil.referenceQuery('lastDealDateTimeField').setValue(lastDeal.dateTime)
            ExtUtil.referenceQuery('lastPaidDealPidField').setValue(lastPaidDeal.pid)
            ExtUtil.referenceQuery('lastPaidDealDateTimeField').setValue(lastPaidDeal.dateTime)

            Ext.getStore('calculationStore').load({
                params: {
                    currentDealPid: lastDeal.pid,
                    userPid: userPid
                }
            })
        }
    },

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'fieldset',
            title: 'Текущая крайняя сделка',

            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                flex: 0.5
            },
            items: [
                {
                    xtype: 'displayfield',
                    label: 'Номер сделки',
                    reference: 'lastDealPidField'
                },
                {
                    xtype: 'displayfield',
                    label: 'Дата и время',
                    reference: 'lastDealDateTimeField'
                }
            ]
        },
        {
            xtype: 'fieldset',
            title: 'Предыдущая расчетная сделка',
            margin: '0 0 35 0',

            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                flex: 0.5
            },
            items: [
                {
                    xtype: 'displayfield',
                    label: 'Номер сделки',
                    reference: 'lastPaidDealPidField'
                },
                {
                    xtype: 'displayfield',
                    label: 'Дата и время',
                    reference: 'lastPaidDealDateTimeField'
                }
            ]
        },
        {
            xtype: 'grid',
            minHeight: 205,
            scrollable: true,
            shadow: true,
            store: {
                storeId: 'calculationStore',
                fields: ['dealType', 'fiatCurrency', 'cryptoCurrency', 'totalFiatSum', 'totalCryptoSum'],
                autoLoad: false,
                proxy: {
                    type: 'ajax',
                    url: '/users/api/calculation',
                    reader: {
                        type: 'json',
                        rootProperty: 'body'
                    }
                }
            },
            columns: [
                {
                    text: 'Тип сделки',
                    dataIndex: 'dealType',
                    flex: 1
                },
                {
                    text: 'Фиатная валюта',
                    dataIndex: 'fiatCurrency',
                    flex: 1
                },
                {
                    text: 'Криптовалюта',
                    dataIndex: 'cryptoCurrency',
                    flex: 1
                },
                {
                    text: 'Сумма в фиате',
                    dataIndex: 'totalFiatSum',
                    flex: 1
                },
                {
                    text: 'Сумма в крипте',
                    dataIndex: 'totalCryptoSum',
                    flex: 1
                }
            ]
        }
    ]
})