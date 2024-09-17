Ext.define('Dashboard.view.paymentTypes.api.type.ApiPaymentTypesController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.apiPaymentTypesController',

    createDialog: function () {
        Ext.create('Dashboard.view.paymentTypes.api.type.ApiPaymentTypeDialog').show()
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
            success: function () {
                window.setMasked(false)
                Ext.getStore('apiPaymentTypeStore').reload()
                ExtMessages.topToast('Тип оплаты успешно создан')
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
        Ext.getStore('apiRequisiteStore').load({
            params: {
                paymentTypePid: paymentTypePid
            },
            callback: function () {
                ExtUtil.referenceQuery('apiRequisitesPanel').setMasked(false)
            }
        })
    },

    dealTypeChange: function (me) {
        let value = me.getValue()
        ExtUtil.mask('paymentTypesGrid', 'Загрузка типов оплат')
        Ext.getStore('apiPaymentTypeStore').load({
            params: {
                dealType: value,
                apiUserId: ExtUtil.referenceQuery('apiUserIdCombo').getValue()
            },
            callback: function () {
                ExtUtil.maskOff('paymentTypesGrid')
            }
        })
    },

    openGridMenu: function (me, eObj) {
        me.deselectAll();
        me.setSelection(eObj.record);
        if (!me.menu) {
            me.menu = Ext.create('Dashboard.view.paymentTypes.api.type.ApiPaymentTypeGridMenu')
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
        ExtUtil.mask('editApiPaymentTypeDialog')
        let values = ExtUtil.referenceQuery('editPaymentTypeForm').getValues()
        RequestUtil.request({
            url: '/paymentTypes/api/' + ExtUtil.referenceQuery('paymentTypesGrid').getPidOfSelected(),
            method: 'PATCH',
            params: values,
            masked: 'editApiPaymentTypeDialog',
            success: function () {
                ExtMessages.topToast('Тип оплаты обновлен')
                ExtUtil.maskOff('editApiPaymentTypeDialog')
                ExtUtil.referenceQuery('editApiPaymentTypeDialog').close()
                Ext.getStore('apiPaymentTypeStore').reload()
            }
        })
    },

    selectApiUserId: function (me, newValue) {
        Ext.getStore('apiPaymentTypeStore').load({
            params: {
                dealType: ExtUtil.referenceQuery('dealTypeField').getValue(),
                apiUserId: newValue.get('value')
            }
        })
        ExtUtil.referenceQuery('apiRequisitesPanel').setDefaultMask()
        ExtUtil.referenceQuery('apiClientsPanel').setDefaultMask()
        ExtUtil.referenceQuery('dropClientFilterButton').setHidden(false)
        me.setReadOnly(true)
    },

    dropClientFilter: function (me) {
        ExtUtil.referenceQuery('apiUserIdCombo').setValue(null)
        Ext.getStore('apiPaymentTypeStore').load({
            params: {
                dealType: ExtUtil.referenceQuery('dealTypeField').getValue()
            }
        })
        me.setHidden(true)
        ExtUtil.referenceQuery('apiUserIdCombo').setReadOnly(false)
        ExtUtil.referenceQuery('apiUserIdCombo').setReadOnly(false)
    }
})