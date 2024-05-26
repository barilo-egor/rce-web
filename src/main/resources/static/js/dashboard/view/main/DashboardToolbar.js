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
                maxWidth: 500,
                minWidth: 300,
                scrollable: 'y',
                title: 'Уведомления',

                layout: {
                    type: 'fit'
                },
                clearNotifications: function () {
                    ExtUtil.referenceQuery('emptyNotificationsContainer').show()
                    ExtUtil.referenceQuery('notificationsList').hide()
                    ExtUtil.referenceQuery('notificationsButton').setBadgeText(null)
                    document.title = TITLE
                },

                buttons: [
                    {
                        text: 'Очистить',
                        handler: function (me) {
                            Ext.getStore('notificationsStore').removeAll()
                            ExtUtil.referenceQuery('notificationsTooltip').clearNotifications()
                        }
                    }
                ],

                listeners: {
                    beforeshow: function (me) {
                        document.title = TITLE
                        ExtUtil.referenceQuery('notificationsButton').setBadgeText(null)
                    },
                    hide: function (me) {
                        Ext.getStore('notificationsStore').each(rec => rec.set('isNew', null))
                    }
                },

                items: [
                    {
                        xtype: 'container',
                        reference: 'emptyNotificationsContainer',
                        html: 'Нет новых уведомлений.'
                    },
                    {
                        xtype: 'list',
                        reference: 'notificationsList',
                        hidden: true,
                        itemTpl: '{isNew} {time} {message}',
                        store: {
                            storeId: 'notificationsStore',
                            autLoad: false,
                            fields: [
                                'time', 'message', 'isNew'
                            ]
                        },
                        listeners: {
                            childdoubletap: function (me, location) {
                                me.getStore().removeAt(location.recordIndex)
                                if (me.getStore().getRange().length === 0) {
                                    ExtUtil.referenceQuery('notificationsTooltip').clearNotifications()
                                }
                            }
                        }
                    }
                ],

                addNotification: function (message) {
                    ExtUtil.referenceQuery('emptyNotificationsContainer').hide()
                    ExtUtil.referenceQuery('notificationsList').show()
                    Ext.getStore('notificationsStore').insert(0, {
                        time: Ext.Date.format(new Date(), "H:i:s"),
                        message: message,
                        isNew: '<div style="font-weight: bold">NEW</div>'
                    })
                    let notificationsButton = ExtUtil.referenceQuery('notificationsButton')
                    let badgeText = notificationsButton.getBadgeText()
                    let numberOfNotifications
                    if (badgeText) {
                        numberOfNotifications = parseInt(badgeText) + 1
                        notificationsButton.setBadgeText((numberOfNotifications).toString())
                    } else {
                        numberOfNotifications = 1
                        notificationsButton.setBadgeText('1')
                    }
                    console.log('isHidden=' + document.hidden)
                    document.title = '(' + numberOfNotifications + ') ' + TITLE
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