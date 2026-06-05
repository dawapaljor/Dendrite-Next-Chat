import * as sdk from "matrix-js-sdk";

const MATRIX_HOMESERVER = "https://im.tibcert.org";
const SESSION_KEY = "matrix_chat_session";

export interface MatrixSession {
  accessToken: string;
  userId: string;
  deviceId: string;
  homeserverUrl: string;
}

let clientInstance: sdk.MatrixClient | null = null;

// Initialize Matrix Client (Browser environment safe)
export function getMatrixClient(): sdk.MatrixClient | null {
  if (typeof window === "undefined") return null;

  if (clientInstance) return clientInstance;

  const session = getStoredSession();
  if (session) {
    clientInstance = sdk.createClient({
      baseUrl: session.homeserverUrl,
      accessToken: session.accessToken,
      userId: session.userId,
      deviceId: session.deviceId,
    });
  } else {
    clientInstance = sdk.createClient({
      baseUrl: MATRIX_HOMESERVER,
    });
  }

  return clientInstance;
}

// Reset client instance (e.g. on logout)
export function clearMatrixClient() {
  if (clientInstance) {
    try {
      clientInstance.stopClient();
    } catch (_) {}
    clientInstance = null;
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
}

// Retrieve session from LocalStorage
export function getStoredSession(): MatrixSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
}

// Store session to LocalStorage
export function storeSession(session: MatrixSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

// Check homeserver registration availability and register
export async function registerMatrixUser(username: string, password: string): Promise<MatrixSession> {
  const tempClient = sdk.createClient({ baseUrl: MATRIX_HOMESERVER });
  
  try {
    const registerResponse = await tempClient.register(
      username,
      password,
      null,
      { type: "m.login.dummy" }
    );

    if (!registerResponse.access_token || !registerResponse.user_id || !registerResponse.device_id) {
      throw new Error("homeserver registration was successful but session credentials were not returned.");
    }

    const session: MatrixSession = {
      accessToken: registerResponse.access_token,
      userId: registerResponse.user_id,
      deviceId: registerResponse.device_id,
      homeserverUrl: MATRIX_HOMESERVER,
    };

    storeSession(session);
    // Refresh clientInstance
    clientInstance = sdk.createClient({
      baseUrl: session.homeserverUrl,
      accessToken: session.accessToken,
      userId: session.userId,
      deviceId: session.deviceId,
    });

    return session;
  } catch (error: any) {
    console.error("Matrix register error details:", error);
    throw error;
  }
}

// Log in existing Matrix user
export async function loginMatrixUser(username: string, password: string): Promise<MatrixSession> {
  const tempClient = sdk.createClient({ baseUrl: MATRIX_HOMESERVER });
  
  try {
    const loginResponse = await tempClient.login("m.login.password", {
      user: username,
      password: password,
    });

    if (!loginResponse.access_token || !loginResponse.user_id || !loginResponse.device_id) {
      throw new Error("homeserver login was successful but session credentials were not returned.");
    }

    const session: MatrixSession = {
      accessToken: loginResponse.access_token,
      userId: loginResponse.user_id,
      deviceId: loginResponse.device_id,
      homeserverUrl: MATRIX_HOMESERVER,
    };

    storeSession(session);
    // Refresh clientInstance
    clientInstance = sdk.createClient({
      baseUrl: session.homeserverUrl,
      accessToken: session.accessToken,
      userId: session.userId,
      deviceId: session.deviceId,
    });

    return session;
  } catch (error: any) {
    console.error("Matrix login error details:", error);
    throw error;
  }
}
