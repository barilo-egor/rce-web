const CHECK_BUFFER_CONTAINER_TEXT = '<div style="text-align: center">Скопируйте изображение и нажмите Ctrl+V<br> для вставки из буфера обмена.</div>'
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
        show: 'setPasteHandler',
        close: 'dropPasteHandler'
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
            defaults: {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                }
            },
            items: [
                {
                    flex: 0.25,
                    defaults: {
                        margin: '0 20 0 20',
                    },
                    items: [
                        {
                            flex: 0.33,
                            xtype: 'numberfield',
                            width: '50%',
                            label: 'Фиатная сумма',
                        },
                        {
                            flex: 0.66,
                            xtype: 'textfield',
                            label: 'Реквизит'
                        }
                    ]
                },
                {
                    flex: 0.75,
                    defaults: {
                        xtype: 'container',
                        margin: '0 20 0 20',

                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        }
                    },
                    items: [
                        {
                            flex: 0.33,
                            defaults: {
                                xtype: 'combobox',
                                editable: false,
                                required: true,
                                queryMode: 'local',
                                valueField: 'name'
                            },
                            items: [
                                {
                                    label: 'Фиатная валюта',
                                    displayField: 'displayName',
                                    store: {
                                        type: 'fiatCurrenciesStore',
                                        listeners: {
                                            load: 'setDefaultFiat'
                                        }
                                    },
                                    reference: 'fiatCurrencyDisputeField'
                                },
                                {
                                    label: 'Тип сделки',
                                    displayField: 'nominativeFirstUpper',
                                    store: {
                                        type: 'dealTypesStore',
                                        listeners: {
                                            load: 'setDefaultDealType'
                                        }
                                    },
                                    reference: 'dealTypeDisputeField',
                                },
                                {
                                    label: 'Криптовалюта',
                                    displayField: 'name',
                                    store: {
                                        type: 'cryptoCurrenciesStore',
                                        listeners: {
                                            load: 'setDefaultCrypto'
                                        }
                                    },
                                    reference: 'cryptoCurrencyDisputeField',
                                }
                            ]
                        },
                        {
                            flex: 0.66,
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
                                                    reference: 'checkBufferContainer',
                                                    html: CHECK_BUFFER_CONTAINER_TEXT
                                                }
                                            ]
                                        },
                                        {
                                            items: [
                                                {
                                                    xtype: 'filefield',
                                                    label: 'Выберите изображение',
                                                    reference: 'checkFileField',
                                                    width: '97%',
                                                    accept: 'image/*,.pdf',
                                                    listeners: {
                                                        painted: 'setBrowseButtonText'
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
            handler: 'createDispute'
        }
    ]
});
