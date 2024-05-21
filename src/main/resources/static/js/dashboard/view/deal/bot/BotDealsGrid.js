Ext.define('Dashboard.view.deal.bot.BotDealsGrid', {
    extend: 'Ext.Panel',
    xtype: 'botdealsgrid',
    reference: 'botDealsGrid',

    requires: [
        'Dashboard.view.deal.bot.BotDealsController',
        'Dashboard.view.deal.bot.GridMenu'
    ],
    controller: 'botDealsController',

    flex: 1,
    shadow: true,
    margin: '10 10 10 10',
    layout: 'fit',
    tbar: {
        items: [
            {
                iconCls: 'x-fa fa-file-excel darkGreen'
            }
        ]
    },
    items: [
        {
            xtype: 'grid',
            reference: 'botDealsGrid',
            store: Ext.create('Dashboard.store.deal.bot.BotDealStore'),
            plugins: {
                pagingtoolbar: true
            },
            listeners: {
                childcontextmenu: function (me, eObj) {
                    me.deselectAll();
                    me.setSelection(eObj.record);
                    if (!me.menu) {
                        me.menu = Ext.create('Dashboard.view.deal.bot.GridMenu')
                    }
                    me.menu.setViewModel({
                        data: {
                            deal: eObj.record
                        }
                    })
                    me.menu.showAt(eObj.event.getX(), eObj.event.getY());
                    eObj.event.stopEvent()
                },
                select: function (me, selected) {
                    ExtUtil.mask('dealInfoPanel', 'Загрузка информации о сделке')
                    let deal = selected[0].getData()
                    let items = []
                    for (let paymentReceipt of deal.paymentReceipts) {
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
                                    src: '/image/get?imageId=' + paymentReceipt.fileId, // путь к вашей картинке
                                    width: '100%',
                                    height: 'auto',
                                    shadow: true,
                                    mode: 'image',
                                    listeners: {
                                        load: function (me) {
                                            ExtUtil.maskOff('dealInfoPanel')
                                        }
                                    }
                                }
                            )
                        }
                    }
                    let checkImageContainer = ExtUtil.referenceQuery('checkImageContainer')
                    let checkImageContainerItems = checkImageContainer.getItems().items
                    if (checkImageContainerItems.length > 0) checkImageContainerItems.forEach(item => item.destroy())
                    checkImageContainer.setHtml(null)
                    checkImageContainer.add(items)
                }
            },
            columns: [
                {
                    text: '№',
                    dataIndex: 'pid',
                    width: 60
                },
                {
                    text: 'Статус',
                    dataIndex: 'status',
                    width: 140,
                    renderer: function (val) {
                        return val.displayName
                    }
                },
                {
                    text: 'Тип оплаты',
                    dataIndex: 'paymentType',
                    flex: 1
                },
                {
                    text: 'Тип сделки',
                    dataIndex: 'dealType',
                    renderer: function (val) {
                        return val.displayName
                    }
                },
                {
                    text: 'Сумма в крипте',
                    dataIndex: 'cryptoAmount',
                    width: 120
                },
                {
                    text: 'Фиат сумма',
                    dataIndex: 'amount'
                },
                {
                    text: 'Доставка',
                    dataIndex: 'deliveryType'
                },
                {
                    text: 'Дата и время',
                    dataIndex: 'dateTime',
                    width: 150
                },
                {
                    text: 'Реквизит',
                    dataIndex: 'requisite',
                    flex: 1
                },
                {
                    text: 'Chat id',
                    dataIndex: 'user',
                    renderer: function (val) {
                        return val.chatId
                    }
                }
            ]
        }
    ]
})