Ext.define('ApiDashboard.view.MainToolbar', {
    extend: 'Ext.Panel',
    xtype: 'maintoolbar',
    requires: [
        'ApiDashboard.view.statistic.DealStatisticDialog',
        'ApiDashboard.view.MainToolbarController',
        'ApiDashboard.view.NotificationsToolTip'
    ],
    controller: 'mainToolbarController',

    shadow: true,

    tbar: [
        {
            text: TITLE,
            listeners: {
                painted: 'painted'
            }
        },
        '->',
        {
            text: 'Расчёты',
            handler: 'calculationsHandler'
        },
        {
            text: 'Статистика',
            handler: 'statisticHandler'
        },
        {
            text: 'Документация',
            handler: 'documentationHandler'
        },
        {
            xtype: 'component',
            html: '|',
            style: {
                'margin-left': '10px',
                'margin-right': '10px',
                'color': 'gray'
            }
        },
        {
            text: 'Уведомления',
            reference: 'notificationsButton',
            tooltip: Ext.create('ApiDashboard.view.NotificationsToolTip')
        },
        {
            menu: [
                {
                    text: 'Профиль',
                    handler: 'profileHandler'
                },
                {
                    text: 'Выйти из аккаунта',
                    handler: 'logout'
                }
            ],
            listeners: {
                painted: 'setUsername'
            }
        }
    ]
})