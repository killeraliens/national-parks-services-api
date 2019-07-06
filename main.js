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
            );
            $('#results-section').removeClass('hidden');
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

function fetchParks(query, states, limit) {
    // console.log(states);
    const params = {};

    params.q = query;

    if (states.length > 0) {
        // console.log(states);
        params.stateCode = states;
    }

    params.limit = limit || 10;

    params.api_key = config.PARKS_API;

    const urlRoot = 'https://developer.nps.gov/api/v1/parks?';
    const url = urlRoot + returnQueryString(params);

    // console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
               return response.json();
            }
            throw new Error(response.statusText);
        })
        .then( responseJson => {
            // console.log(responseJson);
            renderParks(responseJson);
        })
        .catch(err => {
            // console.log(err.message);
            renderError(err.message);
        })
}

function listenToForm(states) {
    $('#search-form').on('submit', (e) => {
        e.preventDefault();
        const query = $('#search-input').val();
        const limit = $('#results-count').val();
        const state = states;
        $('#results-list').empty();
        $('#error-message').text('');
        fetchParks(query, state, limit);
    })
}

function listenToDropdown() {
    const states = [];
    $('#states-select').change(function(e){
        states.push(e.target.value);
        $('#state-filters-added').removeClass('hidden');
        $('#state-filters-added span').text(`${states.join(', ')}`);
        $(this).val('');
    });
    return states;
}

function clearForm() {
    $('#clear-form').on('click', (e) => {
        $('#results-list').empty();
        $('#search-input').val('');
        $('#results-count').val('');
        $('#states-select').val('');
        $('#state-filters-added span').text('')
        $('#state-filters-added span').addClass('hidden');
        $('#results-section').addClass('hidden');

    })
}

function statesDropdown(statesArr) {
    statesArr.map(state => {
        $('#states-select').append(
            `<option>${state['value']}</option>`
        )
    });
}


listenToForm(listenToDropdown());
clearForm();
statesDropdown(states);
