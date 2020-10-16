export type Roles = 'user' | 'admin';

export interface User {
    username: string,
    password: string
}

export interface UserResponse {
    message: string,
    token: string,
    userId: number,
    username: string;
    role: Roles
}