const MENU_ITEMS = {
    BOT_DEALS: 'Сделки из бота',
    API_DEALS: 'API сделки',
    WEB_USERS: 'WEB пользователи',
    API_USERS: 'API клиенты',
    API_PAYMENT_TYPES: 'API типы оплат',
    REVIEWS: 'Отзывы',
    PAYMENT_TYPES: 'Типы оплат',
    MESSAGES_TEXT: 'Текста сообщений',
    BALANCE_AUDIT: 'Изменения баланса'
}

Ext.define('Dashboard.view.main.DashboardNavigation', {
    extend: 'Ext.Panel',
    xtype: 'dashboardnavigation',
    reference: 'dashboardNavigation',
    requires: [
        'Dashboard.view.main.DashboardController',
        'Ext.list.Tree',
        'Dashboard.view.deal.bot.BotDealsContainer',
        'Dashboard.view.deal.api.ApiDealsContainer',
        'Dashboard.view.users.web.WebUsersContainer',
        'Dashboard.view.users.api.ApiUsersContainer',
        'Dashboard.view.paymentTypes.api.ApiPaymentTypesContainer',
        'Dashboard.view.deal.review.ReviewContainer',
        'Dashboard.view.paymentTypes.bot.PaymentTypesContainer',
        'Dashboard.view.design.message.MessagesTextContainer',
        'Dashboard.view.audit.balance.BalanceAuditContainer'
    ],
    controller: 'dashboardController',

    title: 'Навигация',
    margin: '5 5 10 10',
    shadow: true,
    scrollable: true,

    collapsible: ExtUtilConfig.getCollapsible('left'),

    items: [
        {
            xtype: 'treelist',
            reference: 'treelist',

            height: '100%',
            ui: 'nav',
            listeners: {
                painted: function (me) {
                    me.setSelection('botDealsMenuNode')
                },
                itemclick: function (sender, info) {
                    if (!info.item.getLeaf()) return
                    let xtype
                    switch (info.item.getText()) {
                        case MENU_ITEMS.BOT_DEALS:
                            xtype = 'botdealscontainer'
                            break
                        case MENU_ITEMS.API_DEALS:
                            xtype = 'apidealscontainer'
                            break
                        case MENU_ITEMS.WEB_USERS:
                            xtype = 'webuserscontainer'
                            break
                        case MENU_ITEMS.API_USERS:
                            xtype = 'apiuserscontainer'
                            break
                        case MENU_ITEMS.API_PAYMENT_TYPES:
                            xtype = 'apipaymenttypescontainer'
                            break
                        case MENU_ITEMS.REVIEWS:
                            xtype = 'reviewcontainer'
                            break
                        case MENU_ITEMS.PAYMENT_TYPES:
                            xtype = 'paymenttypescontainer'
                            break
                        case MENU_ITEMS.MESSAGES_TEXT:
                            xtype = 'messagestextcontainer'
                            break
                        case MENU_ITEMS.BALANCE_AUDIT:
                            xtype = 'balanceauditcontainer'
                            break
                    }
                    ExtUtil.referenceQuery('dashboardWorkspace').getItems().items.forEach(item => item.destroy())
                    ExtUtil.referenceQuery('dashboardWorkspace').add({
                        xtype: xtype
                    })
                }
            },

            store: {
                root: {
                    expanded: true,
                    children: [
                        {
                            text: 'Заявки',
                            iconCls: 'x-fa fa-list-alt',
                            expanded: true,
                            children: [
                                {
                                    text: MENU_ITEMS.BOT_DEALS,
                                    id: 'botDealsMenuNode',
                                    leaf: true,
                                    iconCls: 'x-fa fa-robot'
                                },
                                {
                                    text: MENU_ITEMS.API_DEALS,
                                    iconCls: 'x-fa fa-laptop-code',
                                    id: 'apiDealsMenuNode',
                                    leaf: true
                                },
                                {
                                    text: MENU_ITEMS.REVIEWS,
                                    iconCls: 'x-fa fa-comment-dots',
                                    id: 'reviewsMenuNode',
                                    leaf: true
                                }
                            ]
                        },
                        {
                            text: 'Пользователи',
                            iconCls: 'x-fa fa-users',
                            children: [
                                {
                                    text: MENU_ITEMS.WEB_USERS,
                                    iconCls: 'x-fa fa-user-tie',
                                    id: 'webUsersMenuNode',
                                    leaf: true
                                },
                                {
                                    text: MENU_ITEMS.API_USERS,
                                    iconCls: 'x-fa fa-laptop-code',
                                    id: 'apiUsersMenuNode',
                                    leaf: true
                                }
                            ]
                        },
                        {
                            text: 'Типы оплат',
                            iconCls: 'x-fa fa-money-check-alt',
                            children: [
                                {
                                    text: MENU_ITEMS.API_PAYMENT_TYPES,
                                    iconCls: 'x-fa fa-laptop-code',
                                    id: 'apiPaymentTypesMenuNode',
                                    leaf: true
                                },
                                {
                                    text: MENU_ITEMS.PAYMENT_TYPES,
                                    iconCls: 'x-fa fa-money-check-alt',
                                    id: 'securePaymentDetailsMenuNode',
                                    leaf: true
                                }
                            ]
                        },
                        {
                            text: 'Дизайн',
                            iconCls: 'x-fa fa-palette',
                            children: [
                                {
                                    text: MENU_ITEMS.MESSAGES_TEXT,
                                    iconCls: 'x-fa fa-comment-dots',
                                    id: 'messageTextMenuNode',
                                    leaf: true
                                }
                            ]
                        },
                        {
                            text: 'Аудит',
                            iconCls: 'x-fa fa-history',
                            children: [
                                {
                                    text: MENU_ITEMS.BALANCE_AUDIT,
                                    iconCls: 'x-fa fa-hand-holding-usd',
                                    id: 'balanceAuditMenuNode',
                                    leaf: true
                                }
                            ]
                        }
                    ]
                }
            },
        }
    ]
})