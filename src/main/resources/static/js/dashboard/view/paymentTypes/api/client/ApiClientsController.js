Ext.define('Dashboard.view.paymentTypes.api.client.ApiClientsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.apiClientsController',
    requires: [
        'Dashboard.view.paymentTypes.api.client.AddClientDialog'
    ],

    addClientDialog: function () {
        Ext.create('Dashboard.view.paymentTypes.api.client.AddClientDialog').show()
    },

    openGridMenu: function (me, eObj) {
        me.deselectAll();
        me.setSelection(eObj.record);
        if (!me.menu) {
            me.menu = Ext.create('Dashboard.view.paymentTypes.api.client.ApiClientsGridMenu')
        }
        me.menu.setViewModel({
            data: {
                id: eObj.record.get('id')
            }
        })
        me.menu.showAt(eObj.event.getX(), eObj.event.getY());
        eObj.event.stopEvent()
    },

    setMask: function (me) {
        me.setDefaultMask()
    }
})