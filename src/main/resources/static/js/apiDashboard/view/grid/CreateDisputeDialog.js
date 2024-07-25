Ext.define('ApiDashboard.view.grid.CreateDisputeDialog', {
    extend: 'Ext.Dialog',
    requires: [
        'ApiDashboard.view.grid.CreateDisputeController'
    ],
    controller: 'createDisputeController',
    title: 'Создание диспута',
    closable: true,
    width: 750,

    listeners: {
        show: function (me) {
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
            };
        },
        close: function (me) {
            document.onpaste = null
        }
    },

    layout: {
        type: 'vbox',
        align: 'center'
    },
    items: [
        {
            xtype: 'container',
            flex: 1,
            width: '100%',

            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    flex: 0.25,
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            flex: 0.33,
                            margin: '0 20 0 20',
                            xtype: 'numberfield',
                            width: '50%',
                            label: 'Фиатная сумма',
                        },
                        {
                            flex: 0.66,
                            margin: '0 20 0 20',
                            xtype: 'textfield',
                            label: 'Реквизит'
                        }
                    ]
                },
                {
                    flex: 0.75,
                    xtype: 'container',

                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            flex: 0.33,
                            xtype: 'container',
                            margin: '0 20 0 20',

                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'combobox',
                                    label: 'Фиатная валюта',
                                    editable: false,
                                    required: true,
                                    queryMode: 'local',
                                    valueField: 'name',
                                    displayField: 'displayName',
                                    store: {
                                        type: 'fiatCurrenciesStore',
                                        listeners: {
                                            load: function (me) {
                                                // TODO сделать выбор фиата который по умолчанию
                                                ExtUtil.referenceQuery('fiatCurrencyDisputeField').setValue(me.getAt(0))
                                            }
                                        }
                                    },
                                    reference: 'fiatCurrencyDisputeField'
                                },
                                {
                                    xtype: 'combobox',
                                    label: 'Тип сделки',
                                    editable: false,
                                    required: true,
                                    queryMode: 'local',
                                    valueField: 'name',
                                    displayField: 'nominativeFirstUpper',
                                    store: {
                                        type: 'dealTypesStore',
                                        listeners: {
                                            load: function (me, records) {
                                                ExtUtil.referenceQuery('dealTypeDisputeField').setValue(me.getAt(0))
                                            }
                                        }
                                    },
                                    reference: 'dealTypeDisputeField',
                                },
                                {
                                    xtype: 'combobox',
                                    label: 'Криптовалюта',
                                    editable: false,
                                    required: true,
                                    queryMode: 'local',
                                    valueField: 'name',
                                    displayField: 'name',
                                    store: {
                                        type: 'cryptoCurrenciesStore',
                                        listeners: {
                                            load: function (me, records) {
                                                // TODO самый популярный среди последних сделок
                                                ExtUtil.referenceQuery('cryptoCurrencyDisputeField').setValue(me.getAt(0))
                                            }
                                        }
                                    },
                                    reference: 'cryptoCurrencyDisputeField',
                                }
                            ]
                        },
                        {
                            flex: 0.66,
                            xtype: 'container',
                            margin: '0 20 0 20',

                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'panel',
                                    title: 'Чек',
                                    reference: 'checkField',
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
                                    items: [
                                        {
                                            xtype: 'container',
                                            layout: {
                                                type: 'vbox',
                                                align: 'center',
                                                pack: 'middle'
                                            },
                                            items: [
                                                {
                                                    xtype: 'container',
                                                    reference: 'checkBufferContainer',
                                                    html: '<div style="text-align: center">Скопируйте изображение и нажмите Ctrl+V<br> для вставки из буфера обмена.</div>'
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'container',
                                            layout: {
                                                type: 'vbox',
                                                align: 'center',
                                                pack: 'middle'
                                            },
                                            items: [
                                                {
                                                    xtype: 'filefield',
                                                    label: 'Выберите изображение',
                                                    reference: 'checkFileField',
                                                    width: '97%',
                                                    accept: 'image/*,.pdf',
                                                    listeners: {
                                                        painted: function (filefield) {
                                                            filefield.getFileButton().setText('Выбрать файл')
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'button',
            reference: 'createButton',
            margin: '20 0 0 0',
            text: 'Создать',
            handler: function(button) {
                let fileField = ExtUtil.referenceQuery('checkFileField')
                let file = fileField.getFiles()[0];

                if (file) {
                    let formData = new FormData();
                    formData.append('file', file);

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
        }
    ]
});
