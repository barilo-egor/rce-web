Ext.define('ApiDashboard.view.calculation.CalculationsDialog', {
    extend: 'Ext.Dialog',

    title: 'Предыдущие расчёты',
    closable: true,
    height: '60%',
    minHeight: 300,

    layout: 'fit',
    items: [
        {
            xtype: 'tree',
            scrollable: true,
            bind: {
                store: '{store}'
            },

            listeners: {
                painted: function(me) {
                    me.getRootNode().expand()
                }
            },

            columns: [
                {
                    xtype: 'treecolumn',
                    width: 50,
                    menuDisabled: true,
                },
                {
                    text: 'Дата и время',
                    dataIndex: 'dateTime',
                    width: 150,
                    menuDisabled: true,
                },
                {
                    text: 'Кол-во сделок',
                    dataIndex: 'dealsCount',
                    width: 120,
                    menuDisabled: true,
                },
                {
                    text: 'Тип сделки',
                    dataIndex: 'dealType',
                    width: 120,
                    menuDisabled: true,
                },
                {
                    text: 'Фиатная валюта',
                    dataIndex: 'fiatCurrency',
                    width: 130,
                    menuDisabled: true,
                },
                {
                    text: 'Криптовалюта',
                    dataIndex: 'cryptoCurrency',
                    width: 120,
                    menuDisabled: true,
                },
                {
                    text: 'Сумма в фиате',
                    dataIndex: 'totalFiatSum',
                    width: 120,
                    menuDisabled: true,
                },
                {
                    text: 'Сумма в крипте',
                    dataIndex: 'totalCryptoSum',
                    width: 130,
                    menuDisabled: true,
                }
            ]
        }
    ]
})