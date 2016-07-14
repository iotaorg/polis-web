/*
 * Google layer using Google Maps API
 */

/* global google: true */

L.Google = L.Class.extend({
    includes: L.Mixin.Events,

    options: {
        minZoom: 0,
        maxZoom: 18,
        tileSize: 256,
        subdomains: 'abc',
        errorTileUrl: '',
        attribution: '',
        opacity: 1,
        continuousWorld: false,
        noWrap: false,
        mapOptions: {
            backgroundColor: '#dddddd'
        }
    },

    // Possible types: SATELLITE, ROADMAP, HYBRID, TERRAIN
    initialize: function (type, options) {
        L.Util.setOptions(this, options);

        this._ready = google.maps.Map !== undefined;
        if (!this._ready) L.Google.asyncWait.push(this);

        this._type = type || 'SATELLITE';
    },

    onAdd: function (map, insertAtTheBottom) {
        this._map = map;
        this._insertAtTheBottom = insertAtTheBottom;

        // create a container div for tiles
        this._initContainer();
        this._initMapObject();

        // set up events
        map.on('viewreset', this._reset, this);

        this._limitedUpdate = L.Util.limitExecByInterval(this._update, 150, this);
        map.on('move', this._update, this);

        map.on('zoomanim', this._handleZoomAnim, this);

        //20px instead of 1em to avoid a slight overlap with google's attribution
        map._controlCorners.bottomright.style.marginBottom = '20px';

        this._reset();
        this._update();
    },

    onRemove: function (map) {
        map._container.removeChild(this._container);

        map.off('viewreset', this._reset, this);

        map.off('move', this._update, this);

        map.off('zoomanim', this._handleZoomAnim, this);

        map._controlCorners.bottomright.style.marginBottom = '0em';
    },

    getAttribution: function () {
        return this.options.attribution;
    },

    setOpacity: function (opacity) {
        this.options.opacity = opacity;
        if (opacity < 1) {
            L.DomUtil.setOpacity(this._container, opacity);
        }
    },

    setElementSize: function (e, size) {
        e.style.width = size.x + 'px';
        e.style.height = size.y + 'px';
    },

    _initContainer: function () {
        var tilePane = this._map._container,
            first = tilePane.firstChild;

        if (!this._container) {
            this._container = L.DomUtil.create('div', 'leaflet-google-layer leaflet-top leaflet-left');
            this._container.id = '_GMapContainer_' + L.Util.stamp(this);
            this._container.style.zIndex = 'auto';
        }

        tilePane.insertBefore(this._container, first);

        this.setOpacity(this.options.opacity);
        this.setElementSize(this._container, this._map.getSize());
    },

    _initMapObject: function () {
        if (!this._ready) return;
        this._google_center = new google.maps.LatLng(0, 0);
        var map = new google.maps.Map(this._container, {
            center: this._google_center,
            zoom: 0,
            tilt: 0,
            mapTypeId: google.maps.MapTypeId[this._type],
            disableDefaultUI: true,
            keyboardShortcuts: false,
            draggable: false,
            disableDoubleClickZoom: true,
            scrollwheel: false,
            streetViewControl: false,
            styles: this.options.mapOptions.styles,
            backgroundColor: this.options.mapOptions.backgroundColor
        });

        var _this = this;
        this._reposition = google.maps.event.addListenerOnce(map, 'center_changed',
            function () { _this.onReposition(); });
        this._google = map;

        google.maps.event.addListenerOnce(map, 'idle',
            function () { _this._checkZoomLevels(); });
        google.maps.event.addListenerOnce(map, 'tilesloaded',
            function () { _this.fire('load'); });
        //Reporting that map-object was initialized.
        this.fire('MapObjectInitialized', {mapObject: map});
    },

    _checkZoomLevels: function () {
        //setting the zoom level on the Google map may result in a different zoom level than the one requested
        //(it won't go beyond the level for which they have data).
        // verify and make sure the zoom levels on both Leaflet and Google maps are consistent
        if ((this._map.getZoom() !== undefined) && (this._google.getZoom() !== this._map.getZoom())) {
            //zoom levels are out of sync. Set the leaflet zoom level to match the google one
            this._map.setZoom(this._google.getZoom());
        }
    },

    _reset: function () {
        this._initContainer();
    },

    _update: function () {
        if (!this._google) return;
        this._resize();

        var center = this._map.getCenter();
        var _center = new google.maps.LatLng(center.lat, center.lng);

        this._google.setCenter(_center);
        if (this._map.getZoom() !== undefined)
            this._google.setZoom(Math.round(this._map.getZoom()));

        this._checkZoomLevels();
    },

    _resize: function () {
        var size = this._map.getSize();
        if (this._container.style.width === size.x &&
                this._container.style.height === size.y)
            return;
        this.setElementSize(this._container, size);
        this.onReposition();
    },


    _handleZoomAnim: function (e) {
        var center = e.center;
        var _center = new google.maps.LatLng(center.lat, center.lng);

        this._google.setCenter(_center);
        this._google.setZoom(Math.round(e.zoom));
    },


    onReposition: function () {
        if (!this._google) return;
        google.maps.event.trigger(this._google, 'resize');
    }
});

