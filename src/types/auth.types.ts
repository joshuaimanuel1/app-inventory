export interface JwtPayload {
  userId: number;
  email: string;
  role: "ADMIN" | "USER";
}
