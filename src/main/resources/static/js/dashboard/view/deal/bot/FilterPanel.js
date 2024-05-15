Ext.define('Dashboard.view.deal.bot.FilterPanel', {
    extend: 'Ext.Panel',
    xtype: 'filterpanel',
    title: 'Фильтрация',
    collapsible: {
        direction: 'top',
        expandToolText: 'Развернуть',
        collapseToolText: 'Свернуть'
    },
    titleCollapse: false,
    shadow: true,
    margin: '10 10 10 10',
    padding: '5 5 5 5',
    layout: {
        type: 'vbox',
        align: 'center'
    },
    items: [
        {
            xtype: 'container',
            width: '100%',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                flex: 1,
                xtype: 'container',
                layout: {
                    type: 'vbox',
                    align: 'center'
                }
            },
            items: [
                {
                    items: [
                        {
                            xtype: 'textfield',
                            label: 'Chat id'
                        },
                        {
                            xtype: 'datefield',
                            label: 'Дата сделки'
                        }
                    ]
                },
                {
                    items: [
                        {
                            xtype: 'combobox',
                            label: 'Тип сделки'
                        },
                        {
                            xtype: 'combobox',
                            label: 'Фиат'
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'button',
            margin: '20 0 0 0',
            text: 'Искать'
        }
    ]
})