L.Google.asyncWait = [];
L.Google.asyncInitialize = function () {
    var i;
    for (i = 0; i < L.Google.asyncWait.length; i++) {
        var o = L.Google.asyncWait[i];
        o._ready = true;
        if (o._container) {
            o._initMapObject();
            o._update();
        }
    }
    L.Google.asyncWait = [];
};
jQuery(document).ready(function($) {
    "use strict";

    var map = undefined,
        mapa_config = {
            "1A": ["LIMITES_MUNICIPAIS", "GE_PTO", "GE_LIN", "GE_POL"],
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
                radius: feature.properties.WEIGHT || 8,
                fillColor: feature.properties.CORES ? feature.properties.CORES : "#ff7800",
                color: feature.properties.COLOR ? feature.properties.COLOR : "#000",
                weight: feature.properties.WEIGHT || 1,
                opacity: feature.properties.OPACITY ? feature.properties.OPACITY.replace(',', '.')*1 : 1,
                fillOpacity: feature.properties.OPACIDADE ? feature.properties.OPACIDADE.replace(',', '.')*1 : 0.8
            });
        },
        onStyleFeature = function(feature) {

            if (feature.properties) {

                if (feature.properties.OPACIDADE)
                    feature.properties.OPACIDADE = feature.properties.OPACIDADE.replace(',', '.') * 1

                if (feature.properties.OPACITY)
                    feature.properties.OPACITY = feature.properties.OPACITY.replace(',', '.') * 1

                if (feature.properties.Cores) {
                    feature.properties.cores = feature.properties.Cores;
                    delete feature.properties.Cores;
                }

                if (feature.properties.stroke  ) {
                    feature.properties.fillColor = feature.properties.stroke;
                    if (!feature.properties.color){
                        feature.properties.color = feature.properties.stroke;
                    }
                    feature.properties.stroke=true;
                } else if (feature.properties.cores && feature.geometry.type == 'LineString') {
                    feature.properties.color = feature.properties.cores;
                } else if (feature.properties.cores) {
                    feature.properties.fillColor = feature.properties.cores;
                }
                if (feature.properties.fill) {
                    feature.properties.fillColor = feature.properties.fill;
                    delete feature.properties.fill;
                }

                if (feature.properties.opacidade) {
                    feature.properties.fillOpacity = feature.properties.opacidade.replace(',', '.') * 1;
                    delete feature.properties.opacidade;
                }

                if (feature.properties.OPACITY) {
                    feature.properties.opacity = feature.properties.OPACITY;
                    delete feature.properties.OPACITY;
                }
                if (feature.properties.OPACIDADE) {
                    feature.properties.fillOpacity = feature.properties.OPACIDADE;
                    delete feature.properties.OPACIDADE;
                }

                if (feature.properties.COLOR) {
                    feature.properties.color = feature.properties.COLOR;
                    delete feature.properties.COLOR;
                }

                if (feature.properties.CORES) {
                    feature.properties.fillColor = feature.properties.CORES;
                    delete feature.properties.CORES;
                }

                if (feature.properties.STROKE) {
                    feature.properties.stroke = feature.properties.STROKE ? true : false;
                    delete feature.properties.STROKE;
                }

                if (feature.properties.WEIGHT) {
                    feature.properties.weight = feature.properties.WEIGHT;
                    delete feature.properties.WEIGHT;
                }



            }

            return feature.properties && feature.properties;
        },

        onEachFeature = function(feature, layer) {
            var popupContent = "";
            var oxe = JSON.stringify(feature);
            if (feature.properties && feature.properties.PopupInfo) {
                popupContent += feature.properties.PopupInfo + "<br/>";
                delete feature.properties.PopupInfo;
            }
            delete feature.properties.id;
            delete feature.properties.Id;
            delete feature.properties.OID_;
            delete feature.properties.stroke;
            delete feature.properties.color;
            delete feature.properties.fillColor;
            delete feature.properties.fillOpacity;
            delete feature.properties.opacity;
            delete feature.properties.weight;

            $.each(feature.properties, function(i, e) {
                popupContent += "<strong>" + i + "</strong>: <span>" + e + "</span><br/>";
            });

            layer.bindPopup(popupContent);
        },
        codigo_acao = $('section[data-codigo-acao]').attr('data-codigo-acao'),
        current_geometries,
        _maps_total=0, _maps_loaded=0,
        init_map = function() {

            current_geometries = mapa_config[codigo_acao];

            map = L.map('map', {
                //scrollWheelZoom: false
            }).setView([-23.822101938, -45.922569491], 9);

                var ggl = new L.Google();
                var ggl2 = new L.Google('TERRAIN');
                map.addLayer(ggl);
                map.addControl(new L.Control.Layers( {'Google Satelite':ggl, 'Google Terreno':ggl2}, {}));



            _maps_total = current_geometries.length;

            $.each(current_geometries, function(current_level, geometry_name){
                $.ajax({
                    url: '/static2/geojson/'+geometry_name+'.geojson?v=1',
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
        setTimeout(init_map, 500);
    }


});