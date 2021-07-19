<?php return [
    'plugin' => [
        'name' => 'Page Preview',
        'description' => 'Preview your pages before save. Markup, code, AJAX, components and responsiveness check support.'
    ],
    'formwidget' => [
        'loading' => 'Loading...',
        'inspector' => [
            'title' => 'Preview settings',
            'description' => 'Change the following fields to customize the preview.',
            'url_slugs_title' => 'URL slugs',
            'url_slugs_description' => 'If your page URL contains :slugs, define them here to preview the corresponding page.',
            'get_params_title' => 'GET parameters',
            'get_params_description' => 'Add custom $_GET parameters.',
            'post_params_title' => 'POST parameters',
            'post_params_description' => 'Add custom $_POST parameters.',
            'is_user_title' => 'User logged in',
            'is_user_description' => 'Is the user logged in during the preview?'
        ]
    ]
];