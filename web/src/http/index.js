import axios from "axios";

const $host = axios.create({
    proxy: {
        host: 'localhost',
        port: 8000,
    },
})

export {
    $host,
}