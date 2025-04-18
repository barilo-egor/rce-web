Ext.define('Dashboard.view.deal.bot.pool.BitcoinPoolController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.bitcoinPoolController',
    requires: [
        'Dashboard.view.deal.bot.pool.BitcoinPoolGridMenu'
    ],

    show: function () {
        let controller = this
        let store = Ext.getStore('bitcoinPoolStore')
        ExtUtil.mask('bitcoinPoolTotalContainer', 'Загрузка')
        ExtUtil.referenceQuery('dealPoolSizeField').setValue(store.getTotalCount())
        let totalSum = 0
        store.getRange().forEach(record => totalSum = totalSum + Number(record.get('cryptoAmount')))
        ExtUtil.referenceQuery('dealPoolSumField').setValue(totalSum)
        ExtUtil.maskOff('bitcoinPoolTotalContainer')
        store.addListener('load', controller.setPoolSize)
        store.addListener('load', controller.setPoolSum)
        debugger
    },

    destroy: function () {
        let controller = this
        Ext.getStore('bitcoinPoolStore').removeListener('load', controller.setPoolSize)
        Ext.getStore('bitcoinPoolStore').removeListener('load', controller.setPoolSum)
        debugger
    },

    setPoolSize: function (store, records) {
        ExtUtil.referenceQuery('dealPoolSizeField').setValue(records.length)
    },

    setPoolSum: function (store, records) {
        let totalSum = 0
        records.forEach(record => totalSum = totalSum + Number(record.get('cryptoAmount')))
        ExtUtil.referenceQuery('dealPoolSumField').setValue(totalSum)
    },

    removeFromPool: function (grid, info) {
        ExtUtil.mRequest({
            url: '/deal/bot/removeFromPool?id=' + info.record.get('id'),
            method: 'DELETE',
            success: function (response) {

            }
        })
    },

    clearPool: function () {
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
    },

    poolWithdrawal: function () {
        let dealsSize = ExtUtil.referenceQuery('dealPoolSizeField').getValue()
        let totalAmount = ExtUtil.referenceQuery('dealPoolSumField').getValue()
        ExtMessages.confirm('Внимание', 'Вы собираетесь подтвердить и вывести все <b>' + dealsSize
            + '</b> сделок из пула на общую сумму <b>' + totalAmount + '</b> . Продолжить?',
            function () {
                ExtUtil.mask('bitcoinPoolDialog', 'Вывод пула')
                ExtUtil.mRequest({
                    url: '/deal/bot/completePool',
                    params: {
                        cryptoCurrency: 'BITCOIN'
                    },
                    loadingComponentRef: 'bitcoinPoolDialog',
                    success: function (response) {
                        ExtUtil.maskOff('bitcoinPoolDialog')
                        ExtUtil.referenceQuery('bitcoinPoolDialog').close()
                        ExtMessages.info('Информация', 'Сделки успешно выведены.')
                    }
                })
            })
    }
})