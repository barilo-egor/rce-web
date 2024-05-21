Ext.define('Dashboard.view.deal.bot.DealInfoPanel', {
    extend: 'Ext.panel.Accordion',
    xtype: 'dealinfopanel',
    reference: 'dealInfoPanel',

    title: 'Сделка',

    defaults: {
        xtype: 'panel'
    },
    collapsible: {
        direction: 'right',
        expandToolText: 'Развернуть',
        collapseToolText: 'Свернуть'
    },
    titleCollapse: false,
    scrollable: 'y',
    openable: 1,
    items: [
        {
            title: 'Информация о пользователе',
        },
        {
            title: 'Чек',
            reference: 'checkImageContainer',
            layout: 'hbox',
            border: true,
            html: 'Выберите сделку'
        },
        {
            title: 'Верификация',
            items: [
                {
                    xtype: 'container',
                    reference: 'additionalVerificationImageContainer',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    html: 'Выберите сделку'
                    // autoEl: {
                    //     tag: 'iframe',
                    //     src: '/image/getPDF?fileId=' + paymentReceipt.fileId,
                    //     width: '100%',
                    //     height: '100%',
                    // }
                },
            ]
        }
    ]
})