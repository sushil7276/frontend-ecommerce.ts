import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import { store } from "./redux/store.ts";
import "./styles/app.scss";

// Vercel Speed Insights
import { SpeedInsights } from "@vercel/speed-insights/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
   <Provider store={store}>
      <App />
      <SpeedInsights />
   </Provider>
);
