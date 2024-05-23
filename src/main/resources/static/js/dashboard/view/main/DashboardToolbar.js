Ext.define('Dashboard.view.main.DashboardToolbar', {
    extend: 'Ext.Panel',
    xtype: 'dashboardtoolbar',

    margin: '10 10 5 10',
    shadow: true,
    tbar: [
        {
            iconCls: 'x-fa fa-link',
            listeners: {
                painted: function (me) {
                    ExtUtil.mRequest({
                        url: '/properties/getPropertiesValues',
                        method: 'GET',
                        params: {
                            propertiesPath: 'BOT_PROPERTIES',
                            keys: ['bot.name', 'bot.link']
                        },
                        success: function (response) {
                            let value = response.body.data[0].value
                            me.setText(value ? value : 'Обменник')
                            me.setHandler(function () {
                                window.open(response.body.data[1].value)
                            })
                        }
                    })
                }
            }
        },
        '->',
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
                        url: '/util/getUsername',
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