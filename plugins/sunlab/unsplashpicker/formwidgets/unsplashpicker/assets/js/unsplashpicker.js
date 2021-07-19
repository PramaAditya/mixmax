+function ($) {
    "use strict";

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var UnsplashPicker = function (element, options) {
        this.$el = $(element)
        this.options = options || {}
        this.page = 1
        this.searchInput = $(element).find('.unsplash-search').first()
        this.resultsDiv = $(element).find('.field-fileupload').first()
        this.unsplashPreviewTemplate = $(this.options.unsplashPreviewTemplate)

        $.oc.foundation.controlUtils.markDisposable(element)
        Base.call(this)
        this.init()
    }

    UnsplashPicker.prototype = Object.create(BaseProto)
    UnsplashPicker.prototype.constructor = UnsplashPicker

    UnsplashPicker.prototype.init = function () {
        if (this.options.isPreview === null) {
            this.options.isPreview = this.$el.hasClass('is-preview')
        }
        this.$el.one('dispose-control', this.proxy(this.dispose))

        // Stop here for preview mode
        if (this.options.isPreview) {
            return
        }

        this.$el.on('click', '.search-btn', this.proxy(this.search))
        this.$el.on('click', '.load-more', this.proxy(this.loadMore))
    }

    UnsplashPicker.prototype.dispose = function () {
        this.$el.off('click', '.search-btn', this.proxy(this.search))
        this.$el.off('click', '.load-more', this.proxy(this.loadMore))
        this.$el.off('dispose-control', this.proxy(this.dispose))
        this.$el.removeData('oc.unsplashPicker')

        this.$el = null
        this.page = null
        this.searchInput = null
        this.resultsDiv = null
        this.unsplashPreviewTemplate = null
        this.DropZone = null

        // In some cases options could contain callbacks,
        // so it's better to clean them up too.
        this.options = null

        BaseProto.dispose.call(this)
    }

    UnsplashPicker.DEFAULTS = {}

    UnsplashPicker.prototype.loadMore = function () {
        this.page++
        this.search()
    }

    UnsplashPicker.prototype.search = function () {
        fetch(`https://api.unsplash.com/search/photos?query=${this.searchInput.val()}&per_page=12&page=${this.page}`, {
            method: 'GET',
            headers: {
                Authorization: `Client-ID ${this.options.apiKey}`
            }
        })
            .then(response => response.json())
            .then(data => {
                if (this.page === 1) {
                    this.resultsDiv.empty()
                }

                if (!data.results.length) {
                    this.resultsDiv.html('No results');
                }

                data.results.forEach((image) => {
                    var resultBlock = Mustache.render(
                        this.unsplashPreviewTemplate.html(),
                        {
                            id: image.id,
                            description: image.alt_description,
                            urls: {
                                thumb: image.urls.thumb,
                                regular: image.urls.regular,
                                full: image.urls.full,
                            },
                            size: {
                                width: image.width,
                                height: image.height
                            },
                            likes: image.likes,
                            author: {
                                name: image.user.name,
                                link: image.user.links.html
                            }
                        }
                    )

                    this.resultsDiv.append(resultBlock)
                })

                this.resultsDiv.find('.add-btn').off('click', this.proxy(this.addToFileUploader))
                this.resultsDiv.find('.add-btn').on('click', this.proxy(this.addToFileUploader))
            })
    }

    UnsplashPicker.prototype.addToFileUploader = function (event) {
        var currentTarget = $(event.currentTarget),
            imageId = currentTarget.data('imageId'),
            file = {
                name: `${this.searchInput.val()}-${imageId}`,
                size: 'unknown',
        }

        this.DropZone = $(`#${this.$el.data('uploaderId')}`)[0].dropzone

        this.DropZone.options.addedfile.call(this.DropZone, file)
        setTimeout(
            () =>
            file.previewElement = $(`#${this.$el.data('uploaderId')}`).find('.upload-object.dz-preview.dz-image-preview').last(),
            50
        )
        this.DropZone.options.thumbnail.call(this.DropZone, file, currentTarget.data('imageThumb'))

        this.saveOnServer({
            id: imageId,
            url: currentTarget.data('imageUrl'),
            title: currentTarget.data('imageTitle'),
            description: $(`#preview-${imageId} .author-text`).first().html(),
        }, file)
    }

    UnsplashPicker.prototype.saveOnServer = function (imageData, file) {
        $.request('onAddUnsplashImage', {
            data: {
                image_url: imageData.url,
                image_id: imageData.id,
                title: imageData.title,
                description: imageData.description,
                session_key: $('input[name=_session_key]').val()
            },
            success: response => {
                this.DropZone.options.success.call(file, response)
                var $preview = $(file.previewElement)

                $preview.addClass('is-success')

                if (response.id) {
                    var filesize = this.getFilesize(response.size)
                    $preview.data('id', response.id)
                    $preview.data('path', response.path)
                    $('.upload-remove-button', $preview).data('request-data', {file_id: response.id})
                    $('.image img', $preview).attr('src', response.thumb)


                    if ($(`#${this.$el.data('uploaderId')}`).hasClass('style-image-single')) {
                        $(`#${this.$el.data('uploaderId')}`).addClass('is-populated');
                    }

                    $preview.find('[data-dz-name]').html(response.name)
                    $preview.find('[data-dz-size]').html('<strong>' + filesize.size + '</strong> ' + filesize.units)
                }
            },
            error: function (response, status) {
                $.oc.flashMsg({ text: response.responseText, class: status });
                $(file.previewElement).remove();
            }
        });
    }

    UnsplashPicker.prototype.getFilesize = function (filesize) {
        var formatter = new Intl.NumberFormat('en', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
            }),
            size = 0,
            units = 'bytes'

        if (filesize >= 1073741824) {
            size = formatter.format(filesize / 1073741824)
            units = 'GB'
        } else if (filesize >= 1048576) {
            size = formatter.format(filesize / 1048576)
            units = 'MB'
        } else if (filesize >= 1024) {
            size = formatter.format(filesize / 1024)
            units = 'KB'
        } else if (filesize > 1) {
            size = filesize
            units = 'bytes'
        } else if (filesize === 1) {
            size = 1
            units = 'byte'
        }

        return {
            size: size,
            units: units
        }
    }

    // PLUGIN DEFINITION
    // ============================

    var old = $.fn.unsplashPicker

    $.fn.unsplashPicker = function (option) {
        var args = Array.prototype.slice.call(arguments, 1), items, result

        items = this.each(function () {
            var $this = $(this)
            var data = $this.data('oc.unsplashPicker')
            var options = $.extend({}, UnsplashPicker.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) {
                $this.data('oc.unsplashPicker', (data = new UnsplashPicker(this, options)))
            }

            if (typeof option == 'string') {
                result = data[option].apply(data, args)
            }

            if (typeof result != 'undefined') {
                return false
            }
        })

        return result ? result : items
    }

    $.fn.unsplashPicker.Constructor = UnsplashPicker

    $.fn.unsplashPicker.noConflict = function () {
        $.fn.unsplashPicker = old
        return this
    }


    $(document).render(function () {
        $('[data-control="unsplash-picker"]').unsplashPicker()
    })

}(window.jQuery);
