import { 
    ERROR_DISPLAY_ON, 
    ERROR_DISPLAY_OFF,
    LOADER_DISPLAY_ON,
    LOADER_DISPLAY_OFF
} from '../actions';

const initialState = {
    error: null,
    loading: false
}

export const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case ERROR_DISPLAY_ON: 
            return {
                ...state,
                error: action.text
            }
        case ERROR_DISPLAY_OFF: 
            return {
                ...state,
                error: null
            }
        case LOADER_DISPLAY_ON: 
            return {
                ...state,
                loading: true
            }
        case LOADER_DISPLAY_OFF: 
            return {
                ...state,
                loading: false
            }
        default:
            return state;

    }
}