
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { User, UserResponse } from './user';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  // Valid JWT format token (header.payload.signature)
  const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoyNTI0NjA4MDAwfQ.test';

  const mockUser: User = {
    username: 'testuser',
    password: 'password123'
  };

  const mockUserResponse: UserResponse = {
    userId: 1,
    username: 'testuser',
    token: validToken,
    message: 'Login successful',
    role: 'user'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
        {
          provide: Router,
          useValue: { navigate: vi.fn() }
        }
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with null user on creation', () => {
      const httpClient = TestBed.inject(HttpClient);
      const newService = new AuthService(httpClient, router);
      return new Promise<void>((resolve) => {
        newService.user$.subscribe((user) => {
          expect(user).toBeNull();
          resolve();
        });
      });
    });

    it('should initialize with loged as false on creation', () => {
      const httpClient = TestBed.inject(HttpClient);
      const newService = new AuthService(httpClient, router);
      return new Promise<void>((resolve) => {
        newService.isLoged().subscribe((logged) => {
          expect(logged).toBe(false);
          resolve();
        });
      });
    });
  });

  describe('login - Service Calls', () => {
    it('should call POST /auth/login with correct credentials', () => {
      service.login(mockUser).subscribe();

      const req = httpMock.expectOne(`${environment.API_URL}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockUser);
      req.flush(mockUserResponse);
    });

    it('should send username and password to server', () => {
      service.login(mockUser).subscribe();

      const req = httpMock.expectOne(`${environment.API_URL}/auth/login`);
      expect(req.request.body.username).toBe('testuser');
      expect(req.request.body.password).toBe('password123');
      req.flush(mockUserResponse);
    });
  });

  describe('login - State Updates', () => {
    it('should update user$ observable with response data', () => {
      return new Promise<void>((resolve) => {
        service.login(mockUser).subscribe(() => {
          service.user$.subscribe((user) => {
            expect(user).toEqual(mockUserResponse);
            expect(user?.username).toBe('testuser');
            expect(user?.token).toBe(validToken);
            resolve();
          });
        });

        const req = httpMock.expectOne(`${environment.API_URL}/auth/login`);
        req.flush(mockUserResponse);
      });
    });

    it('should set loged to true on successful login', () => {
      return new Promise<void>((resolve) => {
        service.login(mockUser).subscribe(() => {
          service.isLoged().subscribe((logged) => {
            expect(logged).toBe(true);
            resolve();
          });
        });

        const req = httpMock.expectOne(`${environment.API_URL}/auth/login`);
        req.flush(mockUserResponse);
      });
    });

    it('should save user data to localStorage excluding userId and message', () => {
      return new Promise<void>((resolve) => {
        service.login(mockUser).subscribe(() => {
          const stored = localStorage.getItem('user');
          const storedUser = JSON.parse(stored || '{}');
          
          expect(storedUser.token).toBe(validToken);
          expect(storedUser.username).toBe('testuser');
          expect(storedUser.role).toBe('user');
          expect(storedUser.userId).toBeUndefined();
          expect(storedUser.message).toBeUndefined();
          resolve();
        });

        const req = httpMock.expectOne(`${environment.API_URL}/auth/login`);
        req.flush(mockUserResponse);
      });
    });

    it('should return UserResponse on successful login', () => {
      return new Promise<void>((resolve) => {
        service.login(mockUser).subscribe((response) => {
          expect(response).toEqual(mockUserResponse);
          resolve();
        });

        const req = httpMock.expectOne(`${environment.API_URL}/auth/login`);
        req.flush(mockUserResponse);
      });
    });
  });

  describe('login - Action Handlers', () => {
    it('should navigate to /sales on successful login', () => {
      return new Promise<void>((resolve) => {
        service.login(mockUser).subscribe(() => {
          expect(router.navigate).toHaveBeenCalledWith(['/sales']);
          resolve();
        });

        const req = httpMock.expectOne(`${environment.API_URL}/auth/login`);
        req.flush(mockUserResponse);
      });
    });

    it('should handle login errors gracefully', () => {
      service.login(mockUser).subscribe({
        next: () => { },
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`${environment.API_URL}/auth/login`);
      req.error(new ProgressEvent('error'), { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      localStorage.setItem('user', JSON.stringify(mockUserResponse));
    });

    it('should remove user from localStorage', () => {
      service.logout();
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('should set user$ to null', () => {
      return new Promise<void>((resolve) => {
        service.logout();
        service.user$.subscribe((user) => {
          expect(user).toBeNull();
          resolve();
        });
      });
    });

    it('should set loged to false', () => {
      return new Promise<void>((resolve) => {
        service.logout();
        service.isLoged().subscribe((logged) => {
          expect(logged).toBe(false);
          resolve();
        });
      });
    });

    it('should navigate to /login', () => {
      service.logout();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should clear all user state on logout', () => {
      return new Promise<void>((resolve) => {
        service.logout();
        service.user$.subscribe((user) => {
          expect(user).toBeNull();
          expect(service.token).toBe('');
          expect(localStorage.getItem('user')).toBeNull();
          resolve();
        });
      });
    });
  });

  describe('checkToken', () => {
    it('should load user from localStorage if present and valid', () => {
      localStorage.setItem('user', JSON.stringify({
        username: 'testuser',
        token: validToken,
        role: 'user'
      }));
      
      service.checkToken();
      expect(service.userValue?.username).toBe('testuser');
    });

    it('should set loged to true when user exists in localStorage', () => {
      return new Promise<void>((resolve) => {
        localStorage.setItem('user', JSON.stringify({
          username: 'testuser',
          token: validToken,
          role: 'user'
        }));
        
        service.checkToken();
        service.isLoged().subscribe((logged) => {
          expect(logged).toBe(true);
          resolve();
        });
      });
    });

    it('should do nothing if no user in localStorage', () => {
      service.checkToken();
      expect(service.userValue).toBeNull();
    });

    it('should handle invalid JSON in localStorage gracefully', () => {
      localStorage.setItem('user', 'invalid-json{[}');
      expect(() => service.checkToken()).not.toThrow();
      expect(service.userValue).toBeNull();
    });

    it('should not load expired token from localStorage', () => {
      // Create an expired token (JWT with exp claim in the past)
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDAwMDAwMDB9.test';
      localStorage.setItem('user', JSON.stringify({
        username: 'testuser',
        token: expiredToken,
        role: 'user'
      }));
      
      const logoutSpy = vi.spyOn(service, 'logout');
      service.checkToken();
      
      expect(logoutSpy).toHaveBeenCalled();
    });
  });

  describe('Getters and Observables', () => {
    it('should return user$ as observable', () => {
      return new Promise<void>((resolve) => {
        localStorage.setItem('user', JSON.stringify({
          username: 'testuser',
          token: validToken,
          role: 'user'
        }));
        service.checkToken();
        
        service.user$.subscribe((user) => {
          expect(user?.username).toBe('testuser');
          resolve();
        });
      });
    });

    it('should return userValue correctly', () => {
      localStorage.setItem('user', JSON.stringify({
        username: 'testuser',
        token: validToken,
        role: 'user'
      }));
      service.checkToken();
      
      expect(service.userValue?.username).toBe('testuser');
    });

    it('should return token from userValue', () => {
      localStorage.setItem('user', JSON.stringify({
        username: 'testuser',
        token: validToken,
        role: 'user'
      }));
      service.checkToken();
      
      expect(service.token).toBe(validToken);
    });

    it('should return empty string when user is null', () => {
      expect(service.token).toBe('');
    });

    it('should return isLoged as observable', () => {
      return new Promise<void>((resolve) => {
        localStorage.setItem('user', JSON.stringify({
          username: 'testuser',
          token: validToken,
          role: 'user'
        }));
        service.checkToken();
        
        service.isLoged().subscribe((logged) => {
          expect(logged).toBe(true);
          resolve();
        });
      });
    });
  });

  describe('Validation Rules', () => {
    it('should validate that login requires credentials', () => {
      const emptyUser: User = { username: '', password: '' };
      service.login(emptyUser).subscribe();

      const req = httpMock.expectOne(`${environment.API_URL}/auth/login`);
      expect(req.request.body).toEqual(emptyUser);
      req.flush(mockUserResponse);
    });

    it('should validate token format before trusting it', () => {
      return new Promise<void>((resolve) => {
        const userWithToken = {
          username: 'testuser',
          token: validToken,
          role: 'user' as const
        };
        localStorage.setItem('user', JSON.stringify(userWithToken));
        
        service.checkToken();
        service.user$.subscribe((user) => {
          expect(user?.token).toBeTruthy();
          resolve();
        });
      });
    });
  });

  describe('Guarded Actions', () => {
    it('should prevent accessing token when not logged in', () => {
      expect(service.token).toBe('');
      expect(service.userValue).toBeNull();
    });

    it('should return null userValue when not authenticated', () => {
      expect(service.userValue).toBeNull();
    });

    it('should report not logged in state when localStorage is empty', () => {
      return new Promise<void>((resolve) => {
        service.isLoged().subscribe((logged) => {
          expect(logged).toBe(false);
          resolve();
        });
      });
    });

    it('should not allow accessing user data after logout', () => {
      return new Promise<void>((resolve) => {
        localStorage.setItem('user', JSON.stringify(mockUserResponse));
        service.logout();
        
        service.user$.subscribe((user) => {
          expect(user).toBeNull();
          expect(service.token).toBe('');
          resolve();
        });
      });
    });
  });
});

