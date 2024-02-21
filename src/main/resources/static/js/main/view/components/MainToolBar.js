Ext.define('Main.view.components.MainToolBar', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'maintoolbar',
    dock: 'left',
    id: 'mainToolBar',
    padding: '0 0 0 1',
    cls: 'main-toolbar',
    items: [
        {
            xtype: 'button',
            iconCls: 'fas fa-square-root-alt menu-icon-color',
            bind: {
                hidden: '{isNotAdmin}'
            },
            menu: [
                {
                    text: 'Курс доллара',
                    iconCls: 'fas fa-dollar-sign menu-icon-color',
                    handler: 'usdCourseClick'
                },
                {
                    text: 'Оптовые скидки',
                    iconCls: 'fas fa-tag menu-icon-color',
                    handler: 'bulkDiscountClick'
                },
            ],
        },
        {
            xtype: 'button',
            iconCls: 'fas fa-users menu-icon-color',
            menu: [
                {
                    text: 'Смена пароля',
                    iconCls: 'fas fa-key menu-icon-color',
                    handler: 'changePasswordClick'
                },
                {
                    text: 'Регистрация веб-пользователей',
                    iconCls: 'fas fa-user-plus menu-icon-color',
                    handler: 'newWebUserClick',
                    bind: {
                        hidden: '{isNotAdmin}'
                    }
                },
                {
                    text: 'Управление веб-пользователями',
                    iconCls: 'fas fa-users-cog menu-icon-color',
                    handler: 'webUserControlClick',
                    bind: {
                        hidden: '{isNotAdmin}'
                    }
                },
                {
                    text: 'Регистрация апи-пользователей',
                    iconCls: 'fas fa-user-plus menu-icon-color',
                    handler: 'newApiUserClick',
                    bind: {
                        hidden: '{isNotAdmin}'
                    }
                },
                {
                    text: 'Управление апи-пользователями',
                    iconCls: 'fas fa-users-cog menu-icon-color',
                    handler: 'apiUsersControlClick',
                    bind: {
                        hidden: '{isNotAdmin}'
                    }
                }
            ]
        },
        {
            xtype: 'button',
            iconCls: 'fas fa-shopping-cart menu-icon-color',
            bind: {
                hidden: '{isNotAdmin && isNotOperator}'
            },
            menu: [
                {
                    text: 'Типы оплат',
                    iconCls: 'fas fa-credit-card menu-icon-color',
                    handler: 'paymentTypesClick'
                }
            ]
        },
        {
            xtype: 'button',
            iconCls: 'fas fa-id-card-alt menu-icon-color',
            menu: [
                {
                    text: 'Сделки из бота',
                    iconCls: 'fas fa-robot menu-icon-color',
                    handler: 'botDealsClick'
                }
            ]
        },
        {
            xtype: 'button',
            iconCls: 'fas fa-gamepad menu-icon-color',
            menu: [
                {
                    text: 'Барабан',
                    iconCls: 'fas fa-drum menu-icon-color',
                    handler: 'slotReelClick'
                },
                {
                    text: 'КНБ',
                    iconCls: 'fas fa-hand-rock menu-icon-color',
                    handler: 'rpsClick'
                }
            ]
        }
    ]
})