Ext.define('Login.view.LoginDialog', {
    extend: 'Ext.Dialog',
    reference: 'loginDialog',
    requires: ['Login.view.LoginPanel'],

    closable: false,
    draggable: false,

    width: 400,
    height: 260,

    platformConfig: {
        desktop: {
            quickTips: true
        }
    },
    layout: 'fit',
    items: [
        {
            xtype: 'loginpanel'
        }
    ]
})