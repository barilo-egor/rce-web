let CommonTrigger = {
    password: {
        show: {
            cls: 'x-form-show-trigger',
            handler: function () {
                this.inputEl.dom.type = 'text'
                this.getTriggers().show.cls = 'x-form-hide-trigger'
                this.getTriggers().show.hide()
                this.getTriggers().hide.show()
            }
        },
        hide: {
            cls: 'x-form-hide-trigger',
            hidden: true,
            handler: function () {
                this.inputEl.dom.type = 'password'
                this.getTriggers().show.cls = 'x-form-show-trigger'
                this.getTriggers().hide.hide()
                this.getTriggers().show.show()
            }
        }
    }
}