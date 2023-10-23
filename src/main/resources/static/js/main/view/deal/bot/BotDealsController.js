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

    deleteDeal: function (btn) {
        Ext.create('Main.view.deal.bot.DeleteDealWindow', {
            viewModel: {
                data: {
                    pid: btn.up('window').getViewModel().getData().deal.pid
                }
            }
        })
    }
})