Ext.define('Dashboard.view.paymentTypes.api.requisite.AddApiRequisiteController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.addApiRequisiteController',

    createRequisite: function (me) {
        let form = ExtUtil.referenceQuery('addRequisiteForm')
        if (!form.validate()) {
            ExtMessages.topToast('Неверно заполнена форма')
            return
        }
        ExtUtil.mask('addApiRequisiteDialog', 'Создание реквизита')
        form.submit({
            url: '/paymentTypes/api/requisite',
            success: function (form, response) {
                ExtUtil.maskOff('addApiRequisiteDialog')
                Ext.getStore('apiPaymentTypeStore').reload()
                ExtMessages.topToast('Реквизит успешно создан')
                ExtUtil.closeWindow(me)
            },
            failure: function (form, response) {
                ExtUtil.maskOff('addApiRequisiteDialog')
                RequestUtil.FORM.formFailure(form, response)
            }
        })
    },

    editRequisite: function (me) {
        let requisiteField = ExtUtil.referenceQuery('requisiteField')
        if (!requisiteField.validate()) {
            ExtMessages.topToast('Неверно заполнена форма')
            return
        }
        let comment = ExtUtil.referenceQuery('commentField').getValue()
        ExtUtil.mask('editApiRequisiteDialog', 'Обновление реквизита')
        let url = '/paymentTypes/api/requisite/' + ExtUtil.referenceQuery('paymentTypePidField').getValue()
        RequestUtil.request({
            url: url,
            method: 'PATCH',
            params: {
                requisite: requisiteField.getValue(),
                comment: comment
            },
            masked: 'editApiRequisiteDialog',
            success: function (response) {
                Ext.getStore('apiPaymentTypeStore').reload()
                ExtMessages.topToast('Реквизит обновлен')
                ExtUtil.maskOff('editApiRequisiteDialog')
                ExtUtil.closeWindow(me)
            }
        })
    }
})