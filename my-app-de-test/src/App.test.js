import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import axios from 'axios';
import App from './App';

jest.mock('axios');

describe('App Component - Router & Navigation', () => {
  beforeEach(() => {
    cleanup();
    jest.clearAllMocks();
    axios.get.mockResolvedValueOnce({ data: [] });
  });

  afterEach(() => {
    cleanup();
  });

  describe('Router Setup', () => {
    test('should render app without crashing', async () => {
      await act(async () => {
        render(<App />);
      });
      expect(screen.getByRole('link', { name: /Accueil/i })).toBeInTheDocument();
    });

    test('should display HomePage by default', async () => {
      await act(async () => {
        render(<App />);
      });
      await waitFor(() => {
        expect(screen.getByText('Bienvenue sur notre plateforme')).toBeInTheDocument();
      });
    });

    test('should render navbar with Accueil link', async () => {
      await act(async () => {
        render(<App />);
      });
      const navLink = screen.getByRole('link', { name: /Accueil/i });
      expect(navLink).toBeInTheDocument();
    });
  });

  describe('User Context Integration', () => {
    test('should provide UsersContext to all pages', async () => {
      await act(async () => {
        render(<App />);
      });
      await waitFor(() => {
        expect(screen.getByText('Bienvenue sur notre plateforme')).toBeInTheDocument();
      });
      expect(screen.getByText(/utilisateur\(s\) inscrit\(s\)/)).toBeInTheDocument();
    });
  });
});

