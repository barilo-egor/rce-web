Ext.define('Dashboard.view.design.message.LoadImageContainer', {
    extend: 'Ext.Container',
    xtype: 'loadimagecontainer',
    requires: [
        'Dashboard.view.design.message.LoadImageController'
    ],
    controller: 'loadImageController',

    listeners: {
        added: 'setPasteHandler',
        destroy: 'dropPasteHandler'
    },

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },
    items: [
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
                            reference: 'newImageField',
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
        },
        {
            xtype: 'button',
            reference: 'loadButton',
            text: 'Загрузить',
            handler: 'load'
        }
    ]
})