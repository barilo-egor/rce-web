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
    }
})