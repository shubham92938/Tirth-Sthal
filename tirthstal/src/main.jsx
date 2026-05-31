import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import {SearchProvider} from '../src/context/SearchContext.jsx'
import "./config/i18n.js"; 
import { AuthProvider }     from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <FavoritesProvider>
    <SearchProvider>
    <App />
    </SearchProvider>
     </FavoritesProvider>
    </AuthProvider>
  </StrictMode>
);