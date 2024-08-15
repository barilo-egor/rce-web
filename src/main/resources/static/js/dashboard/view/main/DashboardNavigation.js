const MENU_ITEMS = {
    BOT_DEALS: 'Сделки из бота',
    API_DEALS: 'API сделки',
    WEB_USERS: 'WEB пользователи',
    API_USERS: 'API клиенты',
    API_PAYMENT_TYPES: 'API типы оплат',
    REVIEWS: 'Отзывы'
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
        'Dashboard.view.deal.review.ReviewContainer'
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
                    switch (info.item.getText()) {
                        case MENU_ITEMS.BOT_DEALS:
                            ExtUtil.referenceQuery('dashboardWorkspace').getItems().items.forEach(item => item.destroy())
                            ExtUtil.referenceQuery('dashboardWorkspace').add({
                                xtype: 'botdealscontainer'
                            })
                            break
                        case MENU_ITEMS.API_DEALS:
                            ExtUtil.referenceQuery('dashboardWorkspace').getItems().items.forEach(item => item.destroy())
                            ExtUtil.referenceQuery('dashboardWorkspace').add({
                                xtype: 'apidealscontainer'
                            })
                            break
                        case MENU_ITEMS.WEB_USERS:
                            ExtUtil.referenceQuery('dashboardWorkspace').getItems().items.forEach(item => item.destroy())
                            ExtUtil.referenceQuery('dashboardWorkspace').add({
                                xtype: 'webuserscontainer'
                            })
                            break
                        case MENU_ITEMS.API_USERS:
                            ExtUtil.referenceQuery('dashboardWorkspace').getItems().items.forEach(item => item.destroy())
                            ExtUtil.referenceQuery('dashboardWorkspace').add({
                                xtype: 'apiuserscontainer'
                            })
                            break
                        case MENU_ITEMS.API_PAYMENT_TYPES:
                            ExtUtil.referenceQuery('dashboardWorkspace').getItems().items.forEach(item => item.destroy())
                            ExtUtil.referenceQuery('dashboardWorkspace').add({
                                xtype: 'apipaymenttypescontainer'
                            })
                            break
                        case MENU_ITEMS.REVIEWS:
                            ExtUtil.referenceQuery('dashboardWorkspace').getItems().items.forEach(item => item.destroy())
                            ExtUtil.referenceQuery('dashboardWorkspace').add({
                                xtype: 'reviewcontainer'
                            })
                            break
                    }
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
                                }
                            ]
                        }
                    ]
                }
            },
        }
    ]
})