import "../css/App.css";
import myMap from "./map.webp";
import { MapContainer, CircleMarker, TileLayer, SVGOverlay, ImageOverlay, FeatureGroup, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import React, { useState, useRef } from "react";
import BridgeMarkerList from "../commons/BridgeMarker";
import WelcomeScreen from "../commons/WelcomeScreen";
import FinishScreen from "../commons/FinishScreen";
import { bridges } from "./bridges";

const center = [59.933, 30.314];
// const bounds = [[59.904209, 30.176695], [59.965838, 30.455914]];
const bounds = [[59.902412999999996, 30.17354], [59.964387, 30.45446]];
// const center = [2098, 4818];
// const bounds = [[0, 0], [4196, 9636]];

const smallLabels = [
    [59.917791, 30.336642, "Багратионовский сквер"],
    [59.920053, 30.333977, "Сад на Пионерской площади"],
    [59.919344, 30.352607, "Лиговский проспект", -73],
    [59.913063, 30.342078, "Боровая ул.", -71],
    [59.910374, 30.346813, "Лиговский проспект", -71],
    [59.910696, 30.334239, "Рыбинская ул.", 70],
    [59.907959, 30.342376, "Расстанная ул.", 30],
    [59.908157, 30.355525, "Днепропетровская ул.", -71],
    [59.905565, 30.317874, "Московский проспект", 88],
    [59.917602, 30.320163, "Загородный проспект", -37],
    [59.920807, 30.326300, "Введенский сад"],
    [59.922592, 30.312009, "Юсуповский сад"],
    [59.917215, 30.284414, "Садовая ул.", -26],
    [59.915924, 30.285573, "р. Фонтанка", 5],
    [59.917000, 30.268621, "Галерный о."],
    [59.903854, 30.261927, "Екатерингофский парк"],
    [59.910438, 30.260124, "р. Екатерингофка", -70],
    [59.905640, 30.253301, "наб. реки Екатерингофки", -55],
    [59.917301, 30.246649, "р. Большая Нева"],
    [59.925152, 30.269308, "р. Большая Нева", -70],
    [59.920850, 30.272441, "р. Пряжка", 15],
    [59.923883, 30.275574, "ул. Александра Блока"],
    [59.921044, 30.278063, "наб. реки Пряжки", -42],
    [59.926872, 30.276647, "р. Мойка", -20],
    [59.924420, 30.288363, "ул. Декабристов", -20],
    [59.930076, 30.288491, "Новая Голландия", 0, 90],
    [59.928270, 30.283384, "наб. реки Мойки", -15],
    [59.957073, 30.316772, "Кронверкский пр.", 10],
    [59.953399, 30.317588, "Кронверкская наб."],
    [59.952131, 30.307245, "Ленинградский зоопарк", 0, 140],
    [59.944265, 30.181761, "Морской вокзал № 1"],
    [59.948628, 30.212844, "сквер Осенний марафон", 0, 140],
    [59.956235, 30.221028, "ул. Кораблестроителей", -30],
    [59.961563, 30.221457, "наб. Макарова", -15],
    [59.908695, 30.360819, "р. Волковка", 70],
    [59.909793, 30.365911, "Нефтяная дор.", 50],
    [59.912654, 30.265832, "Рижский проспект", -5],
    [59.909212, 30.280037, "наб. Обводного канала"],
    [59.914160, 30.361791, "наб. Обводного канала"],
    [59.919439, 30.381716, "Митрополичий сад", 0, 120],
    [59.920958, 30.390716, "Никольское кладбище", 0, 120],
    [59.917903, 30.396810, "Дёминский сад", 0, 90],
    [59.913106, 30.401702, "сад имени 30-летия Октября", 0, 120],
    [59.919689, 30.411100, "Заневский парк"],
    [59.919166, 30.448864, "Парк боевого братства", 0, 120],
    [59.916828, 30.406466, "р. Нева", 60],
    [59.923840, 30.416765, "Новочеркасский пр.", 55],
    [59.926786, 30.438617, "р. Оккервиль", 20],
    [59.936075, 30.427494, "р. Охта", 20],
    [59.962959, 30.425177, "Полюстровский парк", 0, 100],
    [59.960940, 30.409212, "сад Нева"],
    [59.953549, 30.425275, "Большая Пороховская ул."],
    [59.948536, 30.424262, "Большеохотинское кладбище", 0, 100],
    [59.945404, 30.435047, "просп. Энергетиков", 95],
    [59.954280, 30.406122, "Свердловская наб.", 75],
    [59.925711, 30.407410, "Мал. Охта"],
    [59.929904, 30.403676, "Мал. Охта"],
    [59.930605, 30.420113, "Заневский просп.", -20],
    [59.953012, 30.358229, "Арсенальная наб."],
    [59.954374, 30.344350, "Пироговская наб.", 20],
    [59.958878, 30.348916, "Ботинская ул.", 20],
    [59.950627, 30.334454, "р. Нева"],
    [59.956020, 30.396724, "р. Нева"],
    [59.955139, 30.382218, "Смольная наб.", -45],
    [59.948478, 30.414147, "Большая охта", 0, 90],
    [59.949746, 30.385885, "сквер Кикины Палаты", 0, 90],
    [59.945426, 30.371490, "Таврический сад"],
    [59.943298, 30.366554, "сад Салтыкова-Щедрина", 0, 90],
    [59.946242, 30.392622, "сад-партер Смольного", 0, 90],
    [59.937644, 30.367284, "Калужский сквер", 0, 90],
    [59.931495, 30.375223, "Овсянниковский сад", 0, 90],
    [59.929368, 30.360889, "Московский вкз.", 0, 90],
    [59.931732, 30.359645, "Площадь Восстания"],
    [59.932312, 30.350246, "Невский просп.", 15],
    [59.934935, 30.345440, "Итальянский сад", 0, 90],
    [59.945641, 30.348058, "Литейный просп.", 90],
    [59.933194, 30.336041, "Екатерининский сад", 0, 90],
    [59.945619, 30.334325, "Летний сад"],
    [59.944072, 30.329347, "Марсово поле"],
    [59.940052, 30.330634, "Михайловский сад", 0, 90],
    [59.936827, 30.331977, "Михайловский сквер", 0, 90],
    [59.934226, 30.320120, "Воронихинский сквер", 0, 90],
    [59.930219, 30.301280, "наб. реки Мойки", -10],
    [59.934118, 30.293169, "Английская наб.", -35],
    [59.931947, 30.291710, "пл. Труда"],
    [59.936526, 30.301623, "Сенатская пл.", 0, 50],
    [59.922829, 30.320635, "р. Фонтанка", -40],
    [59.943104, 30.351362, "Преображенская площадь", 0, 90],
    [59.944351, 30.305014, "Биржевая пл."],
    [59.945619, 30.295916, "наб. Макарова", 7],
    [59.952904, 30.272741, "р. Малая Нева", 30],
    [59.960016, 30.242529, "р. Малая Нева"],
    [59.957503, 30.275574, "Петровский парк", 0, 90],
    [59.954602, 30.283256, "р. Ждановка", 35],
    [59.952174, 30.292697, "Князь-Владимирский сквер", 0, 90],
    [59.959028, 30.299907, "Большой просп. П. С.", -50],
    [59.943448, 30.245705, "Смоленское православное кладбище", 0, 90],
    [59.943534, 30.261583, "Малый просп. В. О.", -30],
    [59.940525, 30.268750, "Средний просп. В. О.", -30],
    [59.935258, 30.269351, "Большой просп. В. О.", -30],
    [59.928614, 30.246649, "Большой просп. В. О.", -30],
    [59.933882, 30.238667, "Шкиперский сад"],
    [59.929108, 30.238152, "Опочининский сад", 0, 90],
    [59.925001, 30.237894, "Севкабель порт"]
];

const bigLabels = [
    [59.957610, 30.288491, "Петроградский район"],
    [59.938117, 30.250082, "Василеостровский район"],
    [59.907404, 30.242271, "Кировский район"],
    [59.906156, 30.325154, "Московский район"],
    [59.911062, 30.350761, "Фрунзенский район"],
    [59.914122, 30.423632, "Невский район"],
    [59.941686, 30.427151, "Красногвардейский район"],
    [59.941299, 30.367211, "Центральный район"],
    [59.961026, 30.371704, "Калининский район"],
    [59.960940, 30.343865, "Выборгский район"]
];

const defaultZoom = 14;
const minZoom = 14;

var ZoomShowHide = L.FeatureGroup.extend({
    initialize: function () {
        this.layers = []
        this._layerGroup = L.featureGroup();
    },

    onAdd: function (map) {
        this._layerGroup.addTo(map)
        var that = this; // I do not like this programing language.
        this.map = map
        this.map.on('zoom', function(e) {that.filter()});
    },

    filter: function () {
        var current_zoom_level = this.map.getZoom();
        for (var i=0; i < this.layers.length; i++) {
            var layer = this.layers[i];
            if ((layer.min_zoom == null || current_zoom_level >= layer.min_zoom) &&
                (layer.max_zoom == null || current_zoom_level <= layer.max_zoom)){
                if (!this._layerGroup.hasLayer(layer)) {
                    layer.addTo(this._layerGroup);
                }
            } else {
                if (this._layerGroup.hasLayer(layer)) {
                    layer.removeFrom(this._layerGroup);
                }
            }
        }
    },

    addLayer: function (layer, min_zoom, max_zoom) {
        layer.min_zoom = min_zoom
        layer.max_zoom = max_zoom
        this.layers.push(layer)
        this.filter()
    },

    addLayers: function (layers) {
        this.layers = this.layers.concat(layers)
        this.filter()
    },

    _removeLayer: function(layer) {
        if (this._layerGroup.hasLayer(layer)){
            layer.removeFrom(this._layerGroup);
        }
    },

    removeLayer: function(layer) {
        this._removeLayer(layer);
        this.layers = this.layers.filter(function(e) { return e !== layer });
        this.filter();
    },

    clearLayers: function() {
        for (var i=0; i < this.layers.length; i++) {
            var layer = this.layers[i];
            this._removeLayer(layer);
        }
        this.layers = [];
    }
});

function App() {
  const mapRef = useRef();
  const [showFinishScreen, setShowFinishScreen] = useState(false);

  const onQuestionSolved = () => {
    if (countFinishedBridges() === bridges.length) {
      setShowFinishScreen(true);
      bridges.forEach((b) => {
        unsetBridgeFinished(b);
      });
    }
  };

  function MapSettings() {
    const map = useMap();
    map.setMinZoom(minZoom);
    map.setMaxZoom(minZoom + 1);
    map.setMaxBounds(bounds);
    var zsh = new ZoomShowHide();
    zsh.addTo(map);
    for (const [lat, lon, text, rotate, maxWidth] of smallLabels) {
        let maxWidthStyle = "";
        if (maxWidth !== undefined) {
            maxWidthStyle = `max-width: ${maxWidth}px`
        }
        let content = `<div class="leaflet-small-label-inner" style="${maxWidthStyle}">${text}</div>`;
        if (rotate !== undefined) {
            content = `<div style="-webkit-transform: rotate(${rotate}deg); -moz-transform:rotate(${rotate}deg); transform-origin: top left;">${content}</div>`;
        }
        var marker = L.marker([lat, lon], {
            icon: L.divIcon({
                html: content,
                className: 'leaflet-small-label',
                iconSize: null,
            })
        })
        zsh.addLayer(marker, 14.5, null);
    }
    for (const [lat, lon, text] of bigLabels) {
        const innerContent = text.split(' ').map(w => `<div>${w}</div>`).join('');
        let content = `<div class="leaflet-big-label-inner">${innerContent}</div>`;
        L.marker([lat, lon], {
            icon: L.divIcon({
                html: content,
                className: 'leaflet-big-label',
                iconSize: null,
            })
        }).addTo(map);
    }

    var popup = L.popup()

    map.on('click', (ev) => {
      popup
        .setLatLng(ev.latlng)
        .setContent("You clicked at " + ev.latlng.toString())
        .openOn(map)
    })
    return null;
  }

  return (
    <>
      <WelcomeScreen />
      {showFinishScreen && <FinishScreen />}
      <MapContainer
        className="map"
        style={{ height: "100vh", width: "100%" }}
        center={center}
        zoom={defaultZoom}
        bounds={bounds}
        ref={mapRef}
        scrollWheelZoom={true}
        zoomSnap={.25}
        zoomDelta={.25}
        wheelDebounceTime={100}
        attributionControl={false}
        maxBoundsViscosity={1.0}
      >
        <MapSettings />
        <ImageOverlay bounds={bounds} url={myMap}>
        </ImageOverlay>
        <BridgeMarkerList upperOnQuestionSolved={onQuestionSolved} />
      </MapContainer>
    </>
  );
}

function isBridgeFinished(bridge) {
  return localStorage.getItem("bridge" + bridge.position);
}

function unsetBridgeFinished(bridge) {
  return localStorage.removeItem("bridge" + bridge.position);
}

function countFinishedBridges() {
  return bridges.filter(isBridgeFinished).length;
}

export default App;
