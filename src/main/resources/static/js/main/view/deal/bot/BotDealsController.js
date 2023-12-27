Ext.define('Main.view.deal.bot.BotDealsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.botDealsController',

    showDeal: function (view, rowIndex, collIndex, item, e, record) {
        ExtUtil.request({
            url: '/web/deal/bot/get',
            params: {
                pid: record.get('pid')
            },
            method: 'GET',
            success: function (response) {
                Ext.create('Main.view.deal.bot.BotDealWindow', {
                    viewModel: {
                        data: {
                            deal: response.body.data
                        }
                    }
                })
            }
        })
    },

    deleteDealWindow: function (btn) {
        Ext.create('Main.view.deal.bot.DeleteDealWindow', {
            viewModel: {
                data: {
                    pid: btn.up('window').getViewModel().getData().deal.pid
                }
            }
        })
    },

    deleteDeal: function (btn) {
        ExtUtil.request({
            url: '/web/deal/bot/delete',
            params: {
                pid: btn.up('window').getViewModel().getData().pid,
                isBanUser: ExtUtil.idQuery('banUserCheckbox').getValue()
            },
            success: function (response) {
                btn.up('window').close()
                ExtUtil.idQuery('botDealWindow').close()
                Ext.getStore('botDealStore').reload()
            }
        })
    },

    confirmDeal: function (btn) {
        ExtUtil.request({
            url: '/web/deal/bot/confirm',
            params: {
                pid: btn.up('window').getViewModel().getData().deal.pid
            },
            success: function (response) {
                btn.up('window').close()
                Ext.getStore('botDealStore').reload()
            }
        })
    }
})