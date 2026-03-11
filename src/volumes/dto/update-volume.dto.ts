import { PartialType } from '@nestjs/mapped-types';
import { CreateVolumeDto } from './create-volume.dto';

// [MENTOR]: PartialType hace todos los campos opcionales automáticamente.
// Además hereda todas las validaciones de CreateVolumeDto — si mandas number,
// sigue validando que sea @IsInt() y @Min(1). No hay que repetirlo.
export class UpdateVolumeDto extends PartialType(CreateVolumeDto) {}
