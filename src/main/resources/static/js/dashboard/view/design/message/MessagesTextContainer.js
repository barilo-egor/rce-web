Ext.define('Dashboard.view.design.message.MessagesTextContainer', {
    extend: 'Ext.Container',
    xtype: 'messagestextcontainer',
    requires: [
        'Dashboard.view.design.message.MessagesTextController'
    ],
    controller: 'messagesTextController',
    reference: 'messagesTextContainer',

    layout: 'fit',
    items: [
        {
            xtype: 'panel',

            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'toolbar',
                    docked: 'top',

                    items: [
                        {
                            xtype: 'combobox',
                            reference: 'selectedMessageComboField',

                            listeners: {
                                painted: ExtUtil.forceComboFirstValue,
                                change: 'loadTextAndImage'
                            },
                            store: Ext.create('Dashboard.store.enum.MessageImageStore'),

                            label: 'Сообщение:',
                            width: '100%',
                            displayField: 'description',
                            valueField: 'name',
                            editable: false,
                            queryMode: 'local',
                        },
                    ]
                },
                {
                    flex: 1,
                    xtype: 'container',

                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },

                    items: [
                        {
                            flex: 0.5,
                            xtype: 'panel',

                            title: 'Текст сообщения',

                            tools: [
                                ExtUtilConfig.getHelpDialogTool('Редактирование текста',
                                    'Все переменные <b>%s</b> должны остаться в том же количестве.<br><br>' +
                                    'Форматирование текста:<br>' +
                                    'Жирный: <b>&lt;b&gt;</b><i>текст</i><b>&lt;/b&gt;</b><br>' +
                                    'Курсив: <b>&lt;i&gt;</b><i>текст</i><b>&lt;/i&gt;</b><br>' +
                                    'Подчёркнутый: <b>&lt;u&gt;</b><i>текст</i><b>&lt;/u&gt;</b><br>' +
                                    'Зачёркнутый: <b>&lt;s&gt;</b><i>текст</i><b>&lt;/s&gt;</b><br>' +
                                    'Код: <b>&lt;code&gt;</b><i>текст</i><b>&lt;/code&gt;</b><br>' +
                                    'Блок кода: <b>&lt;pre&gt;</b><i>текст</i><b>&lt;/pre&gt;</b><br>')
                            ],

                            shadow: true,
                            margin: '10 5 10 10',
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    flex: 1,
                                    xtype: 'textareafield',
                                    reference: 'messageTextField',
                                    margin: '10 10 10 10',
                                    listeners: {
                                        change: function () {
                                            ExtUtil.referenceQuery('messageImageEditButtonsContainer').enableButtons()
                                        }
                                    }
                                },
                                {
                                    xtype: 'container',
                                    reference: 'messageImageEditButtonsContainer',

                                    margin: '5 0 5 0',

                                    layout: {
                                        type: 'hbox',
                                        align: 'middle',
                                        pack: 'center'
                                    },
                                    disableButtons: function () {
                                        this.items.items[0].setDisabled(true)
                                        this.items.items[1].setDisabled(true)
                                    },
                                    enableButtons: function () {
                                        this.items.items[0].setDisabled(false)
                                        this.items.items[1].setDisabled(false)
                                    },
                                    items: [
                                        {
                                            xtype: 'button',
                                            text: 'Сохранить',
                                            handler: 'saveMessageImage',
                                            disabled: true
                                        },
                                        {
                                            xtype: 'button',
                                            text: 'Отмена',
                                            handler: 'cancelEdit',
                                            disabled: true
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            flex: 0.5,
                            xtype: 'panel',
                            reference: 'messageImagePanel',

                            title: 'Изображение/Анимация',
                            shadow: true,
                            margin: '10 10 10 5',
                            padding: '10 10 10 10',

                            layout: {
                                type: 'vbox',
                                align: 'center',
                                pack: 'center'
                            }
                        }
                    ]
                }
            ]
        }
    ]
})