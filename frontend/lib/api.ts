const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://oracle-api-kfch.onrender.com";

export type Outcome = {
  id: number;
  label: string;
  created_at: string;
};

export type Event = {
  id: number;
  question: string;
  description: string;
  category: string;
  status: string;
  resolution_source: string;
  opens_at: string;
  closes_at: string;
  resolved_at: string | null;
  winning_outcome: number | null;
  outcomes: Outcome[];
  created_at: string;
  updated_at: string;
};

export type Prediction = {
  id: number;
  user: string;
  event: number;
  outcome: number;
  confidence: string;
  status: string;
  reward_points: number;
  created_at: string;
  evaluated_at: string | null;
};

export type AuthResponse = {
  user: {
    id: number;
    username: string;
  };
  access: string;
  refresh: string;
};

export async function getEvents(): Promise<Event[]> {
  const response = await fetch(`${API_URL}/api/events/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  return response.json();
}

export async function getEvent(id: string): Promise<Event> {
  const response = await fetch(`${API_URL}/api/events/${id}/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch event");
  }

  return response.json();
}

export async function register(
  username: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Registration failed");
  }

  return data;
}

export async function login(
  username: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }

  return data;
}

export async function createPrediction(
  token: string,
  event: number,
  outcome: number,
  confidence: number,
): Promise<Prediction> {
  const response = await fetch(`${API_URL}/api/predictions/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      event,
      outcome,
      confidence,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data.detail ||
      Object.values(data).flat().join(" ") ||
      "Prediction submission failed";

    throw new Error(String(message));
  }

  return data;
}

export async function getPredictions(
  token: string,
): Promise<Prediction[]> {
  const response = await fetch(`${API_URL}/api/predictions/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch predictions");
  }

  return response.json();
}