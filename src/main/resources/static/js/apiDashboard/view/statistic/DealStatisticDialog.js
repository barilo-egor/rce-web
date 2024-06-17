Ext.define('ApiDashboard.view.statistic.DealStatisticDialog', {
    extend: 'Ext.Dialog',
    requires: [
    ],

    closable: true,
    title: 'Статистика сделок',

    minWidth: 900,

    layout: {
        type: 'vbox',
        align: 'center'
    },
    items: [
        {
            xtype: 'container',
            margin: '0 0 20 0',
            width: '97%',

            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [
                {
                    flex: 0.3,
                    xtype: 'container',

                    layout: {
                        type: 'vbox',
                        align: 'left'
                    },
                    items: [
                        {
                            flex: 0.5,
                            xtype: 'radiogroup',
                            listeners: {
                                change: function (me, newValue) {
                                    if (newValue === 2) {
                                        // ExtUtil.referenceQuery('idDeleteField').hide()
                                        me.getItems().items[0].setChecked(false)
                                    } else {
                                        // ExtUtil.referenceQuery('idDeleteField').show()
                                        me.getItems().items[1].setChecked(false)
                                    }
                                }
                            },
                            items: [
                                {
                                    label: 'За период',
                                    value: 1,
                                    checked: true
                                }
                            ]
                        },
                        {
                            xtype: 'combobox',
                            label: 'Период',
                            margin: '0 0 0 20'
                        }
                    ]
                },
                {
                    flex: 0.7,
                    xtype: 'container',

                    layout: {
                        type: 'vbox',
                        align: 'left'
                    },
                    items: [
                        {
                            flex: 0.5,
                            xtype: 'radiogroup',
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
                                    label: 'По дате',
                                    value: 2
                                }
                            ]
                        },
                        {
                            xtype: 'daterange',
                            margin: '0 0 0 20'
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'button',
            text: 'Загрузить',
            margin: '0 0 20 0'
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