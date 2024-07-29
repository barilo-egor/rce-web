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

            container.setHtml(CHECK_BUFFER_CONTAINER_TEXT)
            container.file = null
        }
    },

    setPasteHandler: function() {
        document.onpaste = (evt) => {
            let view = ExtUtil.referenceQuery('checkField')
            if (view.indexOf(view.getActiveItem()) !== 0) return
            const dT = evt.clipboardData || window.clipboardData;
            const file = dT.files[0];
            if (file && (file.type === 'application/pdf' || file.type.startsWith("image"))) {
                let container = ExtUtil.referenceQuery('checkBufferContainer')
                container.file = file
                const fileURL = URL.createObjectURL(file);
                container.setHtml('<div style="text-align: center"><a target="_blank" href="' + fileURL + '">Изображение</a> загружено из буфера обмена.' +
                    '<br>Нажмите Ctrl+V для загрузки нового.</div>')
                ExtMessages.topToast('Изображение загружено')
            }
        }
    },

    dropPasteHandler: function() {
        document.onpaste = null
    },

    setDefaultRequisite: function (me) {
        let field = me
        ExtUtil.mRequest({
            url: '/dashboard/api/util/lastDealRequisite',
            method: 'GET',
            async: false,
            success: function (response) {
                field.setValue(response.body.data.value)
            }
        })
    },

    setBrowseButtonText: function (fileField) {
        fileField.getFileButton().setText('Выбрать файл')
    },

    createDispute: function(button) {
        let fiatSum = ExtUtil.referenceQuery('fiatSumField').getValue()
        if (!fiatSum || fiatSum === 0) {
            ExtMessages.info('Внимание', 'Введите сумму.')
            return
        }

        let fileField = ExtUtil.referenceQuery('checkFileField')
        let file
        if (fileField.getFiles().length > 0) {
            file = fileField.getFiles()[0]
        }
        if (!file) {
            file = ExtUtil.referenceQuery('checkBufferContainer').file
        }
        if (!file) {
            ExtMessages.info('Внимание', 'Для создания диспута требуется чек.')
            return
        }


        if (file) {
            let formData = new FormData();
            formData.append('file', file);
            formData.append('fiatSum', fiatSum);
            formData.append('fiatCurrency', ExtUtil.referenceQuery('fiatCurrencyDisputeField').getValue());
            formData.append('dealType', ExtUtil.referenceQuery('dealTypeDisputeField').getValue());
            formData.append('cryptoCurrency', ExtUtil.referenceQuery('cryptoCurrencyDisputeField').getValue());
            formData.append('requisite', ExtUtil.referenceQuery('requisiteField').getValue());

            Ext.Ajax.request({
                url: '/dashboard/api/deal/dispute',  // URL для загрузки
                method: 'POST',
                rawData: formData,
                headers: {
                    'Content-Type': null  // Позволяет браузеру установить правильный заголовок
                },
                success: function (response) {

                },
                failure: function (response) {
                    Ext.Msg.alert('Ошибка', 'Не удалось загрузить изображение.');
                }
            });
        } else {
            Ext.Msg.alert('Ошибка', 'Пожалуйста, выберите файл.');
        }
    }
})