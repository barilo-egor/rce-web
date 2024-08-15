Ext.define('Dashboard.view.deal.review.ReviewContainer', {
    extend: 'Ext.Container',
    xtype: 'reviewcontainer',
    reference: 'reviewContainer',
    requires: [
        'Dashboard.view.deal.review.ReviewController'
    ],
    controller: 'reviewController',

    layout: 'fit',
    items: [
        {
            xtype: 'grid',
            reference: 'reviewGrid',

            title: 'Отзывы',
            store: 'reviewStore',

            getPidOfSelected: function() {
                let selection = this.getSelection()
                if (selection) {
                    return selection.get('pid')
                }
                return null
            },

            plugins: {
                pagingtoolbar: true
            },
            listeners: {
                painted: function (me) {
                    me.getStore().load()
                },
                childcontextmenu: 'openGridMenu',
            },


            columns: [
                {
                    text: '№',
                    dataIndex: 'pid',
                    menuDisabled: true
                },
                {
                    text: 'Chat id',
                    width: 150,
                    dataIndex: 'chatId',
                    menuDisabled: true
                },
                {
                    text: 'Username',
                    width: 200,
                    dataIndex: 'username',
                    menuDisabled: true
                },
                {
                    text: 'Текст',
                    flex: 1,
                    dataIndex: 'text',
                    menuDisabled: true
                }
            ]
        }
    ]
})