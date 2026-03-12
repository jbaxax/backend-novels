// [MENTOR]: Estos dos valores no son arbitrarios — son exactamente los que usa
// la API de Anthropic (Claude) y OpenAI en sus endpoints de chat.
//
// Cuando construyas el historial para enviarle a la IA, tus mensajes ya estarán
// en el formato correcto sin ninguna transformación extra:
//
// [
//   { role: 'user',      content: '¿Cómo debería empezar el capítulo 3?' },
//   { role: 'assistant', content: 'Podrías arrancar con una escena de tensión...' },
//   { role: 'user',      content: 'Me gusta, pero hazlo más oscuro' },
// ]
//
// Diseñar el enum alineado al contrato de la API externa que consumirás
// es una buena práctica que te ahorra transformaciones en el futuro.
export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}
