Ext.define('Dashboard.view.deal.api.ApiDealsGridMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'apidealsgridmenu',

    listeners: {
        beforeshow: function (me) {
            let deal = me.getViewModel().getData().deal.getData()
            let status = deal.status.name
            ExtUtil.referenceQuery('confirmDealMenuButton')
                .setHidden(!(status === 'PAID' || status === 'AWAITING_VERIFICATION' || status === 'VERIFICATION_RECEIVED' || status === 'VERIFICATION_REJECTED'))
            ExtUtil.referenceQuery('additionalVerificationMenuButton')
                .setHidden(!(status === 'PAID' || status === 'VERIFICATION_REJECTED'))
            ExtUtil.referenceQuery('showVerificationMenuButton')
                .setHidden(!(status === 'VERIFICATION_RECEIVED'))
            ExtUtil.referenceQuery('deleteDealMenuButton')
                .setHidden(!(status === 'PAID' || status === 'AWAITING_VERIFICATION' || status === 'VERIFICATION_RECEIVED' || status === 'VERIFICATION_REJECTED'))
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
                            Ext.getStore('botDealStore').reload()
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
            iconCls: 'x-fa fa-user-check',
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
            iconCls: 'x-fa fa-trash-alt',
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