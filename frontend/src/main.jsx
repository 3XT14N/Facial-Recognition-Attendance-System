import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter
import { Provider } from "react-redux"; // Import Provider
import { PersistGate } from "redux-persist/integration/react"; // Import PersistGate
import { store, persistor } from "./utils/store.js"; // Import Redux store and persistor
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}> {/* Wrap with Redux Provider */}
      <PersistGate loading={null} persistor={persistor}> {/* Wrap with PersistGate */}
        <Router> {/* Wrap with Router */}
          <App />
        </Router>
      </PersistGate>
    </Provider>
  </StrictMode>
);