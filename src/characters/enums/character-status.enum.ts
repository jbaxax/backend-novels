// [MENTOR]: El estado vital del personaje dentro de la historia.
// Separamos este enum de CharacterRole porque son dos conceptos independientes:
// un personaje secundario puede estar muerto, un protagonista puede estar desaparecido.
export enum CharacterStatus {
  ALIVE = 'alive',
  DEAD = 'dead',
  MISSING = 'missing',
  UNKNOWN = 'unknown',
}
