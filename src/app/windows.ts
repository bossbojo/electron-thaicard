export function getLocalStorage(): Storage | null {
    return (typeof window !== 'undefined') ? window.localStorage : null;
}

export function getWindowObject(): Window | null {
    return (typeof window !== 'undefined') ? window : null;
}
export function getLocationObject(): Location | null {
    return (typeof location !== 'undefined') ? location : null;
}
