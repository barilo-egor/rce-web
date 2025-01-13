Ext.define('Dashboard.view.design.message.MessagesTextContainer', {
    extend: 'Ext.Container',
    xtype: 'messagestextcontainer',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [
        {
            xtype: 'panel',

            items: [
                {
                    xtype: 'toolbar',
                    docked: 'top',

                    items: [
                        {
                            xtype: 'combobox',
                            label: 'Сообщение:',
                            width: '100%'
                        }
                    ]
                }
            ]
        }
    ]
})