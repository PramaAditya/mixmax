+function ($) { "use strict";
    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var PagePreview = function (element, options) {
        this.$el = $(element)
        this.$form = this.$el.closest('form')
        this.$iframe = this.$el.find('iframe')
        this.$inspector = this.$el.find('button[data-inspectable]')
        this.$button = null
        this.$loading = null
        this.options = options || {}
        this.showModal = false

        $.oc.foundation.controlUtils.markDisposable(element)
        Base.call(this)
        this.init()
    }

    PagePreview.prototype = Object.create(BaseProto)
    PagePreview.prototype.constructor = PagePreview

    PagePreview.prototype.init = function() {
        var $defaultPreviewButton = this.$form.find('[data-control="preview-button"]')

        if (this.options.replacePreviewButton) {
            this.$button = $('<a href="javascript:;" class="btn btn-default oc-icon-eye">' + this.options.buttonText + '</a>').replaceAll($defaultPreviewButton)
        } else {
            this.$button = $('<button type="button" class="btn btn-default empty oc-icon-eye"></button>').insertBefore($defaultPreviewButton)
        }

        this.$loading = this.$button.closest('.loading-indicator-container')

        this.$button.on('click', this.proxy(this.onPreviewClick))
        this.$iframe.on('load', this.proxy(this.onFrameLoad))
        this.$inspector.on('change.oc.inspector', this.proxy(this.onInspectorChange))
        this.$inspector.on('hiding.oc.inspector', this.proxy(this.onInspectorHiding))
        this.$inspector.on('hidden.oc.inspector', this.proxy(this.onInspectorHidden))
        this.$el.on('hidden.bs.modal', this.proxy(this.onModalHide))
        this.$el.find('.frozendo-pagepreview-switch').on('click', this.proxy(this.onSwitchClick))
        this.$el.one('dispose-control', this.proxy(this.dispose))
    }

    PagePreview.prototype.dispose = function() {
        this.$button.off('click', this.proxy(this.onPreviewClick))
        this.$iframe.off('load', this.proxy(this.onFrameLoad))
        this.$inspector.off('change.oc.inspector', this.proxy(this.onInspectorChange))
        this.$inspector.off('hiding.oc.inspector', this.proxy(this.onInspectorHiding))
        this.$inspector.off('hidden.oc.inspector', this.proxy(this.onInspectorHidden))
        this.$el.off('hidden.bs.modal', this.proxy(this.onModalHide))
        this.$el.find('.frozendo-pagepreview-switch').off('click', this.proxy(this.onSwitchClick))
        this.$el.off('dispose-control', this.proxy(this.dispose))
        this.$el.removeData('oc.pagePreview')

        this.$el = null
        this.$form = null
        this.$iframe = null
        this.$inspector = null
        this.$button = null
        this.$loading = null
        this.options = null

        BaseProto.dispose.call(this)
    }

    PagePreview.prototype.preview = function() {
        this.$form.trigger('oc.beforeRequest')
        var oldAction = this.$form.attr('action')
        this.$form.attr('action', this.options.url)
        this.$form.attr('target', this.$iframe.attr('name'))
        this.$form.submit()
        this.$form.removeAttr('target')
        this.$form.attr('action', oldAction)
    }

    PagePreview.prototype.onPreviewClick = function() {
        this.$loading.loadIndicator({ text: this.options.loadingLabel })
        this.showModal = true
        this.preview()
    }

    PagePreview.prototype.onFrameLoad = function() {
        if (this.showModal) {
            this.showModal = false
            this.$el.modal()
            this.$loading.loadIndicator('hide')
        }
    }

    PagePreview.prototype.onInspectorChange = function() {
        this.preview()
    }

    PagePreview.prototype.onInspectorHiding = function() {
        this.$form.data("oc.changeMonitor").pause()
    }

    PagePreview.prototype.onInspectorHidden = function() {
        this.$form.data("oc.changeMonitor").resume()
    }

    PagePreview.prototype.onModalHide = function() {
        // Cut sound if video is playing
        this.$iframe.attr('src', 'about:blank')
    }

    PagePreview.prototype.onSwitchClick = function(e) {
        if (!$(e.target).hasClass('active')) {
            this.$el.find('.frozendo-pagepreview-switch').removeClass('active')
            $(e.target).addClass('active')
            this.$el.children().animate({ width: $(e.target).data('width') })
        }
    }

    PagePreview.DEFAULTS = {
        'replacePreviewButton': false
    }

    // PLUGIN DEFINITION
    // ============================

    var old = $.fn.pagePreview

    $.fn.pagePreview = function (option) {
        var args = Array.prototype.slice.call(arguments, 1), items, result

        items = this.each(function() {
            var $this   = $(this)
            var data    = $this.data('oc.pagePreview')
            var options = $.extend({}, PagePreview.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.pagePreview', (data = new PagePreview(this, options)))
            if (typeof option == 'string') result = data[option].apply(data, args)
            if (typeof result != 'undefined') return false
        })

        return result ? result : items
    }

    $.fn.pagePreview.Constructor = PagePreview

    $.fn.pagePreview.noConflict = function() {
        $.fn.pagePreview = old
        return this
    }

    $(document).render(function() {
        $('[data-control="pagepreview"]').pagePreview()
    })

}(window.jQuery);
