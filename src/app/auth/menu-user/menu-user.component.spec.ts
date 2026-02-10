
import { TestBed } from '@angular/core/testing';
import { MenuUserComponent } from './menu-user.component';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BehaviorSubject } from 'rxjs';

interface MockUser {
  message: string;
  token: string;
  userId: number;
  username: string;
  role: string;
}

const mockRouter = {
  navigate: vi.fn()
};

const mockUser$ = new BehaviorSubject<MockUser | null>(null);
const mockIsLoged$ = new BehaviorSubject(false);
const mockAuthService = {
  user$: mockUser$.asObservable(),
  isLoged: () => mockIsLoged$.asObservable(),
  logout: vi.fn()
};

describe('MenuUserComponent', () => {
  let component: MenuUserComponent;

  beforeEach(async () => {
    mockUser$.next(null);
    mockIsLoged$.next(false);
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [CommonModule, MenubarModule, MenuUserComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
    const fixture = TestBed.createComponent(MenuUserComponent);
    component = fixture.componentInstance;
  });

  it('should initialize with default state', () => {
    component.ngOnInit();
    expect(component.isLoged).toBe(false);
    expect(component.user).toBe('');
    expect(component.loginItems.length).toBeGreaterThan(0);
    expect(component.userItems.length).toBeGreaterThan(0);
  });

  it('should update user and userItems on user$ change', () => {
    mockUser$.next({
      message: 'ok',
      token: 'abc',
      userId: 1,
      username: 'testuser',
      role: 'user'
    });
    expect(component.user).toBe('testuser');
    expect(component.userItems[0].label).toBe('testuser');
  });

  it('should update isLoged on isLoged$ change', () => {
    mockIsLoged$.next(true);
    expect(component.isLoged).toBe(true);
  });

  it('should call router.navigate on login()', () => {
    component.login();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should call auth.logout on logout()', () => {
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});
