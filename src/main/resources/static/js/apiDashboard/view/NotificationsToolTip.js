Ext.define('ApiDashboard.view.NotificationsToolTip', {
    extend: 'Ext.tip.ToolTip',
    xtype: 'notificationstooltip',
    reference: 'notificationsTooltip',
    requires: [
        'ApiDashboard.view.NotificationsToolTipController'
    ],
    controller: 'notificationsToolTipController',

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
            handler: 'clearNotificationsHandler'
        }
    ],

    listeners: {
        beforeshow: 'defaultNotifications',
        hide: 'onHide'
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
                childdoubletap: 'doubleClickNotification'
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
})