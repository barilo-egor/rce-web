Ext.define('ApiDashboard.view.statistic.DealStatisticDialog', {
    extend: 'Common.dialog.CommonDialog',
    requires: [
        'ApiDashboard.view.statistic.DealStatisticController'
    ],
    controller: 'dealStatisticController',

    closable: true,
    title: 'Статистика подтвержденных сделок',

    tools: [
        ExtUtilConfig.getHelpDialogTool('Статистика',
            'Здесь вы можете посмотреть общую статистику <br>' +
            ' сделок в статусе "ACCEPTED"(Подтверждена оператором).<br>' +
            'При выборе диапазона дат сделки выбираются включительно <br>' +
            'каждую выбранную дату.<br>' +
            'Чтобы загрузить статистику за всё время, оставьте дату пустой.')
    ],

    layout: {
        type: 'vbox',
        align: 'center'
    },
    items: [
        {
            xtype: 'daterange',
            reference: 'statisticDateRange',
            margin: '0 0 20 0'
        },
        {
            xtype: 'button',
            text: 'Загрузить',
            margin: '0 0 30 0',
            handler: 'load'
        },
        {
            flex: 1,
            xtype: 'grid',
            emptyText: 'Выберите дату и нажмите "Загрузить"',
            store: {
                storeId: 'statisticStore',
                fields: ['dealType'],
                autoLoad: false,
                proxy: {
                    type: 'rest',
                    paramsAsJson: true,
                    actionMethods: {
                        read: 'POST'
                    },
                    url: '/dashboard/api/deal/statistic',
                    reader: {
                        type: 'json',
                        rootProperty: 'body'
                    }
                }
            },
            minHeight: 205,
            margin: '0 10 0 0',
            columns: [
                {
                    text: 'Тип сделки',
                    dataIndex: 'dealType',
                    width: 100,
                    menuDisabled: true,
                },
                {
                    text: 'Фиатная валюта',
                    dataIndex: 'fiatCurrency',
                    width: 140,
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
                },
                {
                    text: 'Количество сделок',
                    dataIndex: 'sumDealsCount',
                    width: 150,
                    menuDisabled: true,
                }
            ]
        }
    ]
})