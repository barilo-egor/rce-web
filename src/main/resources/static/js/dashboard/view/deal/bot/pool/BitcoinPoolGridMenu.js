Ext.define('Dashboard.view.deal.bot.pool.BitcoinPoolGridMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'bitcoinpoolgridmenu',

    items: [
        {
            text: 'Удалить из пула',
            iconCls: 'x-fa fa-trash-alt redColor',
            handler: function (me) {
                alert('ok')
            }
        },
    ]
})