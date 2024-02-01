"use client";
import React from "react";
import { useState, useEffect } from "react";

import L, { latLng } from "leaflet";
import fake from "./fake.json";

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

/**
 * Here we will be fetching the workers coordinates
 * and the owner coodinates from the api and display in the map
 *
 *
 *
 */

const Page = () => {
  const [locations, setLocations] = useState(null);
  const [geoJSONme, setgeoJSONme] = useState(null);
  const customMarkerIcon = () =>
    L.icon({
      iconUrl: "marker-icon-2x.png",
      iconSize: [20, 30],
    });
  const workerIcon = () =>
    L.icon({
      iconUrl: "marker-icon-2x-red.png",
      iconSize: [20, 30],
    });
  function processCombinedLocations(GeoJSONResponse) {
    const ownerLocations = GeoJSONResponse.ownerLocations;
    const workerLocations = GeoJSONResponse.workerLocations;
    // console.log(GeoJSONResponse);
    const mainGeoJSON = {
      type: "FeatureCollection",
      name: "USLabels",
      crs: {
        type: "name",
        properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
      },
      features: [],
    };
    ownerLocations.forEach((ownerLocation) => {
      const coordData = JSON.parse(ownerLocation.st_asgeojson);
      coordData.coordinates.push(0);

      mainGeoJSON.features.push({
        type: "Feature",
        properties: {
          Name: "AK",
          description: "Alaska",
          extrude: "0",
          visibility: "-1",
          snippet: "",
          ownername: ownerLocation.ownername,
          phonenumber: ownerLocation.phonenumber,
          owner: true,
          worker: false,
        },
        geometry: JSON.parse(ownerLocation.st_asgeojson),
      });
      // return JSON.parse(ownerLocation.st_asgeojson);
    });
    // const parsedWorkerLocations = workerLocations.map((workerLocation) => {
    //   return JSON.parse(workerLocation.st_asgeojson);
    // });
    workerLocations.forEach((workerLocation) => {
      const coordData = JSON.parse(workerLocation.st_asgeojson);
      coordData.coordinates.push(0);
      mainGeoJSON.features.push({
        type: "Feature",
        properties: {
          Name: "AK",
          description: "Alaska",
          extrude: "0",
          visibility: "-1",
          snippet: "",
          owner: false,
          worker: true,
        },
        geometry: JSON.parse(workerLocation.st_asgeojson),
      });
    });
    // console.log(fake);
    // console.log(JSON.stringify(mainGeoJSON));
    setgeoJSONme(mainGeoJSON);
  }

  useEffect(() => {
    fetch("/api/findlocations")
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        // console.log(res);

        processCombinedLocations(res);
      });
  }, []);
  function setcolor2(properties) {
    return { weight: 2, color: "blue", fillColor: "red" };
  }
  function ptLayer(geojsonPoint, latlng) {
    // console.log(geojsonPoint, latlng);
    if (
      geojsonPoint.properties.owner == false &&
      geojsonPoint.properties.worker == true
    ) {
      return L.marker(
        { lat: latlng.lng, lng: latlng.lat },
        {
          icon: workerIcon(geojsonPoint.properties.Name),
        }
      ).bindTooltip();
    } else {
      console.log(geojsonPoint);
      return L.marker(
        { lat: latlng.lng, lng: latlng.lat },
        {
          icon: customMarkerIcon(geojsonPoint.properties.Name),
        }
      ).bindTooltip(
        `${geojsonPoint.properties.ownername}   ${geojsonPoint.properties.phonenumber}`
      );
    }
  }

  return (
    <>
      <MapContainer
        center={{ lat: 50, lng: 30 }}
        zoom={1}
        style={{ height: "100vh" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {geoJSONme ? (
          <GeoJSON data={geoJSONme} style={setcolor2} pointToLayer={ptLayer} />
        ) : null}
      </MapContainer>
    </>
  );
};

export default Page;
