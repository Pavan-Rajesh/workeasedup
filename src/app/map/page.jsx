import React from "react";
import dynamic from "next/dynamic";
import styles from "./map.module.css";
export default function Page() {
  const MapWithNoSSR = dynamic(() => import("@/components/map"), {
    ssr: false,
  });

  return (
    <main>
      <div id="map">
        <MapWithNoSSR />
      </div>
    </main>
  );
}
