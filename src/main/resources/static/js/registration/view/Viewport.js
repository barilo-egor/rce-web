Ext.define('Registration.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires: [
        'Registration.view.RegistrationPanel'
    ],
    alias: 'widget.registrationViewport',
    layout: 'fit',
    viewModel: true,
    listeners: {
        afterrender: function (me) {
            Ext.create('Ext.window.Window', {
                autoShow: true,
                closable: false,
                title: 'Регистрация',
                titleAlign: 'center',
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
                                xtype: 'registrationpanel',
                                width: 500
                            }
                        ]
                    }
                ]
            })
        }
    }
});