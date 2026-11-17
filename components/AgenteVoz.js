import Script from 'next/script';

// Agente conversacional de ElevenLabs (burbuja flotante abajo a la derecha).
// El ID del agente no es secreto: es el mismo que va en el código de inserción de ElevenLabs.
// Se puede cambiar con la variable de entorno NEXT_PUBLIC_ELEVENLABS_AGENT_ID.
const AGENTE_ID = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || 'agent_4401m7mteg5dep0sxmgw29hgxabq';

export default function AgenteVoz() {
  return (
    <>
      {/* Los textos, colores e idioma de la burbuja se configuran en ElevenLabs → tu agente → Widget. */}
      <elevenlabs-convai agent-id={AGENTE_ID}></elevenlabs-convai>
      <Script src="https://unpkg.com/@elevenlabs/convai-widget-embed" strategy="afterInteractive" />
    </>
  );
}
