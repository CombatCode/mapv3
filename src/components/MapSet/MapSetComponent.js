import { Socket } from "phoenix"

import Storage from './../../core/Storage';
import Rest from './../../core/Rest';
import Component from './../../core/Component';
import MapSet from './MapSet';
import Map from './../Map';
import Overlay from './../Overlay';
import { createFeature } from '../Feature/Features';
import { SETTINGS } from './../../settings';


/**
 * MapSet Component (View and Controller)
 * @module components/MapSetComponent
 * @augments Component
 */
export default class MapSetComponent extends Component {

    constructor() {
        super();
        this.mapSet = {};
        this.featuresOnMap = {};
        this.featuresIDsOnMap = [];
        this.lockAddingLayers = false;
        this.loaderCanBeVisible = false;
        this.state = {
            mapSetsEntitiesList: [],
            mapsEntities: {}
        };
        this.user = (new Storage(localStorage, 'auth')).getItem('username');
        // TODO: Remove this console logs after merging it with WebApp
        let socket = new Socket(SETTINGS.API.WS_ADDRESS, {
            logger: ((kind, msg, data) => { console.log(kind); console.log(msg); console.log(data); })
        });
        socket.connect({user_id: this.user});
        this.chan = socket.channel(`polling:${ this.user }`, {});
        this.chan.join();
        this.chan.on('change', (object) => {
            this.updateFeatures(object);
        });
    }

    initialize() {
        let mapSetsCollection = (new Rest()).client.all('mapsets');
        mapSetsCollection.getAll().then((response) => {
            this.setState({
                mapSetsEntitiesList: response.body()
            });
        });
    }

    applyMapSet(mapSetID) {
        for (let mapSetEntity of this.state.mapSetsEntitiesList) {
            if (mapSetEntity.id() === mapSetID) {
                let mapSetData = mapSetEntity.data();
                if (this.mapSet.instance) {
                    this.mapSet.instance.remove();
                }

                this.mapSet = new MapSet(mapSetData.id, mapSetData.ms_name, {});
            }
        }
    }

    fetchMap(mapID, mapSetID) {
        let mapSetResource = (new Rest()).client.one('mapsets', mapSetID);
        let mapResource = mapSetResource.one('maps', mapID);
        mapResource.get().then((response) => {
            this.applyMapSet(mapSetID);
            let mapInstance;
            let mapOverlay;
            let mapData = (response.body()).data();
            let defaultMapOptions = {
                center: [
                    mapData.map_center.lat,
                    mapData.map_center.lon,
                ],
                maxBounds: [
                    [
                        mapData.map_restricted_extent[0].lat,
                        mapData.map_restricted_extent[0].lon
                    ], [
                        mapData.map_restricted_extent[1].lat,
                        mapData.map_restricted_extent[1].lon
                    ]
                ],
                zoom: 8,
            };

            if (mapData.gismaptypes.map_type_geographic) {
                let {url_pattern, options} = mapData.gismaptypes.map_type_attributes;
                mapInstance = new Map(url_pattern, options);
                Object.assign(defaultMapOptions , {crs: L.CRS.EPSG3857});
            } else {
                let {overlay_url, bounds} = mapData.gismaptypes.map_type_attributes;
                mapOverlay = new Overlay(overlay_url, bounds);
                mapInstance = new Map('', {});
                Object.assign(defaultMapOptions , {crs: L.CRS.Simple});
            }
            // TODO: Remove this window debbugger after merge to our webapp
            window.map = this.mapSet;
            this.mapSet.setOptions = defaultMapOptions;
            this.mapSet.initialize();
            this.mapSet.compoennt = this;

            if (mapOverlay) {
                mapOverlay.addTo(this.mapSet.instance);
            }
            mapInstance.addTo(this.mapSet.instance);

            this.featuresOnMap = {};
            this.featuresIDsOnMap = [];
            this.fetchFeatures(mapID, mapSetID);

            this.parseOverlayers(mapData.gisoverlayersets);

            // XXX: Only for example.html as now
            let el = document.querySelector('#mapv3 .intro');
            el && el.remove();

            this.mapSet.instance.on('moveend', () => {
                this.lockAddingLayers = false;
                this.fetchFeatures(mapID, mapSetID);
            });
            this.mapSet.instance.on('movestart', () => {
                this.lockAddingLayers = true;
            });
        });
    }

