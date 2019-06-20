function Http(method, url, bodyOrParams, onResult, onHeader, onError) {
    let body;
    if(bodyOrParams)
    {
        body = '';
        if(typeof bodyOrParams === 'object')
        {
            for(let paramName in bodyOrParams)
            {
                if(body !== '') body += '&';
                body += paramName + "=" + encodeURIComponent(bodyOrParams[paramName]);
            }
        }
        else body = bodyOrParams;
    }
    let req = new XMLHttpRequest();
    req.onreadystatechange = event => {
        if(req.readyState === XMLHttpRequest.HEADERS_RECEIVED)
        {
            if(onHeader) onHeader(req)
        }
        if(req.readyState === XMLHttpRequest.DONE)
        {
            if(req.status >= 200 && req.status < 400)
            {
                let resp = req.response;
                if(typeof req.response === 'string') resp = JSON.parse(resp)
                if(onResult) onResult(resp);
            }
            else
            {
                if(onError) onError(req);
                else alert("Ошибка (" + req.statusText + ' ' + req.status + "): " + req.responseText);
            }
        }
    };
    req.open(method, url, true);
    req.withCredentials = true;
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    req.send(body);
}

function HttpPost(url, bodyOrParams, onResult, onHeader, onError) {
    Http('POST', url, bodyOrParams, onResult, onHeader, onError)
}

var russianDateFormat = new Intl.DateTimeFormat('ru-RU', {
    year: '2-digit', month: '2-digit', day: '2-digit' }).format;

/**
 * @param {HTMLElement} eOrder
 */
function Order(eOrder)
{
    var name = eOrder.querySelector('input[name="Name"]').value
    var email = eOrder.querySelector('input[name="Email"]').value
    var date = new Date(eOrder.querySelector('input[name="Date"]').value)
    var phone = eOrder.querySelector('input[name="Phone"]').value
    var procedure = eOrder.querySelector('select[name="Procedure"]').value
    var result = {
        id: "mpgDA",
        type: "vol-nova.ru: Запишите меня",
        title: name,
        message: phone + "\n" + email + "\n" + russianDateFormat(date) + ": " + procedure
    }
    HttpPost("https://wirepusher.com/send", result, null, null, function() {})
}

/**
 * @param {HTMLElement} eWriteMe
 */
function WriteMe(eWriteMe)
{
    var name = eWriteMe.querySelector('input[name="Name"]').value
    var email = eWriteMe.querySelector('input[name="Email"]').value
    var subject = eWriteMe.querySelector('input[name="Subject"]').value
    var message = eWriteMe.querySelector('textarea[name="Message"]').value
    var result = {
        id: "mpgDZ",
        type: "vol-nova.ru: Напишите мне",
        title: subject + " " + name + " " + email,
        message: message
    }
    HttpPost("https://wirepusher.com/send", result, null, null, function() {})
}
