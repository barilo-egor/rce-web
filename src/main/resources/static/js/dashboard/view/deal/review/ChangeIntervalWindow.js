Ext.define('Dashboard.view.deal.review.ChangeIntervalWindow', {
    extend: 'Ext.Dialog',
    reference: 'changeIntervalWindow',

    title: 'Обновление интервала публикации отзывов',
    closable: true,

    items: [
        {
            xtype: 'numberfield',
            label: 'Новое значение',
            reference: 'newIntervalValueField',
            margin: '0 20 5 20',
            decimals: 0,
            bind: {
                value: '{value}'
            }
        },
        {
            xtype: 'button',
            text: 'Обновить',
            handler: function (me) {
                ExtUtil.mask('changeIntervalWindow', 'Обновление комиссии')
                let newValue = ExtUtil.referenceQuery('newIntervalValueField').getValue()
                ExtUtil.mRequest({
                    url: '/deal/review/publishInterval',
                    method: 'POST',
                    params: {
                        interval: newValue
                    },
                    loadingComponentRef: 'changeIntervalWindow',
                    success: function (response) {
                        ExtUtil.referenceQuery('reviewPublishIntervalField').reload()
                        ExtMessages.topToast('Интервал обновлен.')
                        me.up('dialog').close()
                    }
                })
            }
        }
    ]
});