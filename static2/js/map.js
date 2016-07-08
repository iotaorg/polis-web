jQuery(document).ready(function($) {
    "use strict";

    /* mapa */
    if ($('#map')[0]) {

        var map = L.map('map').setView([-23.822101938, -45.922569491], 10);
        function bestFitZoom()
        {
            // declaring the group variable
            var group = new L.featureGroup;

            // map._layers gives all the layers of the map including main container
            // so looping in all those layers filtering those having feature
            $.each(map._layers, function(ml){

               // here we can be more specific to feature for point, line etc.
                if(map._layers[ml].feature)
                 {
                     group.addLayer(this)
                 }
             })

             map.fitBounds(group.getBounds());
        }

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoicG9saXMiLCJhIjoiY2lxZTZ0eG95MDMxNGZ0bnA0cXE5M2M0MiJ9.jgv8oBeRDaodz9Acb6ZC-w', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagens © <a href="http://mapbox.com">Mapbox</a>',
            id: 'mapbox.streets'
        }).addTo(map);

        $.ajax({
            url: '/static2/geojson/LIMITES_MUNICIPAIS.geojson',
            success: function(e) {
                console.log(e);

                var something = L.geoJson(e, {

                    style: function(feature) {
                        return feature.properties && feature.properties;
                    },

                    onEachFeature: onEachFeature,
                    pointToLayer: function(feature, latlng) {
                        return L.circleMarker(latlng, {
                            radius: 2,
                            fillColor: "#ff7800",
                            color: "#000",
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.8
                        });
                    }
                });
                something.addTo(map);

                bestFitZoom();


            },
            dataType: 'json'
        });


        function onEachFeature(feature, layer) {
            var popupContent = "";

            if (feature.properties && feature.properties.PopupInfo) {
                popupContent += feature.properties.PopupInfo;
            }

            layer.bindPopup(popupContent);
        }

    }


});