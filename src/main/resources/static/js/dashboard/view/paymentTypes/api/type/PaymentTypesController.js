Ext.define('Dashboard.view.paymentTypes.api.type.PaymentTypesController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.paymentTypesController',

    createDialog: function () {
        Ext.create('Dashboard.view.paymentTypes.api.type.CreatePaymentTypeDialog').show()
    },

    create: function (me) {
        let window = me.up('window')
        let form = ExtUtil.referenceQuery('createPaymentTypeForm')

        window.setMasked('Создание типа оплаты')
        if (!form.validate()) {
            form.setMasked(false)
            ExtMessages.topToast('Введите верные данные.')
            return
        }
        form.submit({
            url: '/paymentTypes/api',
            success: function (form, response) {
                window.setMasked(false)
                ExtMessages.topToast('Тип оплаты ' + response.data.name + ' успешно создан')
                ExtUtil.closeWindow(me)
            },
            failure: function (form, response) {
                window.setMasked(false)
                RequestUtil.FORM.formFailure(form, response)
            }
        })
    }
})