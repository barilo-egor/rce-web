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
                    panel.add(Ext.create('Dashboard.view.design.message.LoadImageContainer'))
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
                        xtype: 'container',
                        scrollable: true,
                        width: '100%',
                        flex: 1,
                        layout: 'fit',
                        items: [
                            {
                                xtype: 'image',
                                src: src,
                                margin: '5 5 5 5',
                                mode: 'fit',
                                imageStyle: {
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain' // Важный параметр для нужной подгонки
                                }
                            }
                        ]
                    })
                    panel.add({
                        xtype: 'button',
                        text: 'Удалить',
                        margin: '10 0 0 0',
                        handler: 'deleteImage'
                    })
                } else if (response.data === '.mp4') {
                    panel.add({
                        flex: 1,
                        xtype: 'video',
                        width: '100%',
                        url: 'messages_text/video/' + newValue,
                        posterUrl: 'https://cdn.pixabay.com/photo/2013/07/12/16/56/play-151523_640.png'
                    })
                    panel.add({
                        xtype: 'button',
                        text: 'Удалить',
                        margin: '10 0 0 0',
                        handler: 'deleteImage'
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

    deleteImage: function (button) {
        ExtUtil.mask('messagesTextContainer', 'Удаление изображения')
        let messageImage = ExtUtil.referenceQuery('selectedMessageComboField').getValue()
        ExtUtil.mRequest({
            url: '/messages_text/image/' + messageImage,
            async: false,
            method: 'DELETE',
            loadingComponentRef: 'messagesTextContainer',
            success: function (response) {
                ExtUtil.maskOff('messagesTextContainer')
                ExtMessages.topToast('Изображение удалено.')
                ExtUtil.referenceQuery('messagesTextContainer').getController().loadTextAndImage(null, messageImage)
            }
        })
    },

    cancelEdit: function (button) {
        let messageImage = ExtUtil.referenceQuery('selectedMessageComboField').getValue()
        ExtUtil.referenceQuery('messagesTextContainer').getController().loadTextAndImage(null, messageImage)
    }
})