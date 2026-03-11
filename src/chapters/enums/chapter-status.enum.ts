// [MENTOR]: Un enum define un conjunto cerrado de valores válidos.
// En vez de que 'status' sea cualquier string, solo puede ser uno de estos dos.
// Ventaja: si escribes ChapterStatus.DRAF (typo), TypeScript te lo dice en compilación.
// Si usaras el string 'draf' directamente, el error solo aparecería en runtime (más tarde y más difícil de encontrar).
export enum ChapterStatus {
  DRAFT = 'draft',
  COMPLETE = 'complete',
}
