const initialState = {
    user: JSON.parse(localStorage.getItem("authUser")) || null,
    token: localStorage.getItem("authToken") || null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN_SUCCESS":
            localStorage.setItem("authUser", JSON.stringify(action.payload));
            localStorage.setItem("authToken", action.payload.token);
            return { ...state, user: action.payload, token: action.payload.token };
        case "LOGOUT":
            localStorage.removeItem("authUser");
            localStorage.removeItem("authToken");
            return { ...state, user: null, token: null };
        default:
            return state;
    }
};

export default authReducer;
