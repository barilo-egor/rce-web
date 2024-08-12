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
            window.setMasked(false)
            ExtMessages.topToast('Введите верные данные.')
            return
        }
        form.submit({
            url: '/paymentTypes/api',
            success: function (form, response) {
                window.setMasked(false)
                Ext.getStore('paymentTypeStore').reload()
                ExtMessages.topToast('Тип оплаты ' + response.data.name + ' успешно создан')
                ExtUtil.closeWindow(me)
            },
            failure: function (form, response) {
                window.setMasked(false)
                RequestUtil.FORM.formFailure(form, response)
            }
        })
    },

    selectPaymentType: function (me) {
        ExtUtil.referenceQuery('apiClientsPanel').setMasked('Загрузка клиентов')
        let paymentTypePid = ExtUtil.referenceQuery('paymentTypesGrid').getPidOfSelected()
        Ext.getStore('apiClientStore').load({
            params: {
                paymentTypePid: paymentTypePid
            },
            callback: function () {
                ExtUtil.referenceQuery('apiClientsPanel').setMasked(false)
            }
        })
        Ext.getStore('requisiteStore').load({
            params: {
                paymentTypePid: paymentTypePid
            },
            callback: function () {
                ExtUtil.referenceQuery('requisitesPanel').setMasked(false)
            }
        })
    },

    dealTypeChange: function (me) {
        let value = me.getValue()
        ExtUtil.mask('paymentTypesGrid', 'Загрузка типов оплат')
        Ext.getStore('paymentTypeStore').load({
            params: {
                dealType: value
            },
            callback: function () {
                ExtUtil.maskOff('paymentTypesGrid')
            }
        })
    }
})