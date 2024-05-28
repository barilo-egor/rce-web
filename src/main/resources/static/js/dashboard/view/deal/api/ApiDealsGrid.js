Ext.define('Dashboard.view.deal.api.ApiDealsGrid', {
    extend: 'Ext.Panel',
    xtype: 'apidealsgrid',
    reference: 'apiDealsGrid',

    requires: [
        'Dashboard.view.deal.api.ApiDealsController',
        'Dashboard.view.deal.api.ApiDealsGridMenu'
    ],
    controller: 'apiDealsController',

    flex: 1,
    shadow: true,
    margin: '5 5 10 10',
    layout: 'fit',
    tbar: {
        items: [
            {
                iconCls: 'x-fa fa-plus forestgreenColor',
                tooltip: 'Добавление ручных сделок',
            },
            {
                iconCls: 'x-fa fa-file-excel darkGreen',
                tooltip: 'Экспорт сделок в Excel',
                handler: function (me) {
                    ExtUtil.mRequest({
                        url: '/deal/bot/beforeExport',
                        jsonData: Ext.getStore('botDealStore').getFiltersFromPanel(),
                        success: function (response) {
                            if (response.body.data.success) {
                                window.open('/deal/bot/export')
                            } else {
                                ExtMessages.topToast('Ошибка при экспорте сделок.')
                            }
                        }
                    })
                }
            }
        ]
    },
    items: [
        {
            xtype: 'grid',
            reference: 'apiDealsGrid',
            store: Ext.create('Dashboard.store.deal.bot.BotDealStore'),
            plugins: {
                pagingtoolbar: true
            },
            listeners: {
                childcontextmenu: function (me, eObj) {
                    me.deselectAll();
                    me.setSelection(eObj.record);
                    if (!me.menu) {
                        me.menu = Ext.create('Dashboard.view.deal.bot.ApiDealsGridMenu')
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
                    ExtUtil.mask('apiUserInfoPanel', 'Обновление данных')
                    let userInfoPanel = ExtUtil.referenceQuery('apiUserInfoPanel')
                    if (!ExtUtil.referenceQuery('chooseDealContainer').getHidden() && userInfoPanel.getCollapsed()) {
                        userInfoPanel.expand()
                    }
                    let user = selected[0].getData().user
                    ExtUtil.referenceQuery('chooseDealContainer').setHidden(true)
                    ExtUtil.referenceQuery('userInfoFieldsContainer').setHidden(false)
                    ExtUtil.referenceQuery('chatIdDisplayField').setValue(user.chatId)
                    ExtUtil.referenceQuery('usernameDisplayField').setValue(user.username ? user.username : 'Скрыт')
                    ExtUtil.referenceQuery('banDisplayField').setValue(user.banned ? 'Да' : 'Нет')
                    ExtUtil.referenceQuery('fromChatIdDisplayField').setValue(user.fromChatId ? user.FromChatId : 'Отсутствует')
                    ExtUtil.referenceQuery('referralBalanceDisplayField').setValue((user.referralBanalnce ? user.referralBanalnce : '0') + 'р.')
                    ExtUtil.referenceQuery('referralPercentDisplayField').setValue(user.referralPercent + "%")
                    ExtUtil.referenceQuery('isRankDiscountOnDisplayField').setValue(user.rankDiscountOn ? "Включена" : "Выключена")
                    ExtUtil.referenceQuery('personalBuyDisplayField').setValue((user.personalBuy ? user.personalBuy : "0") + "%")
                    ExtUtil.referenceQuery('personalSellDisplayField').setValue((user.personalSell ? user.personalSell : "0") + "%")
                    ExtUtil.referenceQuery('referralUsersCountDisplayField').setValue(user.referralUsersCount + " рефералов")
                    ExtUtil.referenceQuery('isActiveDisplayField').setValue(user.active === false ? 'Нет' : 'Да')
                    ExtUtil.referenceQuery('dealsCountDisplayField').setValue(user.dealsCount + " сделок")
                    ExtUtil.referenceQuery('registrationDateDisplayField').setValue(user.registrationDate)
                    ExtUtil.maskOff('apiUserInfoPanel')
                },
                painted: function(me) {
                    me.getStore().load()
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
                    dataIndex: 'dealStatus',
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
                    dataIndex: 'paymentType.name',
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
                    dataIndex: 'wallet',
                    flex: 1
                }
            ]
        }
    ]
})