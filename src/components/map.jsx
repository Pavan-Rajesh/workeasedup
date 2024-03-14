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
      iconUrl: "pin.png",
      iconSize: [30, 30],
    });
  const headIcon = () =>
    L.icon({
      iconUrl: "greenpin.png",
      iconSize: [30, 30],
    });
  function processCombinedLocations(GeoJSONResponse) {
    const ownerLocations = GeoJSONResponse.ownerLocations;
    const workerLocations = GeoJSONResponse.workerLocations;
    const headLocations = GeoJSONResponse.headLocations;
    console.log(GeoJSONResponse);
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
          noworkersreq: ownerLocation.noworkersreq,
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
          workername: workerLocation.workername,
          phonenumber: workerLocation.phonenumber,
        },
        geometry: JSON.parse(workerLocation.st_asgeojson),
      });
    });
    headLocations.forEach((headLocation) => {
      const coordData = JSON.parse(headLocation.st_asgeojson);
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
          worker: false,
          head: true,
          headname: headLocation.name,
          phonenumber: headLocation.phonenumber,
        },
        geometry: JSON.parse(headLocation.st_asgeojson),
      });
    });
    // console.log(fake);
    console.log(JSON.stringify(mainGeoJSON));
    setgeoJSONme(mainGeoJSON);
  }

  useEffect(() => {
    fetch("/api/findlocations")
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);

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
      ).bindTooltip(
        `<b>Name</b>: ${geojsonPoint.properties.workername}  <br><b>PhoneNumber</b>: ${geojsonPoint.properties.phonenumber} `,
        { direction: "top" }
      );
    } else if (
      geojsonPoint.properties.owner == true &&
      geojsonPoint.properties.worker == false
    ) {
      console.log(geojsonPoint);
      return L.marker(
        { lat: latlng.lng, lng: latlng.lat },
        {
          icon: customMarkerIcon(geojsonPoint.properties.Name),
        }
      )
        .bindTooltip(
          `<b>Name</b>: ${geojsonPoint.properties.ownername} <br> <b>Required workers</b>: ${geojsonPoint.properties.noworkersreq} <br><b>PhoneNumber</b>: ${geojsonPoint.properties.phonenumber}`,
          { direction: "top" }
        )
        .on("click", (data) => {
          console.log(data);
        });
    } else {
      return L.marker(
        { lat: latlng.lng, lng: latlng.lat },
        {
          icon: headIcon(geojsonPoint.properties.headname),
        }
      )
        .bindTooltip(
          `<b>Name</b>: ${geojsonPoint.properties.headname} <br><b>PhoneNumber</b>: ${geojsonPoint.properties.phonenumber}`,
          { direction: "top" }
        )
        .on("click", (data) => {
          console.log(data);
        });
    }
  }

  return (
    <>
      <MapContainer
        center={{ lat: 50, lng: 30 }}
        zoom={1}
        style={{ width: "100%", height: "100%" }}
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
