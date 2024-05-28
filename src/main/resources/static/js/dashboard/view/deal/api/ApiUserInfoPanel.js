Ext.define('Dashboard.view.deal.api.ApiUserInfoPanel', {
    extend: 'Ext.Panel',
    xtype: 'apiuserinfopanel',
    reference: 'apiUserInfoPanel',

    title: 'Пользователь',

    collapsible: {
        direction: 'right',
        expandToolText: 'Развернуть',
        collapseToolText: 'Свернуть'
    },
    titleCollapse: false,
    collapsed: true,
    openable: 1,
    layout: 'fit',
    items: [
        {
            xtype: 'container',
            reference: 'chooseDealContainer',
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'middle'
            },
            items: [
                {
                    xtype: 'component',
                    html: 'Выберите сделку'
                }
            ]
        },
        {
            xtype: 'container',
            reference: 'userInfoFieldsContainer',
            hidden: true,
            padding: '15 15 15 15',
            scrollable: true,

            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                xtype: 'displayfield'
            },
            items: [
                {
                    xtype: 'textfield',
                    editable: false,
                    label: 'Chat id',
                    triggers: null,
                    reference: 'chatIdDisplayField',
                    listeners: {
                        focus: function () {
                            navigator.clipboard.writeText(this.getValue())
                            ExtMessages.topToast('Chat id скопирован в буфер обмена')
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    label: 'Username',
                    reference: 'usernameDisplayField',
                    triggers: null,
                    editable: false,
                    listeners: {
                        focus: function () {
                            let value = this.getValue()
                            if (value !== 'Скрыт') {
                                navigator.clipboard.writeText(value)
                                ExtMessages.topToast('Username скопирован в буфер обмена')
                            }
                        }
                    }
                },
                {
                    label: 'Количество проведенных сделок',
                    reference: 'dealsCountDisplayField'
                },
                {
                    label: 'Бан',
                    reference: 'banDisplayField'
                },
                {
                    label: 'Чей реферал, chat id',
                    reference: 'fromChatIdDisplayField'
                },
                {
                    label: 'Реферальный баланс',
                    reference: 'referralBalanceDisplayField'
                },
                {
                    label: 'Процент реферальный отчислений',
                    reference: 'referralPercentDisplayField'
                },
                {
                    label: 'Ранговая скидка',
                    reference: 'isRankDiscountOnDisplayField'
                },
                {
                    label: 'Персональная скидка покупки',
                    reference: 'personalBuyDisplayField'
                },
                {
                    label: 'Персональная скидка продажи',
                    reference: 'personalSellDisplayField'
                },
                {
                    label: 'Количество приведенных рефералов',
                    reference: 'referralUsersCountDisplayField'
                },
                {
                    label: 'Активен',
                    reference: 'isActiveDisplayField'
                },
                {
                    label: 'Дата регистрации',
                    reference: 'registrationDateDisplayField'
                },
            ]
        }
    ]
})