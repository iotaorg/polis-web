jQuery(document).ready(function($) {
    "use strict";

    var map = undefined,
        mapa_config = {
            "1A": ["LIMITES_MUNICIPAIS", "GE_PONTO", "GE_LINHA", "GE_POLIGONO"],
            "1B": ["LIMITES_MUNICIPAIS"],
            "1C": ["LIMITES_MUNICIPAIS"],
            "1D": ["LIMITES_MUNICIPAIS", "RSCC_PRAIAGRANDE"],
            "1E": ["LIMITES_MUNICIPAIS", "DELEGACIAS_ESPECIALIZADAS"],
            "1F": ["LIMITES_MUNICIPAIS", "ENSINO_SUPERIOR_PUBLICO"],
            "1G": ["LIMITES_MUNICIPAIS"],
            "1H": ["LIMITES_MUNICIPAIS"],
            "1I": ["LIMITES_MUNICIPAIS", "UNIDADE_CONSERVACAO", "TURISMO_BASE_COMUNITARIA"],
            "2A": ["LIMITES_MUNICIPAIS", "UC_CLASSIFICADA", "PERIMETROS_MARCEL"],
            "2B": ["LIMITES_MUNICIPAIS", "UC_CLASSIFICADA"],
            "2C": ["LIMITES_MUNICIPAIS", "UNIDADE_CONSERVACAO", "COMUNIDADES_PESQUEIRAS"],
            "2D": ["LIMITES_MUNICIPAIS", "UNIDADE_CONSERVACAO", "PCT", "TERRAS_DEMARCADAS"],
            "2E": ["LIMITES_MUNICIPAIS", "UNIDADE_CONSERVACAO", "TERRAS_DEMARCADAS"],
            "2F": ["LIMITES_MUNICIPAIS", "ZEIS"],
            "2G": ["LIMITES_MUNICIPAIS", "UNIDADE_CONSERVACAO", "CONFLITOS"],
            "3A": ["LIMITES_MUNICIPAIS", "LINHAS_EMTU", "CICLOVIAS"],
            "3B": ["LIMITES_MUNICIPAIS"],
            "3C": ["LIMITES_MUNICIPAIS", "ETES"],
            "3D": ["LIMITES_MUNICIPAIS", "SOLUCOES_ALTERNATIVAS"],
            "3E": ["LIMITES_MUNICIPAIS", "RISCO_ESCORREGAMENTO", "RISCO_INUNDACAO"],
            "3F": ["LIMITES_MUNICIPAIS"],
            "3G": ["LIMITES_MUNICIPAIS", "UNIDADE_CONSERVACAO", "PRAIAS_MONITORADAS"],
            "3H": ["LIMITES_MUNICIPAIS", "ZEIS"],
            "3I": ["LIMITES_MUNICIPAIS"],
            "3J": ["LIMITES_MUNICIPAIS"],
            "3K": ["LIMITES_MUNICIPAIS"],
            "3L": ["LIMITES_MUNICIPAIS", "CULTURA"],
            "3M": ["LIMITES_MUNICIPAIS"],
            "3N": ["LIMITES_MUNICIPAIS"]
        },
        bestFitZoom = function() {
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
        },

        onPointToLayer = function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 8,
                fillColor: feature.properties.Cores ? feature.properties.Cores : "#ff7800",
                color: feature.properties.Cores ? feature.properties.Cores : "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onStyleFeature = function(feature) {

            if (feature.properties) {

                feature.properties.fillOpacity = 0.2;

                if (feature.geometry.type == 'LineString')
                    feature.properties.weight = 8;
                if (feature.properties.Cores) {
                    feature.properties.cores = feature.properties.Cores;
                    delete feature.properties.Cores;
                }

                if (feature.properties.stroke && feature.geometry.type == 'Polygon') {
                    feature.properties.fillColor = feature.properties.stroke;
                } else if (feature.properties.cores && feature.geometry.type == 'LineString') {
                    feature.properties.color = feature.properties.cores;
                } else if (feature.properties.cores) {
                    feature.properties.fillColor = feature.properties.cores;
                }


                if (feature.properties.opacidade) {
                    feature.properties.fillOpacity = feature.properties.opacidade.replace(',', '.') * 1;
                }



            }

            return feature.properties && feature.properties;
        },

        onEachFeature = function(feature, layer) {
            var popupContent = "";

            if (feature.properties && feature.properties.PopupInfo) {
                popupContent += feature.properties.PopupInfo + "<br/>";
                delete feature.properties.PopupInfo;
            }
            delete feature.properties.id;
            delete feature.properties.Id;
            delete feature.properties.OID_;

            $.each(feature.properties, function(i, e) {
                popupContent += "<strong>" + i + "</strong>: <span>" + e + "</span><br/>";
            });

            if (!popupContent ){
                popupContent = JSON.stringfy(feature.properties)
            }

            layer.bindPopup(popupContent);
        },
        codigo_acao = $('section[data-codigo-acao]').attr('data-codigo-acao'),
        current_geometries,
        _maps_total=0, _maps_loaded=0,
        init_map = function() {

            current_geometries = mapa_config[codigo_acao];

            map = L.map('map', {
                //scrollWheelZoom: false
            }).setView([-23.822101938, -45.922569491], 10);

            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoicG9saXMiLCJhIjoiY2lxZTZ0eG95MDMxNGZ0bnA0cXE5M2M0MiJ9.jgv8oBeRDaodz9Acb6ZC-w', {
                maxZoom: 18,
                attribution: '<a href="http://openstreetmap.org">OpenStreetMap</a> ♥, ' +
                    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                    'Imagens © <a href="http://mapbox.com">Mapbox</a>',
                id: 'mapbox.streets'
            }).addTo(map);



            _maps_total = current_geometries.length;

            $.each(current_geometries, function(current_level, geometry_name){
                $.ajax({
                    url: '/static2/geojson/'+geometry_name+'.geojson',
                    cache:false,
                    async:false, // vai sair, eu juro!
                    success: function(e) {

                        _maps_loaded++;

                        var something = L.geoJson(e, {
                            style: onStyleFeature,
                            onEachFeature: onEachFeature,
                            pointToLayer: onPointToLayer,
                            zIndex: current_level,
                        });
                        something.addTo(map);

                        if (_maps_loaded == _maps_total){
                            bestFitZoom();
                        }
                    },
                    error: function(){
                        _maps_loaded++;
                        if (_maps_loaded == _maps_total){
                            bestFitZoom();
                        }
                        alert("erro ao carregar mapa [" + geometry_name + "]");
                    },
                    dataType: 'json'
                });

            });

        };

    /* mapa */
    if ($('#map')[0] && codigo_acao) {
        init_map();
    }


});