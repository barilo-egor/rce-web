Ext.define('ApiDashboard.view.MainToolbar', {
    extend: 'Ext.Panel',
    xtype: 'maintoolbar',
    requires: [
        'ApiDashboard.view.statistic.DealStatisticDialog'
    ],

    shadow: true,

    tbar: [
        {
            text: TITLE,

            listeners: {
                painted: function (me) {
                    ExtUtil.mRequest({
                        url: '/dashboard/api/util/getBotLink',
                        method: 'GET',
                        async: false,
                        success: function (response) {
                            me.setText(TITLE)
                            me.setHandler(function () {
                                window.open(response.body.data[0].value)
                            })
                        }
                    })
                    const eventSource = new EventSource("/dashboard/api/notifications/listen");
                    eventSource.onmessage = e => {
                        let response = Ext.JSON.decode(e.data);
                        switch (response.type) {
                            case 'CREATED_DEAL':
                            case 'PAID_DEAL':
                            case 'CANCELED_DEAL':
                            case 'ACCEPTED_DEAL':
                            case 'DECLINED_DEAL':
                                ExtMessages.topToast(response.message)
                                ExtUtil.referenceQuery('notificationsTooltip').addNotification(response.message)
                                Ext.getStore('dealStore').reload()
                                break
                        }
                        if (NOTIFICATION_SOUND_ON === true) NOTIFICATION_SOUND.play().catch(error => console.log('Ошибка воспроизведения звука оповещения. ', error))
                    }
                    eventSource.onerror = () => console.log('Произошла ошибка SSE.');
                }
            }
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
                    document.title = '(' + numberOfNotifications + ') ' + TITLE
                }
            }
        },
        {
            menu: [
                {
                    text: 'Профиль',
                    handler: function (me) {
                        Ext.create('ApiDashboard.view.profile.ProfileDialog').show()
                    }
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