export function base64Encode(text) {
    return btoa(unescape(encodeURIComponent(text)));
}

export function base64Decode(base64data) {
    return decodeURIComponent(escape(atob(base64data)));
}