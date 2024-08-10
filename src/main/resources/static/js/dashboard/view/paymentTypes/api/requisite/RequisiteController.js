Ext.define('Dashboard.view.paymentTypes.api.requisite.RequisiteController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.requisiteController',
    requires: [
        'Dashboard.view.paymentTypes.api.requisite.AddRequisiteDialog'
    ],

    createRequisiteDialog: function () {
        Ext.create('Dashboard.view.paymentTypes.api.requisite.AddRequisiteDialog', {
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
            me.menu = Ext.create('Dashboard.view.paymentTypes.api.requisite.RequisitesGridMenu')
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

    }
})