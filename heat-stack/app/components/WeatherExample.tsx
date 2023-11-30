import { loader } from "#app/root.tsx";
import test from "@playwright/test";
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";

// weather `loader` is in root.tsx

export function WeatherExample() {

  const one_loader = useLoaderData<typeof loader>();
  if (!one_loader.weather) {
    return <div>Loading weather...</div>;
  }
  const time: string = one_loader.weather.daily?.time[0]
  const temp: number = one_loader.weather.daily?.temperature_2m_max[0]
  
  return (
    <div>
      <span>time/temp first item: {time}/{temp}</span>
    </div>
  );
}
