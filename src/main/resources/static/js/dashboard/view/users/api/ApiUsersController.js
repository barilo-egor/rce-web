Ext.define('Dashboard.view.users.api.ApiUsersController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.apiUsersController',

    change: function (me, newValue) {
        ExtUtil.referenceQuery('updateButton').updateDisable()
    },

    updateUser: function (me) {
        ExtUtil.mask('apiUsersContainer', 'Обновление пользователя')
        let fieldsReferences = [
            'idField', 'personalDiscountField', 'usdCourseBYNField',
            'usdCourseRUBField', 'fiatCurrencyField', 'isBannedField', 'tokenField', 'groupChatPidField'
        ]
        let params = ExtUtil.getJsonDataNullable(fieldsReferences)
        params.pid = ExtUtil.referenceQuery('apiUsersGrid').getSelection().get('pid')
        ExtUtil.mRequest({
            url: '/users/api/save',
            jsonData: params,
            loadingComponentRef: 'apiUsersContainer',
            success: function (response) {
                ExtUtil.updateDefaultValues(fieldsReferences)
                me.updateDisable()
                Ext.getStore('apiUserStore').reload()
                ExtUtil.maskOff('apiUsersContainer')
            }
        })
    },

    select: function (me, selected) {
        me.setMasked('Загрузка')
        ExtUtil.referenceQuery('apiUserInfoPanel').expand()
        ExtUtil.referenceQuery('chooseDealContainer').setHidden(true)
        let user = selected[0].getData()
        ExtUtil.referenceQuery('userFieldsContainer').getFieldsReferences()
            .forEach(reference => ExtUtil.referenceQuery(reference).setUserValue(user))
        ExtUtil.referenceQuery('userFieldsContainer').setHidden(false)
        ExtUtil.referenceQuery('updateButton').setHidden(false)
        me.setMasked(false)
    },

    deselect: function () {
        ExtUtil.referenceQuery('userFieldsContainer').setHidden(true)
        ExtUtil.referenceQuery('chooseDealContainer').setHidden(false)
    },

    clearFilterForm: function () {
        Ext.getStore('apiUserStore').fieldsReferences.forEach(reference => ExtUtil.referenceQuery(reference).clearValue())
    },

    search: function () {
        let params = ExtUtil.getJsonData(Ext.getStore('apiUserStore').fieldsReferences, 'FilterField')
        Ext.getStore('apiUserStore').load({
            params: params
        })
    },

    reloadStore: function (me) {
        me.getStore().reload()
    },

    createUser: function (me) {
        Ext.create('Dashboard.view.users.api.dialog.ApiUserCreateDialog').show()
    },

    gridMenu: function (me, eObj) {
        me.deselectAll();
        me.setSelection(eObj.record);
        if (!me.menu) {
            me.menu = Ext.create('Dashboard.view.users.api.ApiUsersGridMenu')
        }
        me.menu.showAt(eObj.event.getX(), eObj.event.getY());
        eObj.event.stopEvent()
    },

    generateToken: function (me) {
        ExtUtil.mRequest({
            method: 'GET',
            url: '/users/api/generateToken',
            success: function (response) {
                ExtUtil.referenceQuery('tokenField').setValue(response.body.data.token)
            }
        })
    }
})