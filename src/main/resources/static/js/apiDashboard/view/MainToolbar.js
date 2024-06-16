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
            text: 'Статистика',
            handler: function (me) {
                Ext.create('ApiDashboard.view.statistic.DealStatisticDialog').show()
            }
        },
        {
            text: 'Уведомления'
        },
        {
            menu: [
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