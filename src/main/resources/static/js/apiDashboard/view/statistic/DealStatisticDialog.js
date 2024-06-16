Ext.define('ApiDashboard.view.statistic.DealStatisticDialog', {
    extend: 'Ext.Dialog',
    requires: [
        'ApiDashboard.view.statistic.DealStatisticPanel'
    ],

    width: '50%',
    closable: true,
    title: 'Статистика сделок',

    layout: {
        type: 'vbox',
        align: 'center'
    },
    items: [
        {
            xtype: 'container',
            margin: '0 0 20 0',

            layout: {
                type: 'vbox'
            },
            items: [
                {
                    width: '100%',
                    xtype: 'radiogroup',
                    reference: 'deleteUserRadio',
                    listeners: {
                        change: function (me, newValue) {
                            if (newValue === 2) {
                                ExtUtil.referenceQuery('idDeleteField').hide()
                                me.getItems().items[0].setChecked(false)
                            } else {
                                ExtUtil.referenceQuery('idDeleteField').show()
                                me.getItems().items[1].setChecked(false)
                            }
                        }
                    },
                    items: [
                        {
                            label: 'Перенести сделки на другого пользователя',
                            width: 300,
                            value: 1,
                            checked: true
                        },
                        {
                            label: 'Удалить все сделки пользователя',
                            width: 230,
                            value: 2
                        }
                    ]
                }
            ]
        },
        {
            flex: 1,
            xtype: 'grid',
            minHeight: 205,
            width: '97%',
            margin: '0 10 0 0',
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