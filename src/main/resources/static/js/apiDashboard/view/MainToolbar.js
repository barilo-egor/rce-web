Ext.define('ApiDashboard.view.MainToolbar', {
    extend: 'Ext.Panel',
    xtype: 'maintoolbar',
    requires: [
        'ApiDashboard.view.statistic.DealStatisticDialog'
    ],

    shadow: true,

    tbar: [
        {
            text: TITLE
        },
        '->',
        {
            text: 'Расчёты'
        },
        {
            text: 'Статистика',
            handler: function (me) {
                Ext.create('ApiDashboard.view.statistic.DealStatisticDialog').show()
            }
        },
        {
            text: 'Документация',
            handler: function (me) {
                window.open('/api/10/documentation')
            }
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
            text: 'Уведомления'
        },
        {
            menu: [
                {
                    text: 'Профиль'
                },
                {
                    text: 'Выйти из аккаунта',
                    handler: function (me) {
                        window.location = '/logout'
                    }
                }
            ],
            listeners: {
                painted: function (me) {
                    ExtUtil.mRequest({
                        url: '/dashboard/api/util/getUsername',
                        method: 'GET',
                        success: function (response) {
                            me.setText(response.body.data.username)
                        }
                    })
                }
            }
        }
    ]
})