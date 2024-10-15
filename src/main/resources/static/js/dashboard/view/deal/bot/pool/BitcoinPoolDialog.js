Ext.define('Dashboard.view.deal.bot.pool.BitcoinPoolDialog', {
    extend: 'Ext.Dialog',
    reference: 'bitcoinPoolDialog',
    requires: [
        'Dashboard.view.deal.bot.pool.BitcoinPoolGrid',
        'Dashboard.view.deal.bot.pool.BitcoinPoolController'
    ],
    controller: 'bitcoinPoolController',

    title: 'Пул BTC сделок',
    closable: true,
    width: 700,
    height: 500,
    emptyText: 'Сделки отсутствуют',

    layout: 'fit',

    buttons: [
        {
            xtype: 'button',
            text: 'Автовывод'
        },
        {
            xtype: 'button',
            text: 'Очистить пул',
            handler: function () {
                let dealsSize = Ext.getStore('bitcoinPoolStore').getTotalCount()
                ExtMessages.confirm('Внимание', 'Вы собираетесь удалить все <b>' + dealsSize + '</b> сделок из BTC пула. Продолжить?',
                    function () {
                        ExtUtil.mask('bitcoinPoolDialog', 'Очищается пул')
                        ExtUtil.mRequest({
                            url: '/deal/bot/clearPool',
                            params: {
                                cryptoCurrency: 'BITCOIN'
                            },
                            loadingComponentRef: 'bitcoinPoolDialog',
                            success: function (response) {
                                ExtUtil.maskOff('bitcoinPoolDialog')
                            }
                        })
                    })
            }
        }
    ],
    items: [
        {
            xtype: 'bitcoinpoolgrid'
        }
    ]
})