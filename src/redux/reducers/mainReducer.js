import { 
    GET_USERS,
    GET_TRIPS
} from '../actions';

const initialState = {
    users: [],
    trips: []
}

export const mainReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_USERS: 
            return { 
                ...state, 
                users: action.data
            };
        case GET_TRIPS:
            return {
                ...state,
                trips: action.data
            }
        default:
            return state;
    }
}