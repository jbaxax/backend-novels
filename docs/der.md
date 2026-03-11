  Table novels {
    id uuid [pk]
    title varchar
    description text
    created_at timestamp
  }

  Table volumes {
    id uuid [pk]
    novel_id uuid [ref: > novels.id]
    number int
    title varchar
    synopsis text
    focus text  // "En este volumen se centra en X conflicto"
    created_at timestamp
  }

  Table chapters {
    id uuid [pk]
    volume_id uuid [ref: > volumes.id]
    number int
    title varchar
    summary text  // resumen breve — se inyecta como contexto
    content text  // texto del capítulo
    status varchar  // draft, complete
    created_at timestamp
  }

  Table characters {
    id uuid [pk]
    novel_id uuid [ref: > novels.id]
    name varchar
    role varchar  // protagonist, antagonist, secondary, background
    age int
    physical_description text  // apariencia física completa
    personality text  // cómo es su carácter
    strengths text
    weaknesses text
    fears text
    goals text  // qué quiere lograr
    motivations text  // por qué lo quiere
    backstory text  // historia previa relevante
    status varchar  // alive, dead, missing, unknown
    created_at timestamp
  }

  Table character_relationships {
    id uuid [pk]
    character_id uuid [ref: > characters.id]       // quién siente
    related_character_id uuid [ref: > characters.id] // hacia quién
    relationship_type varchar  // family, friend, rival, enemy, lover, mentor
    emotional_dynamic varchar  // hate, repulsion, admiration, love, fear, distrust, indifference
    description text  // detalle libre de la relación
    is_mutual boolean  // ¿el otro siente lo mismo?
  }

  Table world_rules {
    id uuid [pk]
    novel_id uuid [ref: > novels.id]
    category varchar  // magic, technology, social, geography, biology
    name varchar
    description text
    is_breakable boolean  // ¿puede romperse esta regla en la historia?
  }

  Table locations {
    id uuid [pk]
    novel_id uuid [ref: > novels.id]
    name varchar
    description text
    connected_to uuid [ref: > locations.id, null]  // locación padre (país > ciudad > lugar)
  }

  Table timeline_events {
    id uuid [pk]
    novel_id uuid [ref: > novels.id]
    chapter_id uuid [ref: > chapters.id, null]  // null si es lore previo
    title varchar
    description text
    story_date varchar  // "Año 3 del Imperio", puede ser texto libre
    importance varchar  // low, medium, high, critical
    created_at timestamp
  }

  Table chapter_characters {
    chapter_id uuid [ref: > chapters.id]
    character_id uuid [ref: > characters.id]
    // tabla pivote: qué personajes aparecen en cada capítulo
  }

  Table chat_sessions {
    id uuid [pk]
    chapter_id uuid [ref: > chapters.id]
    created_at timestamp
  }

  Table messages {
    id uuid [pk]
    session_id uuid [ref: > chat_sessions.id]
    role varchar  // user, assistant
    content text
    created_at timestamp
  }