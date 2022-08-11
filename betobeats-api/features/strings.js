'use strict'

const normalize = (track) => {
    return track.replace("[^a-zA-Z0-9]", "")
        .replace(/[\])}[{(]/g, '')
        .replace(".feat ", "")
        .replace(" .feat", "")
        .replace(" - ", " ")
        .replace("  ", " ")
        .replace("-'s", "'s")
        .replace("n-'", "n'")
        .replace("&", " ")
        .replace(".mp3", "")
        .replace(".flac", "")
}

module.exports = {
    normalize
}
