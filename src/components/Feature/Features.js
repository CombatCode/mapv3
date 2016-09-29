import Feature from './Feature';
import FeatureGroup from './FeatureGroup';
import FeatureCluster from './FeatureCluster';
import FeatureCamera from './FeatureCamera';
import FeatureLink from './FeatureLink';
import FeatureAlarm from './FeatureAlarm';
import FeatureMap from './FeatureMap';

export { Feature, FeatureGroup, FeatureCluster, FeatureCamera };

/**
 * Feature factory
 * @param {string} type
 * @param {*} params latlng, options
 * @returns [Feature]
 */
export const createFeature = function(type, ...params) {
    // TODO: Clean up here, create module per feature type
    switch (type) {
        case 'Camera_ptz':
            return new FeatureCamera(...params);
        case 'Camera':
            return new FeatureCamera(...params);
        case 'external_link':
            return new FeatureLink(...params);
        case 'map_link':
            return new FeatureMap(...params);
        case 'alarm':
            return new FeatureAlarm(...params);
        case 'Sensor':
            // Not implemented yet
            return;
    }
}
