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
    }
})