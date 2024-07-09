Ext.define('Dashboard.view.deal.bot.BotDealsGridMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'botdealsgridmenu',

    listeners: {
        beforeshow: function (me) {
            let deal = me.getViewModel().getData().deal.getData()
            let status = deal.dealStatus.name
            let createType = deal.createType.name
            ExtUtil.referenceQuery('copyRequisiteMenuButton')
                .setHidden(createType === 'MANUAL')
            ExtUtil.referenceQuery('showCheckMenuButton')
                .setHidden(createType === 'MANUAL')
            ExtUtil.referenceQuery('confirmDealMenuButton')
                .setHidden(!(status === 'PAID' || status === 'AWAITING_VERIFICATION' || status === 'VERIFICATION_RECEIVED' || status === 'VERIFICATION_REJECTED') || createType === 'MANUAL')
            ExtUtil.referenceQuery('confirmDealWithRequestMenuButton')
                .setHidden(!(status === 'PAID' || status === 'AWAITING_VERIFICATION' || status === 'VERIFICATION_RECEIVED' || status === 'VERIFICATION_REJECTED') || createType === 'MANUAL')
            ExtUtil.referenceQuery('additionalVerificationMenuButton')
                .setHidden(!(status === 'PAID' || status === 'VERIFICATION_REJECTED') || createType === 'MANUAL')
            ExtUtil.referenceQuery('showVerificationMenuButton')
                .setHidden(!(status === 'VERIFICATION_RECEIVED') || createType === 'MANUAL')
            ExtUtil.referenceQuery('deleteDealMenuButton')
                .setHidden(!(status === 'PAID' || status === 'AWAITING_VERIFICATION' || status === 'VERIFICATION_RECEIVED' || status === 'VERIFICATION_REJECTED' || createType === 'MANUAL'))
        }
    },

    items: [
        {
            text: 'Скопировать реквизит',
            reference: 'copyRequisiteMenuButton',
            iconCls: 'x-fa fa-copy',
            handler: function (me) {
                navigator.clipboard.writeText(ExtUtil.referenceQuery('botDealsGrid').getSelection().get('wallet'))
                ExtMessages.topToast('Реквизит скопирован в буфер обмена')
            }
        },
        {
            text: 'Скопировать фиат.сумму',
            reference: 'copyAmountMenuButton',
            iconCls: 'x-fa fa-copy',
            handler: function (me) {
                navigator.clipboard.writeText(ExtUtil.referenceQuery('botDealsGrid').getSelection().get('amount').split(' ')[0])
                ExtMessages.topToast('Фиат.сумма скопирована в буфер обмена')
            }
        },
        {
            text: 'Скопировать сумму крипты',
            reference: 'copyCryptoAmountMenuButton',
            iconCls: 'x-fa fa-copy',
            handler: function (me) {
                navigator.clipboard.writeText(ExtUtil.referenceQuery('botDealsGrid').getSelection().get('cryptoAmount').split(' ')[0])
                ExtMessages.topToast('Сумма крипты скопирована в буфер обмена')
            }
        },
        '-',
        {
            text: 'Показать чек',
            reference: 'showCheckMenuButton',
            iconCls: 'x-fa fa-receipt lightBlue',
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
                                        me.up('dialog').center()
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
                                        me.up('dialog').center()
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
            iconCls: 'x-fa fa-file-image violetColor',
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
                                    me.up('dialog').center()
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
            iconCls: 'x-fa fa-check-circle darkGreen',
            handler: function (me) {
                let deal = ExtUtil.referenceQuery('botDealsGrid').getSelection().getData()
                let confirmFn = function () {
                    ExtUtil.mRequest({
                        url: '/deal/bot/confirm',
                        params: {
                            pid: deal.pid
                        },
                        success: function (response) {
                            Ext.getStore('botDealStore').reload()
                        }
                    })
                }
                ExtMessages.confirm('Подтверждение сделки', 'Вы действительно хотите подтвердить сделку №' + deal.pid + '?',
                    confirmFn)
            }
        },
        {
            text: 'Подтвердить с запросом',
            reference: 'confirmDealWithRequestMenuButton',
            iconCls: 'x-fa fa-check-circle darkGreen',
            handler: function (me) {
                let deal = ExtUtil.referenceQuery('botDealsGrid').getSelection().getData()
                let confirmFn = function () {
                    ExtUtil.mRequest({
                        url: '/deal/bot/confirm',
                        params: {
                            pid: deal.pid,
                            isNeedRequest: true
                        },
                        success: function (response) {
                            Ext.getStore('botDealStore').reload()
                        }
                    })
                }
                ExtMessages.confirm('Подтверждение сделки', 'Вы действительно хотите подтвердить сделку №' + deal.pid + ' и отправить запрос на вывод?',
                    confirmFn)
            }
        },
        {
            text: 'Запросить верификацию',
            reference: 'additionalVerificationMenuButton',
            iconCls: 'x-fa fa-user-check violetColor',
            handler: function (me) {
                let deal = ExtUtil.referenceQuery('botDealsGrid').getSelection().getData()
                let verificationFn = function () {
                    ExtUtil.mRequest({
                        url: '/deal/bot/askVerification',
                        params: {
                            pid: deal.pid
                        },
                        success: function (response) {
                            Ext.getStore('botDealStore').reload()
                        }
                    })
                }
                ExtMessages.confirm('Дополнительная верификация', 'Вы действительно хотите запросить верификацию по сделке №' + deal.pid + '?',
                    verificationFn)
            },
        },
        {
            text: 'Удалить',
            reference: 'deleteDealMenuButton',
            iconCls: 'x-fa fa-trash-alt redColor',
            handler: function (me) {
                let deal = ExtUtil.referenceQuery('botDealsGrid').getSelection().getData()
                let confirmFn = function (isBanUser) {
                    ExtUtil.mRequest({
                        url: '/deal/bot/delete',
                        params: {
                            pid: deal.pid,
                            isBanUser: isBanUser
                        },
                        success: function (response) {
                            Ext.getStore('botDealStore').reload()
                        }
                    })
                }
                Ext.create('Ext.Dialog', {
                    title: 'Удаление сделки',
                    closable: true,
                    buttonAlign: 'center',
                    buttons: [
                        {
                            text: 'Да',
                            handler: function (me) {
                                confirmFn(ExtUtil.referenceQuery('isBanUserCheckbox').getChecked())
                                me.up('dialog').close()
                            }
                        },
                        {
                            text: 'Нет',
                            handler: function (me) {
                                me.up('dialog').close()
                            }
                        }
                    ],

                    layout: {
                        type: 'vbox',
                        align: 'center',
                        pack: 'middle'
                    },
                    items: [
                        {
                            xtype: 'container',
                            html: 'Вы действительно хотите удалить сделку №' + deal.pid + '?'
                        },
                        {
                            xtype: 'checkbox',
                            reference: 'isBanUserCheckbox',
                            label: 'Также забанить пользователя',
                            labelWidth: 190,
                            labelAlign: 'right'
                        }
                    ]

                }).show()
            }
        }
    ]
})