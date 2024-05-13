Ext.define('Login.view.LoginDialog', {
    extend: 'Ext.Dialog',
    reference: 'loginDialog',
    requires: ['Login.view.LoginPanel'],

    closable: false,
    draggable: false,

    width: 350,
    height: 325,
    keyMapEnabled: false,
    layout: 'fit',
    items: [
        {
            xtype: 'loginpanel'
        }
    ]
})