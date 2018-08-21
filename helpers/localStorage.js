const STORAGE_NAME = 'rmgl-storage';

export function logActivity(platform, activity, data) {
    const storage = getStorage();

    storage.activity.push({
        activity,
        platform,
        date: new Date(),
        data,
    });

    saveStorage(storage);
}

export function getActivity() {
    return getStorage().activity;
}


function getStorage() {
    let storage = localStorage.getItem(STORAGE_NAME);

    if (!storage) {
        createStorage();

        storage = localStorage.getItem(STORAGE_NAME);
    }

    return JSON.parse(storage);
}

function createStorage() {
    localStorage.setItem(STORAGE_NAME, JSON.stringify({
        activity: [],
    }));
}

function saveStorage(storage) {
    localStorage.setItem(STORAGE_NAME, JSON.stringify(storage));
}