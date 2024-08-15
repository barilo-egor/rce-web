Ext.define('Dashboard.view.deal.review.ReviewGridMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'reviewgridmenu',

    items: [
        {
            text: 'Опубликовать',
            iconCls: 'x-fa fa-paper-plane material-blue-color',
            handler: function (me) {
                ExtUtil.mask('reviewContainer')
                RequestUtil.request({
                    url: '/deal/review/' + ExtUtil.referenceQuery('reviewGrid').getPidOfSelected(),
                    masked: 'reviewContainer',
                    method: 'POST',
                    success: function () {
                        ExtUtil.maskOff('reviewContainer')
                        ExtMessages.topToast('Отзыв опубликован')
                    }
                })
            }
        },
        {
            text: 'Удалить',
            reference: 'copyRequisiteMenuButton',
            iconCls: 'x-fa fa-trash-alt redColor',
            handler: function (me) {
                ExtUtil.mask('reviewContainer')
                RequestUtil.request({
                    url: '/deal/review/' + ExtUtil.referenceQuery('reviewGrid').getPidOfSelected(),
                    method: 'DELETE',
                    masked: 'reviewContainer',
                    success: function () {
                        ExtUtil.maskOff('reviewContainer')
                        ExtMessages.topToast('Отзыв опубликован')
                    }
                })
            }
        }
    ]
})