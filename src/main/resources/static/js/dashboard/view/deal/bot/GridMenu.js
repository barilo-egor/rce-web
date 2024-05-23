Ext.define('Dashboard.view.deal.bot.GridMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'botdealsgridmenu',

    listeners: {
        beforeshow: function (me) {
            let deal = me.getViewModel().getData().deal.getData()
            let status = deal.status.name
            ExtUtil.referenceQuery('confirmDealMenuButton')
                .setDisabled(!(status === 'PAID' || status === 'AWAITING_VERIFICATION' || status === 'VERIFICATION_RECEIVED'))
            ExtUtil.referenceQuery('additionalVerificationMenuButton')
                .setDisabled(!(status === 'PAID'))
            ExtUtil.referenceQuery('showVerificationMenuButton')
                .setDisabled(!(status === 'VERIFICATION_RECEIVED'))
        }
    },

    items: [
        {
            text: 'Скопировать реквизит',
            iconCls: 'x-fa fa-copy',
            handler: function (me) {
                navigator.clipboard.writeText(ExtUtil.referenceQuery('botDealsGrid').getSelection().get('requisite'))
                ExtMessages.topToast('Реквизит скопирован в буфер обмена')
            }
        },
        {
            text: 'Показать чек',
            reference: 'showCheckMenuButton',
            iconCls: 'x-fa fa-receipt',
            handler: function (me) {
                let deal = ExtUtil.referenceQuery('botDealsGrid').getSelection().getData()
                let paymentReceipt = deal.paymentReceipts[0]
                if (paymentReceipt.format === 'PICTURE') {
                    Ext.create('Ext.Dialog', {
                        title: 'Чек по заявке ' + deal.pid,
                        closable: true,
                        layout: 'fit',
                        maxHeight: '90%',
                        maxWidth: '90%',
                        scrollable: 'y',
                        masked: 'Загрузка чека',
                        items: [
                            {
                                xtype: 'image',
                                src: '/image/get?imageId=' + paymentReceipt.fileId,
                                width: '100%',
                                height: '100%',
                                shadow: true,
                                mode: 'image',
                                margin: '5 5 5 5',
                                listeners: {
                                    load: function (me) {
                                        me.up('dialog').setMasked(false)
                                    }
                                }
                            }
                        ]
                    }).show()
                } else {
                    Ext.create('Ext.Dialog', {
                        title: 'Чек по заявке ' + deal.pid,
                        closable: true,
                        layout: 'fit',
                        height: '90%',
                        width: '90%',
                        scrollable: 'y',
                        masked: 'Загрузка чека',
                        items: [
                            {
                                xtype: 'panel',
                                shadow: true,
                                scrollable: true,
                                html: '<iframe src="/image/getPDF?fileId=' + paymentReceipt.fileId
                                    + '" frameborder="0" style="display: block;overflow:visible;height:100vh;width:100vw"></iframe>',
                                listeners: {
                                    painted: function (me) {
                                        me.up('dialog').setMasked(false)
                                    }
                                }
                            }
                        ]
                    }).show()
                }
            }
        },
        {
            text: 'Показать верификацию',
            iconCls: 'x-fa fa-file-image',
            reference: 'showVerificationMenuButton',
            handler: function (me) {
                let deal = ExtUtil.referenceQuery('botDealsGrid').getSelection().getData()
                Ext.create('Ext.Dialog', {
                    title: 'Верификация по заявке ' + deal.pid,
                    closable: true,
                    layout: 'fit',
                    maxHeight: '90%',
                    maxWidth: '90%',
                    scrollable: 'y',
                    masked: 'Загрузка изображения верификации',
                    items: [
                        {
                            xtype: 'image',
                            src: '/image/get?imageId=' + deal.additionalVerificationImageId,
                            width: '100%',
                            height: '100%',
                            shadow: true,
                            mode: 'image',
                            margin: '5 5 5 5',
                            listeners: {
                                load: function (me) {
                                    me.up('dialog').setMasked(false)
                                }
                            }
                        }
                    ]
                }).show()
            }
        },
        '-',
        {
            text: 'Подтвердить',
            reference: 'confirmDealMenuButton',
            iconCls: 'x-fa fa-check-circle',
            handler: function (me) {
                let deal = ExtUtil.referenceQuery('botDealsGrid').getSelection().getData()
                let confirmFn = function () {
                    ExtUtil.mRequest({
                        url: '/deal/bot/confirm',
                        params: {
                            pid: deal.pid
                        },
                        success: function (response) {
                        }
                    })
                }
                ExtMessages.confirm('Подтверждение сделки', 'Вы действительно хотите подтвердить сделку №' + deal.pid + '?',
                    confirmFn)
            }
        },
        {
            text: 'Запросить верификацию',
            reference: 'additionalVerificationMenuButton',
            iconCls: 'x-fa fa-user-check'
        }
    ]
})