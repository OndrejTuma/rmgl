import {logActivity} from '../helpers/localStorage';

export function storageLog(platform, activity) {
    return function (target, property, descriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...data) {
            logActivity(platform, activity, {...data});

            return originalMethod.call(this, ...data);
        };

        return descriptor;
    }
}