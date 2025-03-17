Ext.define('Dashboard.view.deal.review.ReviewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.reviewController',

    openGridMenu: function (me, eObj) {
        me.deselectAll();
        me.setSelection(eObj.record);
        if (!me.menu) {
            me.menu = Ext.create('Dashboard.view.deal.review.ReviewGridMenu')
        }
        me.menu.showAt(eObj.event.getX(), eObj.event.getY());
        eObj.event.stopEvent()
    },

    deleteReview: function (grid, info) {
        ExtUtil.mask('reviewContainer')
        RequestUtil.request({
            url: '/deal/review/' + info.record.get('pid'),
            method: 'DELETE',
            masked: 'reviewContainer',
            success: function () {
                ExtUtil.maskOff('reviewContainer')
                ExtMessages.topToast('Отзыв удален')
            }
        })
    }
})