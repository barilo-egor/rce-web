Ext.define('ApiDashboard.view.statistic.DealStatisticDialog', {
    extend: 'Ext.Dialog',
    requires: [
    ],

    closable: true,
    title: 'Статистика сделок',

    minWidth: 700,

    layout: {
        type: 'vbox',
        align: 'center'
    },
    items: [
        {
            xtype: 'daterange',
            margin: '0 0 20 0'
        },
        {
            xtype: 'button',
            text: 'Загрузить',
            margin: '0 0 30 0'
        },
        {
            flex: 1,
            xtype: 'grid',
            emptyText: 'Выберите дату и нажмите "Загрузить"',
            store: {
                storeId: 'statisticStore',
                data: []
            },
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