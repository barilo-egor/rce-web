Ext.define('Dashboard.view.deal.bot.UserInfoPanel', {
    extend: 'Ext.Panel',
    xtype: 'userinfopanel',
    reference: 'userInfoPanel',

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
                    label: 'Chat id',
                    reference: 'chatIdDisplayField'
                },
                {
                    label: 'Username',
                    reference: 'usernameDisplayField'
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
                    label: 'Количество приведенных рефералов',
                    reference: 'referralUsersCountDisplayField'
                },
                {
                    label: 'Активен',
                    reference: 'isActiveDisplayField'
                },
                {
                    label: 'Количество проведенных сделок',
                    reference: 'dealsCountDisplayField'
                },
                {
                    label: 'Дата регистрации',
                    reference: 'registrationDateDisplayField'
                },
            ]
        }
    ]
})