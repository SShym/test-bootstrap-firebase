import { AUTH, LOGOUT } from '../actions';

const initialState = {
    user: JSON.parse(localStorage.getItem('profile')) || null,
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTH: 
            localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
            return { 
                ...state, 
                user: action.data, 
            };
        
        case LOGOUT: 
            localStorage.removeItem('profile');
            return { 
                ...state,
                user: null, 
            };
            
        default:
            return state;
    }
}