Ext.define('Registration.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires: [
        'Registration.view.RegistrationPanel'
    ],
    alias: 'widget.registrationViewport',
    layout: {
        type: 'vbox',
        align: 'center'
    },
    viewModel: true,
    items: [
        {
            flex: 1,
            width: 800,
            xtype: 'registrationpanel'
        }
    ]
});