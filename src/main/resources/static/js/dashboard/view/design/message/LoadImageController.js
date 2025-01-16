Ext.define('Dashboard.view.design.message.LoadImageController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.loadImageController',

    load: function (button) {
        ExtUtil.mask('messagesTextContainer', 'Загрузка изображения')
        let fileField = ExtUtil.referenceQuery('newImageField')
        let file
        if (fileField.getFiles().length > 0) {
            file = fileField.getFiles()[0]
        }
        if (!file) {
            file = ExtUtil.referenceQuery('bufferContainer').file
        }
        if (!file) {
            ExtMessages.info('Внимание', 'Добавьте изображение для загрузки..')
            ExtUtil.maskOff('messagesTextContainer')
            return
        }
        let messageImage = ExtUtil.referenceQuery('selectedMessageComboField').getValue()
        let formData = new FormData()
        formData.append('file', file)
        ExtUtil.mRequest({
            url: '/messages_text/image/' + messageImage,
            rawData: formData,
            headers: {
                'Content-Type': null
            },
            async: false,
            loadingComponentRef: 'messagesTextContainer',
            success: function (response) {
                ExtUtil.maskOff('messagesTextContainer')
                ExtMessages.topToast('Изображение загружено.')
                ExtUtil.referenceQuery('messagesTextContainer').getController().loadTextAndImage(null, messageImage)
            }
        })
    },

    showNext: function() {
        this.doCardNavigation(1);
    },

    showPrevious: function(btn) {
        this.doCardNavigation(-1);
    },

    doCardNavigation: function(incr) {
        var view = ExtUtil.referenceQuery('loadFileField'),
            layout = view.getLayout(),
            currentIdx = view.indexOf(view.getActiveItem()),
            next = currentIdx + incr;

        layout.setAnimation({
            type: 'slide',
            direction: incr > 0 ? 'left' : 'right',
            duration: 350
        });

        view.setActiveItem(next);

        let container = ExtUtil.referenceQuery('bufferContainer')
        if (next === 0) {
            ExtUtil.referenceQuery('card-prev').setDisabled(true);
            ExtUtil.referenceQuery('card-next').setDisabled(false);

            let field = ExtUtil.referenceQuery('newImageField')
            field.reset()
            ExtUtil.referenceQuery('loadButton').focus()
        } else {
            ExtUtil.referenceQuery('card-next').setDisabled(true);
            ExtUtil.referenceQuery('card-prev').setDisabled(false);

            container.setHtml('<div style="text-align: center">Скопируйте изображение и нажмите Ctrl+V<br> для вставки из буфера обмена.</div>')
            container.file = null
        }
    },

    setPasteHandler: function() {
        document.onpaste = (evt) => {
            let view = ExtUtil.referenceQuery('loadFileField')
            if (view.indexOf(view.getActiveItem()) !== 0) return
            const dT = evt.clipboardData || window.clipboardData;
            const file = dT.files[0];
            if (file && (file.type === 'application/pdf' || file.type.startsWith("image"))) {
                let container = ExtUtil.referenceQuery('bufferContainer')
                container.file = file
                const fileURL = URL.createObjectURL(file);
                container.setHtml('<div style="text-align: center"><a target="_blank" href="' + fileURL + '">Изображение</a> загружено из буфера обмена.' +
                    '<br>Нажмите Ctrl+V для загрузки нового.</div>')
                ExtMessages.topToast('Изображение из буфера обмена загружено')
            }
        }
    },

    dropPasteHandler: function() {
        document.onpaste = null
    }
})