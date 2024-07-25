Ext.define('ApiDashboard.view.grid.CreateDisputeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.createDisputeController',

    showNext: function() {
        this.doCardNavigation(1);
    },

    showPrevious: function(btn) {
        this.doCardNavigation(-1);
    },

    doCardNavigation: function(incr) {
        var view = ExtUtil.referenceQuery('checkField'),
            layout = view.getLayout(),
            currentIdx = view.indexOf(view.getActiveItem()),
            next = currentIdx + incr;

        layout.setAnimation({
            type: 'slide',
            direction: incr > 0 ? 'left' : 'right',
            duration: 350
        });

        view.setActiveItem(next);

        let container = ExtUtil.referenceQuery('checkBufferContainer')
        if (next === 0) {
            ExtUtil.referenceQuery('card-prev').setDisabled(true);
            ExtUtil.referenceQuery('card-next').setDisabled(false);

            let field = ExtUtil.referenceQuery('checkFileField')
            field.reset()
            ExtUtil.referenceQuery('createButton').focus()
        } else {
            ExtUtil.referenceQuery('card-next').setDisabled(true);
            ExtUtil.referenceQuery('card-prev').setDisabled(false);

            container.setHtml('<div style="text-align: center">Скопируйте изображение и нажмите Ctrl+V<br> для вставки из буфера обмена.</div>')
            container.file = null
        }
    }
})