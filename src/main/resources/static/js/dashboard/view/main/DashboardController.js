Ext.define('Dashboard.view.main.DashboardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dashboardController',

    onChange: function(segmented, value) {
        var treelist = this.lookup('treelist'),
            navBtn = this.lookup('navBtn'),
            hasNav = value.indexOf('nav') !== -1,
            hasMicro = value.indexOf('micro') !== -1;

        if (value.length === 1 && !hasNav) {
            segmented.setValue(['nav', 'micro']);
        } else {
            treelist.setExpanderFirst(!hasNav);
            treelist.setMicro(hasMicro);
            treelist.setUi(hasNav ? 'nav' : null);

            treelist.setWidth(hasMicro ? this.measureWidth(treelist) : null);

            navBtn.setDisabled(hasMicro);
        }
    },

    measureWidth: function(treelist) {
        return treelist.toolsElement.getWidth();
    },

    painted: function (me) {
        ExtUtil.mRequest({
            url: '/properties/getPropertiesValues',
            method: 'GET',
            params: {
                propertiesPath: 'BOT_PROPERTIES',
                keys: ['bot.link']
            },
            success: function (response) {
                me.setText(TITLE)
                me.setHandler(function () {
                    window.open(response.body.data[0].value)
                })
            }
        })
        const eventSource = new EventSource("/notifications/listen");
        eventSource.onmessage = e => {
            let response = Ext.JSON.decode(e.data);
            let workspaceItem = ExtUtil.referenceQuery('dashboardWorkspace').getItems().items[0]
            let playSound = false
            switch (response.type) {
                case 'NEW_BOT_DEAL':
                case 'ADDITIONAL_VERIFICATION_RECEIVE':
                    ExtMessages.topToast(response.message)
                    ExtUtil.referenceQuery('notificationsTooltip').addNotification(response.message)
                    if (workspaceItem.xtype === 'botdealscontainer') Ext.getStore('botDealStore').reload()
                    playSound = true
                    break
                case 'ADD_MANUAL_DEAL':
                case 'CONFIRM_BOT_DEAL':
                case 'DELETE_BOT_DEAL':
                case 'ADDITIONAL_VERIFICATION_REQUEST':
                    if (workspaceItem.xtype === 'botdealscontainer') Ext.getStore('botDealStore').reload()
                    break
                case 'NEW_API_DEAL':
                case 'API_DEAL_CANCELED':
                    ExtMessages.topToast(response.message)
                    ExtUtil.referenceQuery('notificationsTooltip').addNotification(response.message)
                    if (workspaceItem.xtype === 'apidealscontainer') Ext.getStore('apiDealStore').reload()
                    playSound = true
                    break
                case 'NEW_PAYMENT':
                    ExtMessages.topToast(response.message)
                    ExtUtil.referenceQuery('notificationsTooltip').addNotification(response.message)
                    if (workspaceItem.xtype === 'botdealscontainer') Ext.getStore('dealPaymentStore').reload()
                    playSound = true
                    break
                case 'COURSE_GET_FAILED':
                    ExtMessages.topToast(response.message)
                    ExtUtil.referenceQuery('notificationsTooltip').addNotification(response.message)
                    playSound = true
                    break
                case 'CHANGED_DEAL_REQUEST_GROUP':
                    if (workspaceItem.xtype === 'botdealscontainer') {
                        let field = ExtUtil.referenceQuery('dealRequestGroupField')
                        field.setValue(response.data.title)
                        field.groupPid = response.data.pid
                        if (response.message)
                            ExtUtil.referenceQuery('notificationsTooltip').addNotification(response.message)
                        ExtMessages.topToast('Группа запросов сделок была обновлена')
                    }
                    break
                case 'CHANGED_AUTO_WITHDRAWAL_GROUP':
                    if (workspaceItem.xtype === 'botdealscontainer') {
                        let field = ExtUtil.referenceQuery('autoWithdrawalGroupField')
                        field.setValue(response.data.title)
                        field.groupPid = response.data.pid
                        if (response.message)
                            ExtUtil.referenceQuery('notificationsTooltip').addNotification(response.message)
                        ExtMessages.topToast('Группа автовывода сделок была обновлена')
                    }
                    break
                case 'REVIEW_ACTION':
                    if (workspaceItem.xtype === 'reviewcontainer') {
                        Ext.getStore('reviewStore').reload()
                    }
                    break
                case 'NEW_REVIEW':
                    ExtMessages.topToast(response.message)
                    ExtUtil.referenceQuery('notificationsTooltip').addNotification(response.message)
                    if (workspaceItem.xtype === 'reviewcontainer') {
                        Ext.getStore('reviewStore').reload()
                    }
                    break
            }
            if (playSound && NOTIFICATION_SOUND_ON) NOTIFICATION_SOUND.play().catch(error => console.log('Ошибка воспроизведения звука оповещения. ', error))
        }
        eventSource.onerror = () => console.log('Произошла ошибка SSE.');
    }
})