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
    margin: '5 5 10 10',
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
                painted: function(me) {
                    const eventSource = new EventSource("/deal/bot/registerToListener");
                    eventSource.onmessage = e => {
                        let response = Ext.JSON.decode(e.data);
                        ExtMessages.topToast(response.message)
                        Ext.getStore('botDealStore').reload()
                    }
                    eventSource.onerror = () => console.log('Произошла ошибка SSE обновления сделок.');
                },
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
                    ExtUtil.mask('userInfoPanel', 'Обновление данных')
                    let userInfoPanel = ExtUtil.referenceQuery('userInfoPanel')
                    if (!ExtUtil.referenceQuery('chooseDealContainer').getHidden() && userInfoPanel.getCollapsed()) {
                        userInfoPanel.expand()
                    }
                    let user = selected[0].getData().user
                    ExtUtil.referenceQuery('chooseDealContainer').setHidden(true)
                    ExtUtil.referenceQuery('userInfoFieldsContainer').setHidden(false)
                    ExtUtil.referenceQuery('chatIdDisplayField').setValue(user.chatId)
                    ExtUtil.referenceQuery('usernameDisplayField').setValue(user.username)
                    ExtUtil.referenceQuery('banDisplayField').setValue(user.banned ? 'Да' : 'Нет')
                    ExtUtil.referenceQuery('fromChatIdDisplayField').setValue(user.fromChatId ? user.FromChatId : 'Отсутствует')
                    ExtUtil.referenceQuery('referralBalanceDisplayField').setValue((user.referralBanalnce ? user.referralBanalnce : '0') + 'р.')
                    ExtUtil.referenceQuery('referralPercentDisplayField').setValue(user.referralPercent + "%")
                    ExtUtil.referenceQuery('referralUsersCountDisplayField').setValue(user.referralUsersCount + " рефералов")
                    ExtUtil.referenceQuery('isActiveDisplayField').setValue(user.active === false ? 'Нет' : 'Да')
                    ExtUtil.referenceQuery('dealsCountDisplayField').setValue(user.dealsCount + " сделок")
                    ExtUtil.referenceQuery('registrationDateDisplayField').setValue(user.registrationDate)
                    ExtUtil.maskOff('userInfoPanel')
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
                    width: 180,
                    cell: {
                        encodeHtml: false
                    },
                    renderer: function (val) {
                        return '<span class="' + val.color + '">' + val.displayName + '</span>'
                    }
                },
                {
                    text: 'Тип оплаты',
                    dataIndex: 'paymentType',
                    flex: 0.6
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
                    width: 150
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
                }
            ]
        }
    ]
})