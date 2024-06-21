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
            text: 'Расчёты',
            handler: function (me) {
                ExtUtil.mRequest({
                    url: '/dashboard/api/calculation/hasCalculations',
                    method: 'GET',
                    success: function (response) {
                        if (response.body.data.hasCalculations === false) {
                            ExtMessages.topToast('У пользователя отсутствуют расчёты.')
                            return
                        }
                        let store = Ext.getStore('calculationsStore')
                        store.load({
                            callback: function() {
                                Ext.create('ApiDashboard.view.calculation.CalculationsDialog', {
                                    viewModel: {
                                        data: {
                                            store: store
                                        }
                                    }
                                }).show()
                            }
                        })
                    }
                })
            }
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