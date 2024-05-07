Ext.define('Login.view.LoginDialog', {
    extend: 'Ext.Dialog',
    requires: ['Login.view.LoginPanel'],

    closable: false,
    draggable: false,

    width: 400,
    height: 330,
    responsiveConfig: {
        portrait: {
            width: '90%',
            height: 480
        }
    },
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