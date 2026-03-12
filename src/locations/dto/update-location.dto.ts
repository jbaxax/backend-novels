import { PartialType } from '@nestjs/mapped-types';
import { CreateLocationDto } from './create-location.dto';

// [MENTOR]: Con PartialType puedes mover un lugar a otro padre mandando solo { parentId: "nuevo-uuid" },
// o sacarlo del árbol mandando { parentId: null } — aunque null requiere @Allow() extra.
// Por ahora esto cubre el 99% de los casos de uso.
export class UpdateLocationDto extends PartialType(CreateLocationDto) {}
