function createUrlParams (queryObj) {
    if (!queryObj) {
        return '?page=0&limit=5';
    }

    let url = '?';
    for (const queryParam in queryObj) {
        if(Array.isArray(queryObj[queryParam])) {
            for (const param of queryObj[queryParam]) {
                url += `${queryParam}=${param}&`
            }
        }
        else {
            url += `${queryParam}=${queryObj[queryParam]}&`
        }
    }
    
    if (!Object.hasOwn(queryObj, 'limit')) {
        url += `limit=5&`
    }
    if (!Object.hasOwn(queryObj, 'page')) {
        url += `page=0&`
    }

    return url;
}

module.exports = {
    createUrlParams
}