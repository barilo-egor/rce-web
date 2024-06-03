Ext.define('Dashboard.view.users.api.ApiUsersController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.apiUsersController',

    change: function (me, newValue) {
        ExtUtil.referenceQuery('updateButton').updateDisable()
    },

    updateUser: function (me) {
        ExtUtil.mask('apiUsersContainer', 'Обновление пользователя')
        let fieldsReferences = [
            'idField', 'buyRequisiteField', 'sellRequisiteField', 'personalDiscountField', 'usdCourseBYNField',
            'usdCourseRUBField', 'fiatCurrencyField', 'isBannedField', 'tokenField'
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
        ExtUtil.referenceQuery('userFieldsContainer').setHidden(false)
        let user = selected[0].getData()

        let usernameField = ExtUtil.referenceQuery('idField')
        usernameField.defaultValue = user.id
        usernameField.setValue(user.id)
        let personalDiscountField = ExtUtil.referenceQuery('personalDiscountField')
        personalDiscountField.defaultValue = user.personalDiscount
        personalDiscountField.setValue(user.personalDiscount)
        let isBannedField = ExtUtil.referenceQuery('isBannedField')
        isBannedField.defaultValue = user.isBanned
        isBannedField.setValue(user.isBanned)
        let tokenField = ExtUtil.referenceQuery('tokenField')
        tokenField.defaultValue = user.token
        tokenField.setValue(user.token)
        let buyRequisiteField = ExtUtil.referenceQuery('buyRequisiteField')
        buyRequisiteField.defaultValue = user.buyRequisite
        buyRequisiteField.setValue(user.buyRequisite)
        let sellRequisiteField = ExtUtil.referenceQuery('sellRequisiteField')
        sellRequisiteField.defaultValue = user.sellRequisite
        sellRequisiteField.setValue(user.sellRequisite)
        let fiatCurrencyField = ExtUtil.referenceQuery('fiatCurrencyField')
        let fiatCurrency = fiatCurrencyField.getStore().getRange().filter(role => role.get('name') === user.fiatCurrency.name)[0]
        fiatCurrencyField.defaultValue = fiatCurrency.get('name')
        fiatCurrencyField.setValue(fiatCurrency)
        let usdCourseRUBField = ExtUtil.referenceQuery('usdCourseRUBField')
        usdCourseRUBField.defaultValue = user.usdCourseRUB
        usdCourseRUBField.setValue(user.usdCourseRUB)
        let usdCourseBYNField = ExtUtil.referenceQuery('usdCourseBYNField')
        usdCourseBYNField.defaultValue = user.usdCourseBYN
        usdCourseBYNField.setValue(user.usdCourseBYN)
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
    }
})