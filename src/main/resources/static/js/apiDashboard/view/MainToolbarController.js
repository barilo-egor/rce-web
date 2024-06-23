Ext.define('ApiDashboard.view.MainToolbarController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.mainToolbarController',

    painted: function (me) {
        ExtUtil.mRequest({
            url: '/dashboard/api/util/getBotLink',
            method: 'GET',
            async: false,
            success: function (response) {
                me.setText(TITLE)
                me.setHandler(function () {
                    window.open(response.body.data[0].value)
                })
            }
        })
        this.openSse()
    },

    openSse: function () {
        const eventSource = new EventSource("/dashboard/api/notifications/listen");
        eventSource.onmessage = e => {
            let response = Ext.JSON.decode(e.data);
            switch (response.type) {
                case 'CREATED_DEAL':
                case 'PAID_DEAL':
                case 'CANCELED_DEAL':
                case 'ACCEPTED_DEAL':
                case 'DECLINED_DEAL':
                    ExtMessages.topToast(response.message)
                    ExtUtil.referenceQuery('notificationsTooltip').addNotification(response.message)
                    Ext.getStore('dealStore').reload()
                    break
            }
            if (NOTIFICATION_SOUND_ON === true) NOTIFICATION_SOUND.play().catch(error => console.log('Ошибка воспроизведения звука оповещения. ', error))
        }
        eventSource.onerror = () => console.log('Произошла ошибка SSE.');
    },

    calculationsHandler: function (me) {
        ExtUtil.mRequest({
            url: '/dashboard/api/calculation/hasCalculations',
            method: 'GET',
            success: function (response) {
                if (response.body.data.hasCalculations === false) {
                    ExtMessages.topToast('У вас пока что отсутствуют расчёты.')
                    return
                }
                let store = Ext.getStore('calculationsStore')
                store.load({
                    callback: function() {
                        Ext.create('ApiDashboard.view.calculation.CalculationsDialog', {
                            viewModel: {
                                data: {
                                    store: store
                                }
                            }
                        }).show()
                    }
                })
            }
        })
    },

    statisticHandler: function (me) {
        Ext.create('ApiDashboard.view.statistic.DealStatisticDialog').show()
    },

    documentationHandler: function (me) {
        window.open('/api/10/documentation')
    },

    profileHandler: function (me) {
        Ext.create('ApiDashboard.view.profile.ProfileDialog').show()
    },

    logout: function (me) {
        window.location = '/logout'
    },

    setUsername: function (me) {
        ExtUtil.mRequest({
            url: '/dashboard/api/util/getUsername',
            method: 'GET',
            success: function (response) {
                me.setText(response.body.data.username)
            }
        })
    }
})