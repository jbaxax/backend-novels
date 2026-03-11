# Plan de Implementación — Backend Novelas (NestJS + PostgreSQL)

## Stack Tecnológico

- **Framework:** NestJS 11
- **Base de datos:** PostgreSQL
- **ORM:** TypeORM
- **Validación:** class-validator + class-transformer
- **UUID:** uuid / crypto (nativo en Node 18+)

---

## Fase 1 — Setup inicial

### 1.1 Instalar dependencias

```bash
npm install @nestjs/typeorm typeorm pg
npm install @nestjs/config
npm install class-validator class-transformer
npm install @nestjs/mapped-types
```

### 1.2 Configurar TypeORM en AppModule

Conectar NestJS con PostgreSQL via `TypeOrmModule.forRootAsync()` leyendo variables de entorno desde `.env`.

### 1.3 Variables de entorno

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=password
DB_NAME=novels_db
```

---

## Fase 2 — Módulos (orden de implementación)

Implementar en este orden respetando las dependencias entre tablas:

### Orden recomendado

```
1. novels          ← base de todo
2. volumes         ← depende de novels
3. chapters        ← depende de volumes
4. characters      ← depende de novels
5. character_relationships ← depende de characters
6. world_rules     ← depende de novels
7. locations       ← depende de novels (self-ref)
8. timeline_events ← depende de novels + chapters
9. chapter_characters ← tabla pivote (many-to-many chapters ↔ characters)
10. chat_sessions  ← depende de chapters
11. messages       ← depende de chat_sessions
```

---

## Fase 3 — Estructura de cada módulo

Cada módulo seguirá la estructura estándar de NestJS:

```
src/
└── <module>/
    ├── <module>.module.ts       ← registra el módulo y sus dependencias
    ├── <module>.controller.ts   ← define los endpoints HTTP
    ├── <module>.service.ts      ← lógica de negocio
    ├── entities/
    │   └── <module>.entity.ts   ← mapeo a tabla de PostgreSQL
    └── dto/
        ├── create-<module>.dto.ts   ← datos para crear
        └── update-<module>.dto.ts   ← datos para actualizar (Partial)
```

---

## Fase 4 — Endpoints por módulo

### novels
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /novels | Listar todas |
| GET | /novels/:id | Obtener una |
| POST | /novels | Crear |
| PATCH | /novels/:id | Actualizar |
| DELETE | /novels/:id | Eliminar |

### volumes
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /novels/:novelId/volumes | Volúmenes de una novela |
| GET | /volumes/:id | Obtener uno |
| POST | /novels/:novelId/volumes | Crear |
| PATCH | /volumes/:id | Actualizar |
| DELETE | /volumes/:id | Eliminar |

### chapters
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /volumes/:volumeId/chapters | Capítulos de un volumen |
| GET | /chapters/:id | Obtener uno |
| POST | /volumes/:volumeId/chapters | Crear |
| PATCH | /chapters/:id | Actualizar |
| DELETE | /chapters/:id | Eliminar |

### characters
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /novels/:novelId/characters | Personajes de una novela |
| GET | /characters/:id | Obtener uno |
| POST | /novels/:novelId/characters | Crear |
| PATCH | /characters/:id | Actualizar |
| DELETE | /characters/:id | Eliminar |

### character_relationships
| Método | Ruta |
|--------|------|
| GET | /characters/:characterId/relationships |
| POST | /characters/:characterId/relationships |
| PATCH | /character-relationships/:id |
| DELETE | /character-relationships/:id |

### world_rules, locations, timeline_events
Siguen el mismo patrón: nested bajo `/novels/:novelId/...`

### chat_sessions + messages
| Método | Ruta |
|--------|------|
| POST | /chapters/:chapterId/sessions | Nueva sesión de chat |
| GET | /sessions/:sessionId/messages | Historial |
| POST | /sessions/:sessionId/messages | Enviar mensaje |

---

## Fase 5 — Relaciones TypeORM clave

| Relación | Tipo |
|----------|------|
| Novel → Volumes | OneToMany |
| Volume → Chapters | OneToMany |
| Novel → Characters | OneToMany |
| Character → Relationships | OneToMany (self-ref) |
| Location → Location | ManyToOne self-ref (nullable) |
| Chapter ↔ Character | ManyToMany via chapter_characters |
| Chapter → ChatSessions | OneToMany |
| ChatSession → Messages | OneToMany |

---

## Próximo paso inmediato

Empezar por: **Fase 1 → Setup + módulo `novels`**
