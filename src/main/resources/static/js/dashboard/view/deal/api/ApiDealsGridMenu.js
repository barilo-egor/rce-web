Ext.define('Dashboard.view.deal.api.ApiDealsGridMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'apidealsgridmenu',

    listeners: {
        beforeshow: function (me) {
            let deal = me.getViewModel().getData().deal.getData()
            let status = deal.dealStatus.name
            ExtUtil.referenceQuery('confirmDealMenuButton')
                .setHidden(!(status === 'PAID'))
            ExtUtil.referenceQuery('declineDealMenuButton')
                .setHidden(!(status === 'PAID'))
        }
    },

    items: [
        {
            text: 'Скопировать реквизит',
            iconCls: 'x-fa fa-copy',
            handler: function (me) {
                navigator.clipboard.writeText(ExtUtil.referenceQuery('apiDealsGrid').getSelection().get('requisite'))
                ExtMessages.topToast('Реквизит скопирован в буфер обмена')
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
                        url: '/deal/api/accept',
                        params: {
                            pid: deal.pid
                        },
                        success: function (response) {
                            Ext.getStore('apiDealStore').reload()
                        }
                    })
                }
                ExtMessages.confirm('Подтверждение сделки', 'Вы действительно хотите подтвердить сделку №' + deal.pid + '?',
                    confirmFn)
            }
        },
        {
            text: 'Отклонить',
            reference: 'declineDealMenuButton',
            iconCls: 'x-fa fa-times-circle redColor',
            handler: function (me) {
                let deal = ExtUtil.referenceQuery('botDealsGrid').getSelection().getData()
                let confirmFn = function () {
                    ExtUtil.mRequest({
                        url: '/deal/api/decline',
                        params: {
                            pid: deal.pid
                        },
                        success: function (response) {
                            Ext.getStore('apiDealStore').reload()
                        }
                    })
                }
                ExtMessages.confirm('Подтверждение сделки', 'Вы действительно хотите отклонить сделку №' + deal.pid + '?',
                    confirmFn)
            }
        }
    ]
})