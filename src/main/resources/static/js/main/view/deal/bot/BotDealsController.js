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
    },

    askVerification: function (btn) {
        let dealPid = btn.up('window').getViewModel().getData().deal.pid
        ExtUtil.request({
            url: '/web/deal/bot/askVerification',
            params: {
                dealPid: dealPid
            },
            success: function (response) {
                btn.up('window').close()
            }
        })
    },

    showVerification: function (btn) {
        Ext.create('Main.view.components.ImageWindow', {
            items: [
                {
                    xtype: 'image',
                    scrollable: true,
                    bind: {
                        src: '/image/get?imageId=' + btn.up('window').getViewModel().getData().deal.additionalVerificationImageId
                    },
                    width: '100%',
                    height: 'auto',
                }
            ]
        })
    },

    showCheck: function (btn) {
        let paymentReceipts = btn.up('window').getViewModel().getData().deal.paymentReceipts
        let items = []
        for (let paymentReceipt of paymentReceipts) {
            if (paymentReceipt.format === 'PDF') {
                items.push(
                    {
                        modal: true,
                        closeAction: 'hide',
                        width: '100%',
                        height: '100%',
                        items: [
                            {
                                xtype: 'box',
                                scrollable: true,
                                autoEl: {
                                    tag: 'iframe',
                                    src: '/image/getPDF?fileId=' + paymentReceipt.fileId,
                                    width: '100%',
                                    height: '100%',
                                }
                            },
                        ]
                    }
                )
            } else if (paymentReceipt.format === 'PICTURE') {
                items.push(
                    {
                        xtype: 'image',
                        src: '/image/get?imageId=' + paymentReceipt.fileId,
                        width: '100%',
                        height: 'auto',
                    }
                )
            }
        }
        Ext.create('Main.view.components.ImageWindow', {
            items: items
        })
    },

    copyRequisites: function (btn) {
        ExtUtil.toClipboard(ExtUtil.idQuery('userRequisitesField').getValue())
        Ext.toast('Реквизиты скопированы в буфер обмена.')
    },

    copyChatId: function (btn) {
        ExtUtil.toClipboard(ExtUtil.idQuery('chatIdField').getValue())
        Ext.toast('Chat ID скопирован в буфер обмена.')
    },

    buildContact: function (me) {
        let username = me.up('window').getViewModel().getData().deal.username
        if (username && username !== 'Отсутствует') {
            me.setValue('<a href="https://t.me/' + username + '">' + username + '</a>')
        }
    },

    sendMessageWindow: function (btn) {
        let chatId = btn.up('window').getViewModel().getData().deal.chatId
        Ext.create('Main.view.deal.bot.SendMessageWindow', {
            viewModel: {
                data: {
                    chatId: chatId
                }
            },
        })
    }
})