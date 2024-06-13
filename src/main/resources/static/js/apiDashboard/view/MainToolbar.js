Ext.define('ApiDashboard.view.MainToolbar', {
    extend: 'Ext.Panel',
    xtype: 'maintoolbar',

    shadow: true,

    tbar: [
        {
            text: TITLE
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