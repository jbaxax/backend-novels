import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateVolumeDto {
  // [MENTOR]: @IsUUID() valida que el valor sea un UUID con formato correcto.
  // Recibe el novelId en el body porque el cliente elige a qué novela pertenece el volumen.
  // Alternativamente podría venir en la URL (/novels/:novelId/volumes),
  // pero eso complica el routing. En el body es más simple y igual de válido.
  @IsUUID()
  novelId: string;

  // [MENTOR]: @IsInt() + @Min(1) valida que number sea un entero mayor o igual a 1.
  // No tiene sentido un volumen 0 o negativo. Esta validación lo previene
  // antes de llegar a la BD, sin consultar nada.
  @IsInt()
  @Min(1)
  number: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  synopsis?: string;

  @IsOptional()
  @IsString()
  focus?: string;
}
