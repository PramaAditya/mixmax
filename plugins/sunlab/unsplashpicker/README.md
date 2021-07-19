## UnsplashPicker
This plugin allows you to upload image directly through the Unsplash API.

#### Requirements
To use this plugin, you'll need to create an account on [Unsplash.com](https://unsplash.com/)
and fill your credentials on the backend settings

#### How to use
When you want to display the widget,
just use it in your fields.yaml file on an `attachMany` or `attachOne` relationship.
UnsplashPicker is an extension of FileUpload widget, you can use the same options:

    form:
        fields:
            featured_images:
                label: Featured images
                type: unsplashpicker
                imageHeight: 260
                imageWidth: 260
                maxFilesize: 12
                attachOnUpload: true
