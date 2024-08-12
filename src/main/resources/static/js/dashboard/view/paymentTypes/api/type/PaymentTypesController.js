Ext.define('Dashboard.view.paymentTypes.api.type.PaymentTypesController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.paymentTypesController',

    createDialog: function () {
        Ext.create('Dashboard.view.paymentTypes.api.type.PaymentTypeDialog').show()
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
    },

    addDealTypeChange: function (me) {
        ExtUtil.referenceQuery('requisitesPanel').setDefaultMask()
        ExtUtil.referenceQuery('apiClientsPanel').setDefaultMask()
        if (me.getValue() === 'BUY') {
            ExtUtil.referenceQuery('cryptoCurrencyAddField').setHidden(true)
            ExtUtil.referenceQuery('cryptoCurrencyColumn').setHidden(true)
            ExtUtil.referenceQuery('fiatCurrencyAddField').setHidden(false)
            ExtUtil.referenceQuery('fiatCurrencyColumn').setHidden(false)
        } else {
            ExtUtil.referenceQuery('fiatCurrencyAddField').setHidden(true)
            ExtUtil.referenceQuery('fiatCurrencyColumn').setHidden(true)
            ExtUtil.referenceQuery('cryptoCurrencyAddField').setHidden(false)
            ExtUtil.referenceQuery('cryptoCurrencyColumn').setHidden(false)
        }
    },

    openGridMenu: function (me, eObj) {
        me.deselectAll();
        me.setSelection(eObj.record);
        if (!me.menu) {
            me.menu = Ext.create('Dashboard.view.paymentTypes.api.type.PaymentTypeGridMenu')
        }
        me.menu.showAt(eObj.event.getX(), eObj.event.getY());
        eObj.event.stopEvent()
    },

    edit: function (me) {
        let form = ExtUtil.referenceQuery('editPaymentTypeForm')
        if (!form.validate()) {
            ExtMessages.topToast('Неверно заполнена форма')
            return
        }
        ExtUtil.mask('editPaymentTypeDialog')
        let values = ExtUtil.referenceQuery('editPaymentTypeForm').getValues()
        RequestUtil.request({
            url: '/paymentTypes/api/' + ExtUtil.referenceQuery('paymentTypesGrid').getPidOfSelected(),
            method: 'PATCH',
            params: values,
            masked: 'editPaymentTypeDialog',
            success: function () {
                ExtMessages.topToast('Тип оплаты обновлен')
                ExtUtil.maskOff('editPaymentTypeDialog')
                ExtUtil.referenceQuery('editPaymentTypeDialog').close()
                Ext.getStore('paymentTypeStore').reload()
            }
        })
    }
})