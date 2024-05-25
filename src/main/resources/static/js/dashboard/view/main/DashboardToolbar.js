Ext.define('Dashboard.view.main.DashboardToolbar', {
    extend: 'Ext.Panel',
    xtype: 'dashboardtoolbar',
    requires: [
        'Dashboard.view.main.DashboardController'
    ],
    controller: 'dashboardController',

    margin: '10 10 5 10',
    shadow: true,
    tbar: [
        {
            iconCls: 'x-fa fa-link',
            listeners: {
                painted: 'painted'
            }
        },
        '->',
        {
            text: 'Уведомления',
            reference: 'notificationsButton',
            tooltip: {
                reference: 'notificationsTooltip',
                align: 'bl-br',
                anchorToTarget: true,
                anchor: true,
                autoHide: false,
                closable: true,
                showOnTap: true,
                maxHeight: 400,
                minWidth: 300,
                scrollable: 'y',
                title: 'Уведомления',
                html: 'Новых уведомлений нет',

                layout: {
                    type: 'vbox',
                    align: 'left'
                },

                buttons: [
                    {
                        text: 'Очистить',
                        handler: function (me) {
                            let notificationsTooltip = ExtUtil.referenceQuery('notificationsTooltip')
                            notificationsTooltip.removeAll()
                            notificationsTooltip.setHtml('Новых уведомлений нет')
                        }
                    }
                ],

                listeners: {
                    beforeshow: function (me) {
                        ExtUtil.referenceQuery('notificationsButton').setBadgeText(null)
                    },
                    hide: function (me) {
                        let items = me.getItems().items
                        items.forEach(item => {
                            if (item.xtype !== 'toolbar') item.setHtml(item.message)
                        })
                    }
                },

                addNotification: function (message) {
                    this.setHtml(null)
                    message = Ext.Date.format(new Date(), "H:i:s") + ' ' + message
                    this.insert(0, {
                        xtype: 'container',
                        message: message,
                        html: '<div style="font-weight: bold">' + message + '</div>'
                    })
                    let notificationsButton = ExtUtil.referenceQuery('notificationsButton')
                    let badgeText = notificationsButton.getBadgeText()
                    if (badgeText) notificationsButton.setBadgeText((parseInt(badgeText) + 1).toString())
                    else notificationsButton.setBadgeText('1')
                }
            }
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