import { useEffect } from "react";
import Pusher from "pusher-js";

export function usePusher(channelName, eventName, callback) {
  useEffect(() => {
    // Inicializar Pusher
    const pusher = new Pusher("1d159ac153a09a146938", {
      cluster: "us2",
    });

    // Suscribirse al canal
    const channel = pusher.subscribe(channelName);

    // Escuchar el evento
    channel.bind(eventName, (eventData) => {
      console.log(`Evento recibido en ${channelName}:`, eventData);
      callback(); // Ejecutar el callback proporcionado (por ejemplo, recargar datos)
    });

    // Limpieza al desmontar el componente
    return () => {
      channel.unbind();
      pusher.unsubscribe(channelName);
    };
  }, [channelName, eventName, callback]); // Dependencias para re-inicializar si cambian
}