<?php return [
    'plugin' => [
        'name' => 'Oldal előnézete',
        'description' => 'Lapok megtekintése mentés nélkül reszponzív lehetőséggel.'
    ],
    'formwidget' => [
        'loading' => 'Betöltés...',
        'inspector' => [
            'title' => 'Megjelenési beállítások',
            'description' => 'Az előnézet testreszabása.',
            'url_slugs_title' => 'Webcímek',
            'url_slugs_description' => 'Ha a webcím tartalmaz :slug paramétereket, akkor itt adhatja meg a megjelenésük helyét.',
            'get_params_title' => 'GET paraméterek',
            'get_params_description' => 'Egyedi $_GET típusú paraméterek hozzáadása.',
            'post_params_title' => 'POST paraméterek',
            'post_params_description' => 'Egyedi $_POST típusú paraméterek hozzáadása.',
            'is_user_title' => 'Felhasználó bejelentkezve',
            'is_user_description' => 'A megtekintés alatt a felhasználó be van jelentkezve?'
        ]
    ]
];