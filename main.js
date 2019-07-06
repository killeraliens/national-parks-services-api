function renderNoResults() {
    $('#error-message').text('No Results');
}

function renderError(responseMessage) {
    $('#error-message').text(`Sorry there was an error! ${responseMessage}`);
}

function renderParks(responseJson) {
    if (responseJson.data.length && responseJson.data.length > 0) {
        responseJson.data.map(park => {
            $('#results-list').append(
                `<li>
                <h3>${park.fullName}</h3>
                <span><i class="fas fa-map-marker-alt"></i>${park.states}</span>
                <p>${park.description}</p>
                <p><a href="${park.url}">View ${park.name}'s details</a></p>
            </li>`
            )
        });
    } else {
        renderNoResults();
    }
}

function returnQueryString(params) {
    return Object.keys(params).map(key => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
    }).join('&');
}

function fetchParks(query, state, limit) {

    const params = {};

    params.q = query;
    params.limit = limit || 10;
    if (state !== null) {
        params.stateCode = state;
    }
    params.api_key = config.PARKS_API;

    const urlRoot = 'https://developer.nps.gov/api/v1/parks?';
    const url = urlRoot + returnQueryString(params);
  
    fetch(url)
        .then(response => {
            if (response.ok) {
               return response.json();
            }
            throw new Error(response.statusText);
        })
        .then( responseJson => {
            renderParks(responseJson);
        })
        .catch(err => {
            renderError(err.message);
        })
}

function listenToForm() {
    $('#search-form').on('submit', (e) => {
        e.preventDefault();
        const query = $('#search-input').val();
        const limit = $('#results-count').val();
        const state = $('#states-select').val();
        $('#results-list').empty();
        $('#error-message').text('');

        fetchParks(query, state, limit);
    })
}

function clearForm() {
    $('#clear-form').on('click', (e) => {
        $('#results-list').empty();
        $('#search-input').val('');
        $('#results-count').val('');
        $('#states-select').val('');
    })
}

function statesDropdown(statesArr) {
    statesArr.map(state => {
        $('#states-select').append(
            `<option>${state['value']}</option>`
        )
    });
}


listenToForm();
clearForm();
statesDropdown(states);
