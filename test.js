const axios = require('axios').default;

const loop = () => {
    return axios.get('http://localhost:8585/api/get_deficit_per_cent')
        .then((response) => console.log(response.data), console.error)
        // .then(loop);
};

loop();
