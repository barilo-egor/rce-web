Ext.define('Dashboard.view.users.web.WebUsersController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.webUsersController',

    change: function (me, newValue) {
        ExtUtil.referenceQuery('updateButton').updateDisable()
    },

    updateUser: function (me) {
        ExtUtil.mask('webUsersContainer', 'Обновление пользователя')
        let params = {}
        params.pid = ExtUtil.referenceQuery('webUsersGrid').getSelection().get('pid')
        let usernameField = ExtUtil.referenceQuery('usernameField')
        let roleField = ExtUtil.referenceQuery('roleField')
        let isBannedField = ExtUtil.referenceQuery('isBannedField')
        let chatIdField = ExtUtil.referenceQuery('chatIdField')
        if (usernameField.getValue() !== usernameField.defaultValue) params.username = usernameField.getValue()
        if (roleField.getValue() !== roleField.defaultValue) params.role = roleField.getValue()
        if (isBannedField.getValue() !== isBannedField.defaultValue) params.isBanned = isBannedField.getValue()
        if (chatIdField.getValue() !== chatIdField.defaultValue) params.chatId = chatIdField.getValue()
        ExtUtil.mRequest({
            url: '/users/web/update',
            params: params,
            loadingComponentRef: 'webUsersContainer',
            success: function (response) {
                if (params.username) usernameField.defaultValue = params.username
                if (params.role) roleField.defaultValue = params.role
                if (params.isBanned) isBannedField.defaultValue = params.isBanned
                if (params.chatId) chatIdField.defaultValue = params.chatId
                me.updateDisable()
                Ext.getStore('webUserStore').reload()
                ExtUtil.maskOff('webUsersContainer')
            }
        })
    },

    select: function (me, selected) {
        me.setMasked('Загрузка')
        ExtUtil.referenceQuery('webUserInfoPanel').expand()
        ExtUtil.referenceQuery('chooseDealContainer').setHidden(true)
        ExtUtil.referenceQuery('webUserFieldsContainer').setHidden(false)
        ExtUtil.referenceQuery('updateButton').setHidden(false)
        let user = selected[0].getData()
        ExtUtil.referenceQuery('webUserFieldsContainer').getFieldsReferences()
            .forEach(reference => ExtUtil.referenceQuery(reference).setUserValue(user))
        me.setMasked(false)
    },

    deselect: function () {
        ExtUtil.referenceQuery('webUserFieldsContainer').setHidden(true)
        ExtUtil.referenceQuery('chooseDealContainer').setHidden(false)
    },

    clearFilterForm: function () {
        Ext.getStore('webUserStore').fieldsReferences.forEach(reference => ExtUtil.referenceQuery(reference).clearValue())
    },

    search: function () {
        let params = {
            username: ExtUtil.referenceQuery('usernameField').getValue(),
            role: ExtUtil.referenceQuery('roleField').getValue(),
            chatId: ExtUtil.referenceQuery('chatIdField').getValue()
        }
        Ext.getStore('webUserStore').load({
            params: params
        })
    },

    reloadStore: function (me) {
        me.getStore().reload()
    }
})