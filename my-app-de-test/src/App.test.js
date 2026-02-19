import { render, screen, cleanup } from '@testing-library/react';
import App from './App';

describe('App Component - Router & Navigation', () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Router Setup', () => {
    test('should render app without crashing', () => {
      render(<App />);
      expect(screen.getByRole('link', { name: /Accueil/i })).toBeInTheDocument();
    });

    test('should display HomePage by default', () => {
      render(<App />);
      expect(screen.getByText('Bienvenue sur notre plateforme')).toBeInTheDocument();
    });

    test('should render navbar with Accueil link', () => {
      render(<App />);
      const navLink = screen.getByRole('link', { name: /Accueil/i });
      expect(navLink).toBeInTheDocument();
    });
  });

  describe('User Context Integration', () => {
    test('should provide UsersContext to all pages', () => {
      render(<App />);
      // HomePage should display initial user count from context
      expect(screen.getByText('Bienvenue sur notre plateforme')).toBeInTheDocument();
      expect(screen.getByText(/utilisateur\(s\) inscrit\(s\)/)).toBeInTheDocument();
    });
  });
});

