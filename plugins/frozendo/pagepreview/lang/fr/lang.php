<?php return [
    'plugin' => [
        'name' => 'Aperçu',
        'description' => 'Prévisualisez vos pages avant de les sauvegarder. Prend en compte le markup, le code, AJAX, les composants et le responsive.'
    ],
    'formwidget' => [
        'loading' => 'Chargement...',
        'inspector' => [
            'title' => 'Paramètres de l\'aperçu',
            'description' => 'Modifiez les champs suivants pour personnaliser l\'aperçu.',
            'url_slugs_title' => 'Tags d\'URL',
            'url_slugs_description' => 'Si l\'URL de votre page contient des :tags, entrez les ici pour afficher la page correspondante.',
            'get_params_title' => 'Paramètres GET',
            'get_params_description' => 'Ajoutez des paramètres $_GET personnalisés.',
            'post_params_title' => 'Paramètres POST',
            'post_params_description' => 'Ajoutez des paramètres $_POST personnalisés.',
            'is_user_title' => 'Utilisateur connecté',
            'is_user_description' => 'L\'utilisateur est-il connecté pendant l\'aperçu ?'
        ]
    ]
];