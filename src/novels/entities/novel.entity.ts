import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

// [MENTOR]: @Entity() le dice a TypeORM "esta clase representa una tabla en la BD".
// Sin este decorador, TypeORM ignora completamente la clase.
// El nombre de la tabla por defecto será 'novel' (singular, en minúscula).
@Entity()
export class Novel {
  // [MENTOR]: @PrimaryGeneratedColumn('uuid') hace dos cosas:
  // 1. Marca este campo como PRIMARY KEY en la BD
  // 2. Le dice a TypeORM que genere automáticamente un UUID al insertar
  // Usamos UUID en vez de integer autoincremental porque:
  // - No expone cuántos registros tienes ("el usuario 1, el usuario 2...")
  // - Puedes generar IDs en el frontend sin consultar la BD
  // - Son únicos globalmente (útil si algún día mergeas datos de varias BDs)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // [MENTOR]: @Column() mapea esta propiedad a una columna de la tabla.
  // Por defecto TypeORM infiere el tipo SQL desde el tipo TypeScript:
  // string → varchar, number → integer, boolean → boolean, etc.
  @Column()
  title: string;

  // [MENTOR]: { nullable: true } permite que esta columna sea NULL en la BD.
  // En TypeScript lo marcamos con "| null" para que el tipo sea honesto:
  // si puede ser null en BD, debe poder ser null en el código también.
  @Column({ type: 'text', nullable: true })
  description: string | null;

  // [MENTOR]: @CreateDateColumn() es un decorador especial de TypeORM.
  // Automáticamente setea el valor al timestamp actual cuando se crea el registro.
  // No necesitas setearlo manualmente en el servicio — TypeORM lo hace solo.
  @CreateDateColumn()
  created_at: Date;
}
