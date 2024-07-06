Ext.define('ApiDashboard.view.NotificationsToolTipController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.notificationsToolTipController',

    clearNotificationsHandler: function (me) {
        Ext.getStore('notificationsStore').removeAll()
        ExtUtil.referenceQuery('notificationsTooltip').clearNotifications()
    },

    defaultNotifications: function (me) {
        document.title = TITLE
        ExtUtil.referenceQuery('notificationsButton').setBadgeText(null)
    },

    onHide: function (me) {
        Ext.getStore('notificationsStore').each(rec => rec.set('isNew', null))
    },

    doubleClickNotification: function (me, location) {
        me.getStore().removeAt(location.recordIndex)
        if (me.getStore().getRange().length === 0) {
            ExtUtil.referenceQuery('notificationsTooltip').clearNotifications()
        }
    }
})