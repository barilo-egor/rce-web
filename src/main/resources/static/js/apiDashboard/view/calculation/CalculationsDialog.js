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
            plugins: {
                pagingtoolbar: true
            },

            listeners: {
                painted: function(me) {
                    me.getRootNode().expand()
                }
            },

            columns: [
                {
                    xtype: 'treecolumn',
                    width: 50
                },
                {
                    text: 'Дата и время',
                    dataIndex: 'dateTime',
                    width: 150
                },
                {
                    text: 'Кол-во сделок',
                    dataIndex: 'dealsCount',
                    width: 120
                },
                {
                    text: 'Тип сделки',
                    dataIndex: 'dealType',
                    width: 120
                },
                {
                    text: 'Фиатная валюта',
                    dataIndex: 'fiatCurrency',
                    width: 130
                },
                {
                    text: 'Криптовалюта',
                    dataIndex: 'cryptoCurrency',
                    width: 120
                },
                {
                    text: 'Сумма в фиате',
                    dataIndex: 'totalFiatSum',
                    width: 120
                },
                {
                    text: 'Сумма в крипте',
                    dataIndex: 'totalCryptoSum',
                    width: 130
                }
            ]
        }
    ]
})