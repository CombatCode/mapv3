import Feature from './Feature';
import FeatureGroup from './FeatureGroup';
import FeatureCluster from './FeatureCluster';
import FeatureCamera from './FeatureCamera';

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
        case 'camera_ptz':
            return new FeatureCamera(...params);
        case 'camera':
            return new FeatureCamera(...params);
        case 'sensor':
            // Not implemented yet
            return;
    }
}
