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
        store.getRange().forEach(record => totalSum = totalSum + record.get('cryptoAmount'))
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
        records.forEach(record => totalSum = totalSum + record.get('cryptoAmount'))
        ExtUtil.referenceQuery('dealPoolSumField').setValue(totalSum)
    },

    removeFromPool: function (grid, info) {
        ExtUtil.mRequest({
            url: '/deal/bot/removeFromPool?pid=' + info.record.get('pid'),
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
    }
})