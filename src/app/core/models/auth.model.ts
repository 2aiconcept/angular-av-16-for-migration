export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
}

export interface UserProfile {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}
