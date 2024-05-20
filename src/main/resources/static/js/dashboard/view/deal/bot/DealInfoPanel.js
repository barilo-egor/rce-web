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
    openable: 3,
    items: [
        {
            title: 'Информация о пользователе',
            collapsible: {
                direction: 'top',
            }
        },
        {
            title: 'Чек',
            collapsible: {
                direction: 'top',
            },
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'middle'
            },
            items: [
                {
                    xtype: 'container',
                    reference: 'checkImageContainer',
                    layout: 'fit'
                },
            ]
        },
        {
            title: 'Верификация',
            collapsible: {
                direction: 'top',
            },
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