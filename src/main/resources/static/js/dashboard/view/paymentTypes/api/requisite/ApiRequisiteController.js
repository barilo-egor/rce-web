Ext.define('Dashboard.view.paymentTypes.api.requisite.ApiRequisiteController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.apiRequisiteController',
    requires: [
        'Dashboard.view.paymentTypes.api.requisite.AddApiRequisiteDialog'
    ],

    createRequisiteDialog: function () {
        Ext.create('Dashboard.view.paymentTypes.api.requisite.AddApiRequisiteDialog', {
            viewModel: {
                data: {
                    paymentTypePid: ExtUtil.referenceQuery('paymentTypesGrid').getPidOfSelected()
                }
            }
        }).show()
    },

    openGridMenu: function (me, eObj) {
        me.deselectAll();
        me.setSelection(eObj.record);
        if (!me.menu) {
            me.menu = Ext.create('Dashboard.view.paymentTypes.api.requisite.ApiRequisitesGridMenu')
        }
        me.menu.showAt(eObj.event.getX(), eObj.event.getY());
        eObj.event.stopEvent()
    },

    turnRequisite: function (me, rowIndex, checked) {
        ExtUtil.mask('apiRequisitesGrid', 'Обновление реквизита')
        let url = '/paymentTypes/api/requisite/' + Ext.getStore('requisiteStore').getAt(rowIndex).get('pid')
        RequestUtil.request({
            url: url,
            method: 'PATCH',
            params: {
                isOn: checked === true
            },
            masked: 'apiRequisitesGrid',
            success: function (response) {
                ExtUtil.maskOff('apiRequisitesGrid')
                ExtMessages.topToast('Реквизит ' + (checked === true ? 'включен' : 'выключен'))
            }
        })
    },

    help: function (me) {

    },

    setMask: function (me) {
        me.setDefaultMask()
    }
})