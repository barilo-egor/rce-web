Ext.define('Login.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires: [
        'Login.view.LoginPanel'
    ],
    layout: 'fit',
    viewModel: true,
    listeners: {
        afterrender: function (me) {
            Ext.create('Ext.window.Window', {
                autoShow: true,
                closable: false,
                draggable: false,
                modal: true,
                items: [
                    {
                        xtype: 'panel',
                        layout: {
                            type: 'hbox',
                            align: 'center',
                            pack: 'center'
                        },
                        items: [
                            {
                                xtype: 'loginpanel',
                                width: 400
                            }
                        ]
                    }
                ]
            })
        }
    }
});