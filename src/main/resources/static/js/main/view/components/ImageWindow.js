Ext.define('Main.view.components.ImageWindow', {
    extend: 'Ext.window.Window',
    autoShow: true,
    maximized: true,
    width: '95%',
    height: '95%',
    draggable: false,
    scrollable: true,
    layout: {
        type: 'vbox',
        pack: 'center'
    },
    items: [
        {
            xtype: 'image',
            bind: {
                src: '{src}'
            },
            width: '100%',
            height: 'auto',
        }
    ]
})