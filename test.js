const axios = require('axios').default;
const times = [];
const testCount = 100;
let count = 0;

const loop = () => {
    const start = Date.now();
    return axios.get('http://localhost:8585/api/get_deficit_per_cent')
        .then((response) => console.log(response.data), console.error)
        .then(() => {
            times.push(Date.now() - start);
            count++;
            if (count === testCount) {
                times.sort((a, b) => a - b);
                console.log(`Test count ${testCount}, Median: ${times[Math.floor(times.length / 2)]}`);
            } else {
                loop();
            }
        })
};

loop();
