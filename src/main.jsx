import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import "./index.css";
const googleClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || "").trim().replace(/^['\"]|['\"]$/g, "");
createRoot(document.getElementById("root")).render(<GoogleOAuthProvider clientId={googleClientId || "placeholder-client-id"}>
		<App />
	</GoogleOAuthProvider>);
