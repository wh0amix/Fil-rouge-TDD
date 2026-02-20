import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { act } from 'react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import { UsersProvider } from '../UsersContext';
import RegisterPage from './RegisterPage';

jest.mock('axios');

const renderWithProviders = async (component) => {
  let result;
  await act(async () => {
    result = render(
      <UsersProvider>
        <Router
          basename={process.env.PUBLIC_URL}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          {component}
        </Router>
      </UsersProvider>
    );
  });
  return result;
};

describe('RegisterPage Component', () => {
  beforeEach(() => {
    cleanup();
    jest.resetAllMocks();
    // Mock GET users by default (called on mount by UsersContext)
    axios.get.mockResolvedValueOnce({ data: [] });
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    test('should render the form with all fields', async () => {
      await renderWithProviders(<RegisterPage />);
      expect(screen.getByText('Formulaire d\'enregistrement')).toBeInTheDocument();
      expect(document.getElementById('nom')).toBeInTheDocument();
      expect(document.getElementById('prenom')).toBeInTheDocument();
      expect(document.getElementById('email')).toBeInTheDocument();
      expect(document.getElementById('dateNaissance')).toBeInTheDocument();
      expect(document.getElementById('ville')).toBeInTheDocument();
      expect(document.getElementById('codePostal')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /S'enregistrer/i })).toBeInTheDocument();
    });

    test('should have empty form fields initially', async () => {
      await renderWithProviders(<RegisterPage />);
      expect(document.getElementById('nom')).toHaveValue('');
      expect(document.getElementById('prenom')).toHaveValue('');
      expect(document.getElementById('email')).toHaveValue('');
      expect(document.getElementById('dateNaissance')).toHaveValue('');
      expect(document.getElementById('ville')).toHaveValue('');
      expect(document.getElementById('codePostal')).toHaveValue('');
    });
  });

  describe('Form Input Handling', () => {
    test('should update form fields on user input', async () => {
      await renderWithProviders(<RegisterPage />);
      const nomInput = document.getElementById('nom');
      await userEvent.type(nomInput, 'Dupont');
      expect(nomInput).toHaveValue('Dupont');
    });

    test('should clear error message when field is changed', async () => {
      await renderWithProviders(<RegisterPage />);
      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);
      expect(screen.getByText('Le nom doit contenir uniquement des lettres')).toBeInTheDocument();

      const nomInput = document.getElementById('nom');
      await userEvent.type(nomInput, 'Dupont');
      expect(screen.queryByText('Le nom doit contenir uniquement des lettres')).not.toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    test('should show error for empty nom', async () => {
      await renderWithProviders(<RegisterPage />);
      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);
      expect(screen.getByText('Le nom doit contenir uniquement des lettres')).toBeInTheDocument();
    });

    test('should show error for invalid email', async () => {
      await renderWithProviders(<RegisterPage />);
      const nomInput = document.getElementById('nom');
      const prenomInput = document.getElementById('prenom');
      const emailInput = document.getElementById('email');

      await userEvent.type(nomInput, 'Dupont');
      await userEvent.type(prenomInput, 'Jean');
      await userEvent.type(emailInput, 'invalidemail');

      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);
      expect(screen.getByText('Email invalide')).toBeInTheDocument();
    });

    test('should show error for age under 18', async () => {
      await renderWithProviders(<RegisterPage />);
      const today = new Date();
      const seventeenYearsAgo = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());
      const dateString = seventeenYearsAgo.toISOString().split('T')[0];

      const nomInput = document.getElementById('nom');
      const prenomInput = document.getElementById('prenom');
      const emailInput = document.getElementById('email');
      const dateInput = document.getElementById('dateNaissance');

      await userEvent.type(nomInput, 'Dupont');
      await userEvent.type(prenomInput, 'Jean');
      await userEvent.type(emailInput, 'jean@example.com');
      await userEvent.type(dateInput, dateString);

      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);
      expect(screen.getByText('Vous devez avoir au moins 18 ans')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    test('should not call API when validation fails', async () => {
      await renderWithProviders(<RegisterPage />);
      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);
      expect(axios.post).not.toHaveBeenCalled();
    });

    test('should show success message after valid submission', async () => {
      axios.post.mockResolvedValueOnce({ data: { id: 1 } });
      await renderWithProviders(<RegisterPage />);
      const today = new Date();
      const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
      const dateString = twentyYearsAgo.toISOString().split('T')[0];

      await userEvent.type(document.getElementById('nom'), 'Dupont');
      await userEvent.type(document.getElementById('prenom'), 'Jean');
      await userEvent.type(document.getElementById('email'), 'jean@example.com');
      await userEvent.type(document.getElementById('dateNaissance'), dateString);
      await userEvent.type(document.getElementById('ville'), 'Paris');
      await userEvent.type(document.getElementById('codePostal'), '75001');

      await userEvent.click(screen.getByRole('button', { name: /S'enregistrer/i }));

      await waitFor(() => {
        expect(screen.getByText('Enregistrement réussi!')).toBeInTheDocument();
      });
    });

    test('should clear form after successful submission', async () => {
      axios.post.mockResolvedValueOnce({ data: { id: 1 } });
      await renderWithProviders(<RegisterPage />);
      const today = new Date();
      const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
      const dateString = twentyYearsAgo.toISOString().split('T')[0];

      const nomInput = document.getElementById('nom');
      const prenomInput = document.getElementById('prenom');
      const emailInput = document.getElementById('email');
      const dateInput = document.getElementById('dateNaissance');
      const villeInput = document.getElementById('ville');
      const codePostalInput = document.getElementById('codePostal');

      await userEvent.type(nomInput, 'Dupont');
      await userEvent.type(prenomInput, 'Jean');
      await userEvent.type(emailInput, 'jean@example.com');
      await userEvent.type(dateInput, dateString);
      await userEvent.type(villeInput, 'Paris');
      await userEvent.type(codePostalInput, '75001');

      await userEvent.click(screen.getByRole('button', { name: /S'enregistrer/i }));

      await waitFor(() => {
        expect(nomInput).toHaveValue('');
        expect(prenomInput).toHaveValue('');
        expect(emailInput).toHaveValue('');
        expect(dateInput).toHaveValue('');
        expect(villeInput).toHaveValue('');
        expect(codePostalInput).toHaveValue('');
      });
    });
  });

  describe('API Integration Tests - Form Submission', () => {
    test('should send valid form data to API on successful submission', async () => {
      axios.get.mockResolvedValueOnce({ data: [] });
      axios.post.mockResolvedValueOnce({
        data: { id: 1, name: 'Dupont Jean', email: 'jean@example.com' }
      });

      await renderWithProviders(<RegisterPage />);
      const today = new Date();
      const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
      const dateString = twentyYearsAgo.toISOString().split('T')[0];

      await userEvent.type(document.getElementById('nom'), 'Dupont');
      await userEvent.type(document.getElementById('prenom'), 'Jean');
      await userEvent.type(document.getElementById('email'), 'jean@example.com');
      await userEvent.type(document.getElementById('dateNaissance'), dateString);
      await userEvent.type(document.getElementById('ville'), 'Paris');
      await userEvent.type(document.getElementById('codePostal'), '75001');

      await userEvent.click(screen.getByRole('button', { name: /S'enregistrer/i }));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'https://jsonplaceholder.typicode.com/users',
          expect.objectContaining({
            name: 'Dupont Jean',
            email: 'jean@example.com',
            phone: '75001',
            username: 'dupont'
          })
        );
      });
    });

    test('should display success message after successful API submission', async () => {
      axios.get.mockResolvedValueOnce({ data: [] });
      axios.post.mockResolvedValueOnce({ data: { id: 1 } });

      await renderWithProviders(<RegisterPage />);
      const today = new Date();
      const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
      const dateString = twentyYearsAgo.toISOString().split('T')[0];

      await userEvent.type(document.getElementById('nom'), 'Dupont');
      await userEvent.type(document.getElementById('prenom'), 'Jean');
      await userEvent.type(document.getElementById('email'), 'jean@example.com');
      await userEvent.type(document.getElementById('dateNaissance'), dateString);
      await userEvent.type(document.getElementById('ville'), 'Paris');
      await userEvent.type(document.getElementById('codePostal'), '75001');

      await userEvent.click(screen.getByRole('button', { name: /S'enregistrer/i }));

      await waitFor(() => {
        expect(screen.getByText('Enregistrement réussi!')).toBeInTheDocument();
      });
    });

    test('should show loading state while API is processing', async () => {
      axios.get.mockResolvedValueOnce({ data: [] });

      let resolveRequest;
      const promise = new Promise(resolve => {
        resolveRequest = resolve;
      });
      axios.post.mockReturnValueOnce(promise);

      await renderWithProviders(<RegisterPage />);
      const today = new Date();
      const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
      const dateString = twentyYearsAgo.toISOString().split('T')[0];

      await userEvent.type(document.getElementById('nom'), 'Dupont');
      await userEvent.type(document.getElementById('prenom'), 'Jean');
      await userEvent.type(document.getElementById('email'), 'jean@example.com');
      await userEvent.type(document.getElementById('dateNaissance'), dateString);
      await userEvent.type(document.getElementById('ville'), 'Paris');
      await userEvent.type(document.getElementById('codePostal'), '75001');

      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);

      expect(screen.getByRole('button', { name: /Chargement\.\.\./i })).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      resolveRequest({ data: { id: 1 } });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /S'enregistrer/i })).not.toBeDisabled();
      });
    });

    test('should display error message when API call fails', async () => {
      axios.get.mockResolvedValueOnce({ data: [] });
      axios.post.mockRejectedValueOnce(new Error('Network error'));

      await renderWithProviders(<RegisterPage />);
      const today = new Date();
      const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
      const dateString = twentyYearsAgo.toISOString().split('T')[0];

      await userEvent.type(document.getElementById('nom'), 'Dupont');
      await userEvent.type(document.getElementById('prenom'), 'Jean');
      await userEvent.type(document.getElementById('email'), 'jean@example.com');
      await userEvent.type(document.getElementById('dateNaissance'), dateString);
      await userEvent.type(document.getElementById('ville'), 'Paris');
      await userEvent.type(document.getElementById('codePostal'), '75001');

      await userEvent.click(screen.getByRole('button', { name: /S'enregistrer/i }));

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    test('should not clear form when API call fails', async () => {
      axios.get.mockResolvedValueOnce({ data: [] });
      axios.post.mockRejectedValueOnce(new Error('Network error'));

      await renderWithProviders(<RegisterPage />);
      const today = new Date();
      const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
      const dateString = twentyYearsAgo.toISOString().split('T')[0];

      const nomInput = document.getElementById('nom');
      const prenomInput = document.getElementById('prenom');
      const emailInput = document.getElementById('email');

      await userEvent.type(nomInput, 'Dupont');
      await userEvent.type(prenomInput, 'Jean');
      await userEvent.type(emailInput, 'jean@example.com');
      await userEvent.type(document.getElementById('dateNaissance'), dateString);
      await userEvent.type(document.getElementById('ville'), 'Paris');
      await userEvent.type(document.getElementById('codePostal'), '75001');

      await userEvent.click(screen.getByRole('button', { name: /S'enregistrer/i }));

      await waitFor(() => {
        expect(nomInput).toHaveValue('Dupont');
        expect(prenomInput).toHaveValue('Jean');
        expect(emailInput).toHaveValue('jean@example.com');
      });
    });

    test('should allow resubmission after API error', async () => {
      axios.get.mockResolvedValue({ data: [] });
      axios.post
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ data: { id: 1 } });

      await renderWithProviders(<RegisterPage />);
      const today = new Date();
      const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
      const dateString = twentyYearsAgo.toISOString().split('T')[0];

      await userEvent.type(document.getElementById('nom'), 'Dupont');
      await userEvent.type(document.getElementById('prenom'), 'Jean');
      await userEvent.type(document.getElementById('email'), 'jean@example.com');
      await userEvent.type(document.getElementById('dateNaissance'), dateString);
      await userEvent.type(document.getElementById('ville'), 'Paris');
      await userEvent.type(document.getElementById('codePostal'), '75001');

      await userEvent.click(screen.getByRole('button', { name: /S'enregistrer/i }));

      // First submission fails
      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });

      // Try again - should succeed
      await userEvent.click(screen.getByRole('button', { name: /S'enregistrer/i }));

      await waitFor(() => {
        expect(screen.getByText('Enregistrement réussi!')).toBeInTheDocument();
      });

      expect(axios.post).toHaveBeenCalledTimes(2);
    });

    test('should not call API when validation fails', async () => {
      axios.get.mockResolvedValueOnce({ data: [] });

      await renderWithProviders(<RegisterPage />);
      await userEvent.click(screen.getByRole('button', { name: /S'enregistrer/i }));

      await waitFor(() => {
        expect(axios.post).not.toHaveBeenCalled();
      });
    });

    test('should handle server error (500) from API', async () => {
      axios.get.mockResolvedValueOnce({ data: [] });
      axios.post.mockRejectedValueOnce(new Error('Server Error'));

      await renderWithProviders(<RegisterPage />);
      const today = new Date();
      const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
      const dateString = twentyYearsAgo.toISOString().split('T')[0];

      await userEvent.type(document.getElementById('nom'), 'Test');
      await userEvent.type(document.getElementById('prenom'), 'User');
      await userEvent.type(document.getElementById('email'), 'test@example.com');
      await userEvent.type(document.getElementById('dateNaissance'), dateString);
      await userEvent.type(document.getElementById('ville'), 'Paris');
      await userEvent.type(document.getElementById('codePostal'), '75001');

      await userEvent.click(screen.getByRole('button', { name: /S'enregistrer/i }));

      await waitFor(() => {
        expect(screen.getByText('Server Error')).toBeInTheDocument();
      });

      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    test('should verify API parameters include correct field transformations', async () => {
      axios.get.mockResolvedValueOnce({ data: [] });
      axios.post.mockResolvedValueOnce({ data: { id: 1 } });

      await renderWithProviders(<RegisterPage />);
      const today = new Date();
      const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
      const dateString = twentyYearsAgo.toISOString().split('T')[0];

      await userEvent.type(document.getElementById('nom'), 'BERNARD');
      await userEvent.type(document.getElementById('prenom'), 'Claude');
      await userEvent.type(document.getElementById('email'), 'claude.bernard@example.com');
      await userEvent.type(document.getElementById('dateNaissance'), dateString);
      await userEvent.type(document.getElementById('ville'), 'Marseille');
      await userEvent.type(document.getElementById('codePostal'), '13000');

      await userEvent.click(screen.getByRole('button', { name: /S'enregistrer/i }));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'https://jsonplaceholder.typicode.com/users',
          expect.objectContaining({
            name: 'BERNARD Claude',
            email: 'claude.bernard@example.com',
            phone: '13000',
            username: 'bernard'
          })
        );
      });
    });
  });

  describe('API Error Handling - Business Logic (400)', () => {
    test('should handle email already exists error (400)', async () => {
      axios.get.mockResolvedValueOnce({ data: [] });
      const error = new Error('Email already exists');
      error.response = { status: 400, data: { message: 'Email already exists' } };
      axios.post.mockRejectedValueOnce(error);

      await renderWithProviders(<RegisterPage />);
      const today = new Date();
      const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
      const dateString = twentyYearsAgo.toISOString().split('T')[0];

      const nomInput = document.getElementById('nom');
      const emailInput = document.getElementById('email');

      await userEvent.type(nomInput, 'Dupont');
      await userEvent.type(document.getElementById('prenom'), 'Jean');
      await userEvent.type(emailInput, 'existing@example.com');
      await userEvent.type(document.getElementById('dateNaissance'), dateString);
      await userEvent.type(document.getElementById('ville'), 'Paris');
      await userEvent.type(document.getElementById('codePostal'), '75001');

      await userEvent.click(screen.getByRole('button', { name: /S'enregistrer/i }));

      await waitFor(() => {
        expect(screen.getByText('Email already exists')).toBeInTheDocument();
      });

      expect(nomInput).toHaveValue('Dupont');
      expect(emailInput).toHaveValue('existing@example.com');
    });

    test('should handle invalid data error (400)', async () => {
      axios.get.mockResolvedValueOnce({ data: [] });
      const error = new Error('Invalid email format');
      error.response = { status: 400, data: { message: 'Invalid email format' } };
      axios.post.mockRejectedValueOnce(error);

      await renderWithProviders(<RegisterPage />);
      const today = new Date();
      const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
      const dateString = twentyYearsAgo.toISOString().split('T')[0];

      await userEvent.type(document.getElementById('nom'), 'Test');
      await userEvent.type(document.getElementById('prenom'), 'User');
      await userEvent.type(document.getElementById('email'), 'test@example.com');
      await userEvent.type(document.getElementById('dateNaissance'), dateString);
      await userEvent.type(document.getElementById('ville'), 'Paris');
      await userEvent.type(document.getElementById('codePostal'), '75001');

      await userEvent.click(screen.getByRole('button', { name: /S'enregistrer/i }));

      await waitFor(() => {
        expect(screen.getByText('Invalid email format')).toBeInTheDocument();
      });
    });
  });

  describe('API Error Handling - Server Error (500)', () => {
    test('should handle server error (500) gracefully', async () => {
      axios.get.mockResolvedValueOnce({ data: [] });
      const error = new Error('Internal Server Error');
      error.response = { status: 500, data: { message: 'Internal Server Error' } };
      axios.post.mockRejectedValueOnce(error);

      await renderWithProviders(<RegisterPage />);
      const today = new Date();
      const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
      const dateString = twentyYearsAgo.toISOString().split('T')[0];

      await userEvent.type(document.getElementById('nom'), 'Dupont');
      await userEvent.type(document.getElementById('prenom'), 'Jean');
      await userEvent.type(document.getElementById('email'), 'jean@example.com');
      await userEvent.type(document.getElementById('dateNaissance'), dateString);
      await userEvent.type(document.getElementById('ville'), 'Paris');
      await userEvent.type(document.getElementById('codePostal'), '75001');

      await userEvent.click(screen.getByRole('button', { name: /S'enregistrer/i }));

      await waitFor(() => {
        expect(screen.getByText('Internal Server Error')).toBeInTheDocument();
      });

      expect(screen.queryByText('Enregistrement réussi!')).not.toBeInTheDocument();
    });

    test('should not crash when server is down', async () => {
      axios.get.mockResolvedValueOnce({ data: [] });
      axios.post.mockRejectedValueOnce(new Error('Server Unavailable'));

      await renderWithProviders(<RegisterPage />);
      const today = new Date();
      const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
      const dateString = twentyYearsAgo.toISOString().split('T')[0];

      const nomInput = document.getElementById('nom');

      await userEvent.type(nomInput, 'Test');
      await userEvent.type(document.getElementById('prenom'), 'Down');
      await userEvent.type(document.getElementById('email'), 'test@example.com');
      await userEvent.type(document.getElementById('dateNaissance'), dateString);
      await userEvent.type(document.getElementById('ville'), 'Paris');
      await userEvent.type(document.getElementById('codePostal'), '75001');

      await userEvent.click(screen.getByRole('button', { name: /S'enregistrer/i }));

      await waitFor(() => {
        expect(screen.getByText('Server Unavailable')).toBeInTheDocument();
      });

      // Application should still be usable
      expect(screen.getByRole('button', { name: /S'enregistrer/i })).toBeInTheDocument();
      expect(nomInput).toHaveValue('Test');
    });

    test('should allow retry after server error', async () => {
      axios.get.mockResolvedValueOnce({ data: [] });
      axios.post
        .mockRejectedValueOnce(new Error('Server Error'))
        .mockResolvedValueOnce({ data: { id: 1 } });

      await renderWithProviders(<RegisterPage />);
      const today = new Date();
      const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
      const dateString = twentyYearsAgo.toISOString().split('T')[0];

      await userEvent.type(document.getElementById('nom'), 'Retry');
      await userEvent.type(document.getElementById('prenom'), 'User');
      await userEvent.type(document.getElementById('email'), 'retry@example.com');
      await userEvent.type(document.getElementById('dateNaissance'), dateString);
      await userEvent.type(document.getElementById('ville'), 'Paris');
      await userEvent.type(document.getElementById('codePostal'), '75001');

      await userEvent.click(screen.getByRole('button', { name: /S'enregistrer/i }));

      await waitFor(() => {
        expect(screen.getByText('Server Error')).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole('button', { name: /S'enregistrer/i }));

      await waitFor(() => {
        expect(screen.getByText('Enregistrement réussi!')).toBeInTheDocument();
      });

      expect(axios.post).toHaveBeenCalledTimes(2);
    });
  });
});
