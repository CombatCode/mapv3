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
export const createFeature = function createFeature(type, ...params) {
    switch (type) {
        case 'camera-ptz':
        case 'camera': return new FeatureCamera(...params);
    }
}
