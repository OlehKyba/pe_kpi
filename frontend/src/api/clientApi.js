import superagent from 'superagent';

const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(path) {
    const adjustedPath = path[0] !== '/' ? '/' + path : path;
    return '/api' + adjustedPath;
}

export class ApiClient {
    constructor(req) {
        methods.forEach((method) =>
            this[method] = (path, {params, data} = {}) => (accessToken=null) => new Promise((resolve, reject) => {
                const request = superagent[method](formatUrl(path));

                if (params) {
                    request.query(params);
                }
                if (data) {
                    request.send(data);
                }
                if(accessToken){
                    request.set('Authorization', `Bearer ${accessToken}`);
                }

                request.end((err, {body} = {}) => err ? reject({code: err.status, body}) : resolve(body));
            }));
    }
}
