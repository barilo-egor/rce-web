Ext.define('Dashboard.view.paymentTypes.api.requisite.AddRequisiteController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.addRequisiteController',

    createRequisite: function (me) {
        let form = ExtUtil.referenceQuery('addRequisiteForm')
        if (!form.validate()) {
            ExtMessages.topToast('Неверно заполнена форма')
            return
        }
        ExtUtil.mask('addRequisiteDialog', 'Создание реквизита')
        form.submit({
            url: '/paymentTypes/api/requisite',
            success: function (form, response) {
                ExtUtil.maskOff('addRequisiteDialog')
                Ext.getStore('paymentTypeStore').reload()
                ExtMessages.topToast('Реквизит успешно создан')
                ExtUtil.closeWindow(me)
            },
            failure: function (form, response) {
                ExtUtil.maskOff('addRequisiteDialog')
                RequestUtil.FORM.formFailure(form, response)
            }
        })
    },

    editRequisite: function (me) {
        let field = ExtUtil.referenceQuery('requisiteField')
        if (!field.validate()) {
            ExtMessages.topToast('Неверно заполнена форма')
            return
        }
        ExtUtil.mask('editRequisiteDialog', 'Обновление реквизита')
        let url = '/paymentTypes/api/requisite/' + ExtUtil.referenceQuery('paymentTypePidField').getValue()
        RequestUtil.request({
            url: url,
            method: 'PATCH',
            params: {
                requisite: field.getValue()
            },
            masked: 'editRequisiteDialog',
            success: function (response) {
                Ext.getStore('paymentTypeStore').reload()
                ExtMessages.topToast('Реквизит обновлен')
                ExtUtil.maskOff('editRequisiteDialog')
                ExtUtil.closeWindow(me)
            }
        })
    }
})