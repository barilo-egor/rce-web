Ext.define('Main.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires: [
        'Main.view.MainPanel',
        'Main.view.MainController'
    ],
    alias: 'widget.mainViewport',
    layout: {
        type: 'vbox',
        align: 'center'
    },
    viewModel: true,
    items: [
        {
            flex: 1,
            width: 800,
            xtype: 'mainpanel'
        }
    ]
});