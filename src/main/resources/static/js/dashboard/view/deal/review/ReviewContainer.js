Ext.define('Dashboard.view.deal.review.ReviewContainer', {
    extend: 'Ext.Container',
    xtype: 'reviewcontainer',

    items: [
        {
            xtype: 'grid',

            title: 'Отзывы',
            store: 'reviewStore',

            listeners: {
                painted: function (me) {
                    me.getStore().load()
                }
            },

            columns: [
                {
                    text: 'Chat id',
                    width: 150,
                    dataIndex: 'chatId'
                },
                {
                    text: 'Username',
                    width: 150,
                    dataIndex: 'username'
                },
                {
                    text: 'Текст',
                    flex: 1,
                    dataIndex: 'text'
                }
            ]
        }
    ]
})