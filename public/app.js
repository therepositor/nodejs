// Frontend logic for the app

const app = {};

// config
app.config = {
    'sessionToken': false
}

// Ajax client (for the restful api)
app.client = {};

//Interface for making Api calls
app.client.request = (headers,path,method,queryStringObject,payload,callback) => {
    // set defaults
    headers = typeof(headers) === 'object' && headers !== null ? headers : {};
    path = typeof(path) === 'string' ? path : '/';
    method = typeof(method) === 'string' && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(method) > -1 ? method.toUpperCase() : 'GET';
    queryStringObject = typeof(queryStringObject) === 'object' && queryStringObject !== null ? queryStringObject : {};
    payload = typeof(payload) === 'object' && payload !== null ? payload : {};
    callback = typeof(callback) === 'function' ? callback : false;

    // For each query string parameter sent, add it to the path
    const requestUrl = path+'?';
    let counter = 0;
    for (const queryKey in queryStringObject) {
        if (queryStringObject.hasOwnProperty(queryKey)) {
            counter++
            // if at least one query parameter has already been added, prepend new one and add ampersand
            if(counter > 1){
                requestUrl += '&'
            }
            // add the pathname
            requestUrl += queryKey+'='+queryStringObject[queryKey]
        }
    }
    // form the http request as a json type
    const xhr = new XMLHttpRequest();
    xhr.open(method,requestUrl,true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    // for each header sent, add it to the request
    for (const headerKey in headers) {
        if (headers.hasOwnProperty(headerKey)) {
            xhr.setRequestHeader(headerKey, headers[headerKey]);    
        }
    }
    // if there's a current session token set, add that as a header
    if(app.config.sessionToken){
        xhr.setRequestHeader('token',app.config.sessionToken.id)
    }
    // when the request comes back, handle the response
    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE){
            const statusCode = xhr.status;
            const responseReturned = xhr.responseText;

            // callback if requested
            if(callback){
                try {
                    const parsedResponse = JSON.parse(responseReturned);
                    callback(statusCode, parsedResponse) 
                } catch (e) {
                    callback(statusCode, false)
            }
        }
    }
    }
    // send the payload as Json
    const payloadString = JSON.stringify(payload);
    xhr.send(payloadString);
}