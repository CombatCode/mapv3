import Rest from './../../core/Rest';
import WS from './../../core/Storage';
import Component from './../../core/Component';
import MapSet from './MapSet';
import Map from './../Map';
import Overlay from './../Overlay';
import FeatureCamera from './../Feature/FeatureCamera';


/**
 * MapSet Component (View and Controller)
 * @module components/MapSetComponent
 * @augments Component
 */
export default class MapSetComponent extends Component {

    constructor() {
        super();
        this.mapSet = {};
        this.state = {
            mapSetsEntitiesList: [],
            mapsEntities: {}
        };
    }

    initialize() {
        let mapSetsCollection = (new Rest()).client.all('mapsets');
        mapSetsCollection.getAll().then((response) => {
            this.setState({
                mapSetsEntitiesList: response.body()
            });
        });
        this.applyStatusMonitoring();
    }

    applyStatusMonitoring() {
        let ws = new WS();

        ws.client.onopen = () => {
            // TODO: Send getBounds() to api
        };

        ws.client.onmessage = (msg) => {
            let {status, id} = JSON.parse(msg.data);
            let cameraEl = document.querySelector(`.FeatureCamera[data-id="${id}"]`);
            cameraEl.setAttribute('data-status', status);
        };
    }

    applyMapSet(mapSetID) {
        for (let mapSetEntity of this.state.mapSetsEntitiesList) {
            if (mapSetEntity.id() === mapSetID) {
                let mapSetData = mapSetEntity.data();
                if (this.mapSet.instance) {
                    this.mapSet.instance.remove();
                }

                this.mapSet = new MapSet(mapSetData.id, mapSetData.ms_name,
                    Object.assign({}, this._initContextMenu()));
            }
        }
    }

    fetchMap(mapID, mapSetID) {
        let mapSetResource = (new Rest()).client.one('mapsets', mapSetID);
        let mapResource = mapSetResource.one('maps', mapID);
        mapResource.get().then((response) => {
            let mapData = (response.body()).data();
            this.applyMapSet(mapSetID);
            const streetMap = new Map(
                'http://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                {
                    attribution: 'Teleste.com',
                    maxZoom: 18
                }
            );
            this.mapSet.setOptions = {
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

            this.mapSet.initialize();
            streetMap.addTo(this.mapSet.instance);
            this.fetchFeatures(mapID, mapSetID);
            // XXX: Only for example.html as now
            document.querySelector('#mapv3 .intro').remove();
        });
    }

    fetchFeatures(mapID, mapSetID) {
        let mapSetResource = (new Rest()).client.one('mapsets', mapSetID);
        let mapResource = mapSetResource.one('maps', mapID);
        mapResource.all('features').getAll().then((response) => {
            let featuresList = [];
            let featureData = response.body();
            for (let featureEntity of featureData) {
                let feature = featureEntity.data();
                if (feature.go_type === 'camera_ptz') {
                    featuresList.push(
                        new FeatureCamera(
                            [
                                feature.go_position.lat,
                                feature.go_position.lon
                            ], {
                                angle: feature.go_angle,
                                title: feature.go_name,
                                id: feature.id,
                                status: feature.go_status || 'unknown'
                            }
                        ),
                    );
                }
            }
            let markers = (L.markerClusterGroup()).addLayers(featuresList);
            this.mapSet.instance.addLayer(markers);
            window.map = this.mapSet.instance;
        });
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
            $mapEl.appendChild(
                document.createTextNode(
                    mapData.map_name
                )
            );
            $mapEl.onclick = () => {
                this.fetchMap(mapData.id, mapSetID);
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

    _initContextMenu() {
        return {
            contextmenu:      true,
            contextmenuWidth: 140,
            contextmenuItems: [{
                text:     'Center map here',
                iconCls:  'fa fa-dot-circle-o',
                callback: function centerMap(event) {
                    this.panTo(event.latlng);
                }
            }, '-', {
                text:     'Zoom in',
                iconCls:  'fa fa-search-plus',
                callback: function zoomIn(event) {
                    this.zoomIn();
                }
            }, {
                text:     'Zoom out',
                iconCls:  'fa fa-search-minus',
                callback: function zoomOut(event) {
                    this.zoomOut();
                }
            }]
        }
    }
}
