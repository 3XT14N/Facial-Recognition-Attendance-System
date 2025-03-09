import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import CryptoJS from "crypto-js";

// Encryption key (store this securely in production)
const secretKey = "your-secret-key";

// Encryption transform
const encryptTransform = {
  in: (state) => {
    const encryptedState = CryptoJS.AES.encrypt(JSON.stringify(state), secretKey).toString();
    return { encryptedState };
  },
  out: (state) => {
    const bytes = CryptoJS.AES.decrypt(state.encryptedState, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  },
};

// Redux Persist configuration
const persistConfig = {
  key: "root",
  storage,
  transforms: [encryptTransform],
};

// Reducer (replace with your actual reducer)
const initialState = {
  user: null,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    default:
      return state;
  }
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store and persistor
export const store = createStore(persistedReducer);
export const persistor = persistStore(store);