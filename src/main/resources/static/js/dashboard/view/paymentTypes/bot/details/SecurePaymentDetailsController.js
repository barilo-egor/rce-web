Ext.define('Dashboard.view.paymentTypes.bot.details.SecurePaymentDetailsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.securePaymentDetailsController',
    requires: [
        'Dashboard.view.paymentTypes.bot.details.SecurePaymentDetailsGridMenu'
    ],

    createDialog: function (me) {
        ExtUtil.mask('securePaymentDetailsGrid', 'Загрузка')
        let minDealCount
        RequestUtil.request({
            url: 'paymentTypes/bot/securePaymentDetails/minDealCount',
            method: 'GET',
            async: false,
            masked: 'securePaymentDetailsGrid',
            success: function (response) {
                minDealCount = response.data
            }
        })
        ExtUtil.maskOff('securePaymentDetailsGrid')
        Ext.create('Dashboard.view.paymentTypes.bot.details.CreateSecurePaymentDetailsDialog', {
            viewModel: {
                data: {
                    title: 'Создание защитного реквизита',
                    minDealCount: minDealCount
                }
            }
        }).show()
    },

    saveNewDetails: function (me) {
        let form = me.up('formpanel')
        if (!form.validate()) {
            ExtMessages.topToast('Заполните реквизит.')
            return
        }
        ExtUtil.mask('createSecurePaymentDetailsDialog')
        let pid = form.getValues().pid
        if (!pid) {
            form.submit({
                url: '/paymentTypes/bot/securePaymentDetails',
                success: function (form, response) {
                    ExtUtil.maskOff('createSecurePaymentDetailsDialog')
                    Ext.getStore('securePaymentDetailsStore').reload()
                    ExtMessages.topToast('Защитный реквизит успешно создан')
                    ExtUtil.closeWindow(me)
                },
                failure: function (form, response) {
                    ExtUtil.maskOff('createSecurePaymentDetailsDialog')
                    RequestUtil.FORM.formFailure(form, response)
                }
            })
        } else {
            RequestUtil.request({
                url: '/paymentTypes/bot/securePaymentDetails/' + pid,
                method: 'PUT',
                params: form.getValues(),
                masked: 'createSecurePaymentDetailsDialog',
                success: function (response) {
                    ExtUtil.maskOff('createSecurePaymentDetailsDialog')
                    Ext.getStore('securePaymentDetailsStore').reload()
                    ExtMessages.topToast('Защитный реквизит успешно обновлен')
                    ExtUtil.closeWindow(me)
                }
            })
        }
    },

    openGridMenu: function (me, eObj) {
        me.deselectAll();
        me.setSelection(eObj.record);
        if (!me.menu) {
            me.menu = Ext.create('Dashboard.view.paymentTypes.bot.details.SecurePaymentDetailsGridMenu')
        }
        me.menu.showAt(eObj.event.getX(), eObj.event.getY());
        eObj.event.stopEvent()
    }
})