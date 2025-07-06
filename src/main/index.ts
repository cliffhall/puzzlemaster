import { is } from "@electron-toolkit/utils";
import { AppFacade } from "./app/AppFacade";
import { MULTITON_KEY } from "./app/constants/AppConstants";

// Only load environment variables from .env file in development mode
if (is.dev) {
  import("dotenv")
    .then((dotenv) => {
      dotenv.config({ path: `.env` });
      console.log(
        "📝 Environment variables loaded from .env file (development mode)",
      );
    })
    .catch((err) => {
      console.error("⚠️ Failed to load dotenv:", err);
    });
} else {
  console.log("🚀 Running in production mode with packaged environment");
}

// Set a short timeout to ensure any async imports are handled
setTimeout(() => {
  // Instantiate the application facade and call its startup method
  AppFacade.getInstance(MULTITON_KEY).startup();
}, 100);
