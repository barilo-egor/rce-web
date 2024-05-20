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
            iconCls: 'x-fa fa-check-circle'
        },
        {
            text: 'Запросить верификацию',
            reference: 'additionalVerificationMenuButton',
            iconCls: 'x-fa fa-user-check'
        }
    ]
})