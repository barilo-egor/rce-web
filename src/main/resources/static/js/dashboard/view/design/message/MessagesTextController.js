Ext.define('Dashboard.view.design.message.MessagesTextController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.messagesTextController',

    loadTextAndImage: function (me, newValue) {
        ExtUtil.mRequest({
            url: '/messages_text/text/' + newValue,
            method: 'GET',
            async: false,
            success: function (response) {
                ExtUtil.referenceQuery('messageTextField').setValue(response.data)
            }
        })
        ExtUtil.mRequest({
            url: '/messages_text/format/' + newValue,
            method: 'GET',
            async: false,
            success: function (response) {
                let panel = ExtUtil.referenceQuery('messageImagePanel')
                panel.removeAll()
                if (response.data == null) {
                    panel.add({
                        xtype: 'container',

                        layout: {
                            type: 'vbox',
                            align: 'center',
                            pack: 'center'
                        },
                        items: [
                            {
                                xtype: 'component',
                                html: 'Изображение отсутствует'
                            },
                            {
                                xtype: 'panel',
                                title: 'Загрузка файла',
                                reference: 'loadFileField',
                                margin: '20 0 0 0',
                                width: '95%',
                                height: 160,

                                buttons: [
                                    {
                                        text: 'Из буфера обмена',
                                        handler: 'showPrevious',
                                        reference: 'card-prev',
                                        disabled: true
                                    },
                                    {
                                        text: 'Выбрать на компьютере',
                                        reference: 'card-next',
                                        handler: 'showNext'
                                    }
                                ],

                                layout: {
                                    type: 'card'
                                },
                                defaults: {
                                    xtype: 'container',
                                    layout: {
                                        type: 'vbox',
                                        align: 'center',
                                        pack: 'middle'
                                    },
                                },
                                items: [
                                    {
                                        items: [
                                            {
                                                xtype: 'container',
                                                reference: 'bufferContainer',
                                                html: '<div style="text-align: center">Скопируйте изображение и нажмите Ctrl+V<br> для вставки из буфера обмена.</div>'
                                            }
                                        ]
                                    },
                                    {
                                        items: [
                                            {
                                                xtype: 'filefield',
                                                reference: 'checkFileField',
                                                label: 'Выберите изображение',
                                                width: '97%',
                                                accept: 'image/*,.pdf',
                                                listeners: {
                                                    painted: function (fileField) {
                                                        fileField.getFileButton().setText('Выбрать файл')
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    })
                } else if (response.data === '.jpg' || response.data === '.jpeg' || response.data === '.gif' || response.data === '.png') {
                    let src
                    if (response.data === '.jpg' || response.data === '.jpeg') {
                        src = 'messages_text/image/' + newValue
                    } else if (response.data === '.gif') {
                        src = 'messages_text/animation/' + newValue
                    } else {
                        src = 'messages_text/graphics/' + newValue
                    }
                    panel.add({
                        flex: 1,
                        width: '100%',
                        xtype: 'image',
                        src: src,
                        margin: '5 5 5 5',
                    })
                    panel.add({
                        xtype: 'button',
                        text: 'Удалить'
                    })
                } else if (response.data === '.mp4') {
                    panel.add({
                        flex: 1,
                        width: '100%',
                        xtype: 'video',
                        url: 'messages_text/video/' + newValue,
                        posterUrl: 'https://cdn.pixabay.com/photo/2013/07/12/16/56/play-151523_640.png'
                    })
                    panel.add({
                        xtype: 'button',
                        margin: '10 0 0 0',
                        text: 'Удалить'
                    })
                }
            }
        })
        ExtUtil.referenceQuery('messageImageEditButtonsContainer').disableButtons()
    },

    saveMessageImage: function (me) {
        let text = ExtUtil.referenceQuery('messageTextField').getValue()
        let messageImage = ExtUtil.referenceQuery('selectedMessageComboField').getValue()
        ExtUtil.request({
            url: 'messages_text/' + messageImage,
            method: 'PATCH',
            params: {
                text: text
            },
            success: function (response) {
                ExtUtil.referenceQuery('messageImageEditButtonsContainer').disableButtons()
                ExtMessages.topToast('Сообщение успешно обновлено.')
            }
        })
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