<?php return [
    'plugin' => [
        'description' => 'Add Unsplash API to FileUpload widget'
    ],

    'permission' => [
        'label' => 'Access and manage Unsplash credentials'
    ],

    'settings' => [
        'description' => 'Manage Unsplash credentials',

        'fields' => [
            'api_key' => [
                'label' => 'API Key'
            ],
            'api_secret' => [
                'label' => 'API Secret'
            ],
        ]
    ],

    'misc' => [
        'search' => 'Search',
        'load_more' => 'Load more',
        'photo_by' => 'Photo by',
        'on' => 'on',
        'input_placeholder' => 'Search on Unsplash.com'
    ]
];
