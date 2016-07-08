jQuery(document).ready(function($) {
    "use strict";

    /* mapa */
    if ($('#map')[0]) {

        var map = L.map('map', {
            scrollWheelZoom: false
        }).setView([-23.822101938, -45.922569491], 10);

        function bestFitZoom() {
            // declaring the group variable
            var group = new L.featureGroup;

            // map._layers gives all the layers of the map including main container
            // so looping in all those layers filtering those having feature
            $.each(map._layers, function(ml) {

                // here we can be more specific to feature for point, line etc.
                if (map._layers[ml].feature) {
                    group.addLayer(this)
                }
            })

            map.fitBounds(group.getBounds());
        }

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoicG9saXMiLCJhIjoiY2lxZTZ0eG95MDMxNGZ0bnA0cXE5M2M0MiJ9.jgv8oBeRDaodz9Acb6ZC-w', {
            maxZoom: 18,
            attribution: '<a href="http://openstreetmap.org">OpenStreetMap</a> ♥, ' +
                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagens © <a href="http://mapbox.com">Mapbox</a>',
            id: 'mapbox.streets'
        }).addTo(map);

        $.ajax({
            url: '/static2/geojson/UNIDADE_CONSERVACAO.geojson',
            success: function(e) {
                console.log(e);

                var something = L.geoJson(e, {
                    style: onStyleFeature,
                    onEachFeature: onEachFeature,
                    pointToLayer: onPointToLayer
                });
                something.addTo(map);

                bestFitZoom();

            },
            dataType: 'json'
        });

        function onPointToLayer(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 8,
                fillColor: feature.properties.Cores ? feature.properties.Cores : "#ff7800",
                color: feature.properties.Cores ? feature.properties.Cores : "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        };

        function onStyleFeature(feature) {

            if (feature.properties){
                console.log(feature.properties);
                feature.properties.fillOpacity = 0.2;

                if (feature.geometry.type == 'LineString')
                    feature.properties.weight = 8;
                if (feature.properties.Cores){
                    feature.properties.cores = feature.properties.Cores;
                    delete feature.properties.Cores;
                }

                if (feature.properties.color && feature.geometry.type == 'Polygon'){
                    feature.properties.fillColor = feature.properties.stroke;
                }else if (feature.properties.cores && feature.geometry.type == 'LineString'){
                    feature.properties.color = feature.properties.cores;
                }else if (feature.properties.cores){
                    feature.properties.fillColor = feature.properties.cores;
                }

                if (feature.properties.fillColor == '#D3D3D3'){
                    feature.properties.fillColor = 'red';
                    feature.properties.fillOpacity = 0.8;
                }

                if (feature.properties.opacidade ){
                    feature.properties.fillOpacity = feature.properties.opacidade.replace(',','.') * 1;
                }



            }

            return feature.properties && feature.properties;
        };

        function onEachFeature(feature, layer) {
            var popupContent = "";

            if (feature.properties && feature.properties.PopupInfo) {
                popupContent += feature.properties.PopupInfo;
            }

            layer.bindPopup(popupContent);
        }

    }


});