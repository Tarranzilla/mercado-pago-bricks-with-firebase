import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const MapComponent = () => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const address = "Rua Francisco Camargo, nº 262, Colombo, Paraná, Brasil";

    useEffect(() => {
        const loader = new Loader({
            apiKey: "AIzaSyBoWxQtCEHcm-AqgB3fjGveoXqVgy8g9pI",
            version: "weekly",
            libraries: ["places"],
        });

        loader.load().then(() => {
            if (mapRef.current) {
                const map = new google.maps.Map(mapRef.current, {
                    zoom: 15,
                });

                const geocoder = new google.maps.Geocoder();

                geocoder.geocode({ address: address }, (results, status) => {
                    if (status === "OK") {
                        if (results) {
                            map.setCenter(results[0].geometry.location);
                            new google.maps.Marker({
                                map: map,
                                position: results[0].geometry.location,
                            });
                        } else {
                            alert("Geocode was successful but no results were returned.");
                        }
                    } else {
                        alert("Geocode was not successful for the following reason: " + status);
                    }
                });
            }
        });
    }, [address]);

    return <div title="Mapa de localização da Tropical Cacau" ref={mapRef} className="Map" style={{ width: "100%", height: "100%" }} />;
};

export default MapComponent;
