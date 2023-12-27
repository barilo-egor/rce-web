Ext.define('Login.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires: [
        'Login.view.LoginPanel'
    ],
    alias: 'widget.loginViewport',
    layout: {
        type: 'vbox',
        align: 'center'
    },
    viewModel: true,
    items: [
        {
            flex: 1,
            width: 800,
            xtype: 'loginpanel'
        }
    ]
});