    fetchFeatures(mapID, mapSetID, page = 0) {
        let mapSetResource = (new Rest()).client.one('mapsets', mapSetID);
        let mapResource = mapSetResource.one('maps', mapID);
        let bounds = this.mapSet.instance.getBounds();
        let featuresResourceUrl = `features/${bounds._southWest.lat}/${bounds._southWest.lng}/${bounds._northEast.lat}/${bounds._northEast.lng}`;
        // Count offset based on the zoom level
        // Smaller zoom level cause smaller offset
        let currentOffset = parseInt(SETTINGS.API.DEFAULT_OFFSET / ((this.mapSet.instance.getZoom() + 1) * 4));
        let featuresList = [];
        let featuresIdsList = [];
        // don't show loader immediately, maybe it's a fast request?
        this.loaderCanBeVisible = true;
        setTimeout(() => {
            if (this.loaderCanBeVisible) {
                document.querySelector('.map-loader').className = 'map-loader visible';
            }
        }, 500);
        mapResource.all(`${featuresResourceUrl}/${currentOffset}/${page}`).getAll().then((response) => {
            let featureBody = response.body();
            for (let featureEntity of featureBody) {
                let featureData = featureEntity.data();
                if (this.featuresIDsOnMap.indexOf(featureData.id) === -1) {
                    // Since ID is not a unique (wtf) we need a unique key value
                    // based on id + type
                    let featureKey = `${featureData.go_id}${featureData.go_type}`;
                    let feature = createFeature(
                        featureData.go_type, [
                            featureData.go_position.lat,
                            featureData.go_position.lon
                        ], {
                            angle: featureData.go_angle,
                            name: featureData.go_name,
                            id: featureData.id,
                            key: featureKey
                        }
                    );
                    if (feature) {
                        featuresIdsList.push(featureData.id);
                        featuresList.push(feature);
                        this.featuresOnMap[featureKey] = feature;
                    }
                }
            }
            // Stop adding new layers when map is in move, coz this action fire fetching new collection of features
            if (!this.lockAddingLayers) {
                this.featuresIDsOnMap = this.featuresIDsOnMap.concat(featuresIdsList);
                this.mapSet.features.addLayers(featuresList);
                if (featureBody.length > 0) {
                    this.fetchFeatures(mapID, mapSetID, ++page);
                } else {
                    // stop fetching new features
                    this.loaderCanBeVisible = false;
                    document.querySelector('.map-loader').className = 'map-loader hidden';
                    this.registerFeatures();
                }
            }
        });
    }

    registerFeatures() {
        this.chan.push(
            'register',
            {
                user: 'guest',
                objects: this.mapSet.visibleFeaturesIdentificators
            }
        ).receive('ok', (msg) => this.updateFeatures(msg.objects) );
    }

    updateFeatures(object) {
        for (let key in object) {
            this.featuresOnMap[key].options.statuses = object[key].statuses
        }
    }

    parseOverlayers(overlayerSet) {
        let overlayControl = {};
        for(let overlayer of overlayerSet.overlayers) {
            overlayControl[overlayer.ovl_name] = new Overlay(
                'http://almaqam.net/images/black-opacity-80.png',
                [
                    [
                        overlayer.ovl_attributes.bounds[0].latmin,
                        overlayer.ovl_attributes.bounds[0].lonmin
                    ], [
                        overlayer.ovl_attributes.bounds[1].latmax,
                        overlayer.ovl_attributes.bounds[1].lonmax
                    ]
                ]
            )
        }
        L.control.layers(null, overlayControl).addTo(this.mapSet.instance);
    }

    fetchMapsList(mapSetID) {
        let mapSetResource = (new Rest()).client.one('mapsets', mapSetID);
        let mapsCollection = mapSetResource.all('maps');
        mapsCollection.getAll().then((response) => {
            this.setState({
                mapsEntities: {
                    mapSetID: mapSetID,
                    body: response.body()
                }
            });
        });
    }

    // TODO: Move it into separated component
    renderMapsList(mapSetID) {
        const $mapsElements = document.createElement('ul');
        for (let mapEntity of this.state.mapsEntities.body) {
            const $mapEl = document.createElement('li');
            let mapData = mapEntity.data();

            $mapEl.setAttribute('data-id', mapData.id);
            $mapEl.setAttribute('data-name', mapData.map_name);
            $mapEl.setAttribute('data-mapset-id', mapSetID);
            $mapEl.setAttribute('draggable', 'true');
            $mapEl.appendChild(
                document.createTextNode(
                    mapData.map_name
                )
            );
            $mapEl.onclick = () => {
                this.fetchMap(mapData.id, mapSetID);
            };
            $mapEl.ondragstart = (event) => {
                event.dataTransfer.setData(
                    'application/json',
                    JSON.stringify({
                        type: 'map_link',
                        name: mapData.map_name,
                        mapID: mapData.id,
                        mapSetID: mapSetID
                    })
                )
            };
            $mapsElements.appendChild($mapEl);
        }
        return $mapsElements;
    }

    render() {
        const $mapSetsElements = document.createElement('ul');

        // Create nodes
        if (this.state.mapSetsEntitiesList) {
            for (let mapSetEntity of this.state.mapSetsEntitiesList) {
                const $mapSetEl = document.createElement('li');
                let mapSetData = mapSetEntity.data();
                // Set attributes
                $mapSetEl.setAttribute('data-id', mapSetData.id);
                $mapSetEl.setAttribute('data-name', mapSetData.ms_name);
                // Setup visible name
                $mapSetEl.appendChild(
                    document.createTextNode(
                        mapSetData.ms_name
                    )
                );
                // Verify if mapSet has childs
                if (this.state.mapsEntities.mapSetID === mapSetData.id) {
                    $mapSetEl.appendChild(
                        this.renderMapsList(mapSetData.id)
                    );
                } else {
                    // Setup click events
                    $mapSetEl.onclick = () => {
                        this.fetchMapsList(mapSetData.id);
                    };
                }
                // Append to list container
                $mapSetsElements.appendChild($mapSetEl);
            }
        }
        return $mapSetsElements;
    }
}
