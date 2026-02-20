import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { act } from 'react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import { UsersProvider } from '../UsersContext';
import RegisterPage from './RegisterPage';

jest.mock('axios');

const renderWithProviders = (component) => {
  return render(
    <UsersProvider>
      <Router basename={process.env.PUBLIC_URL}>
        {component}
      </Router>
    </UsersProvider>
  );
};

describe('RegisterPage Component', () => {
  beforeEach(() => {
    cleanup();
    jest.clearAllMocks();
    jest.useFakeTimers();
    // Mock successful API call by default
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.post.mockResolvedValueOnce({ data: { id: 1 } });
  });

  afterEach(() => {
    cleanup();
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    test('should render the form with all fields', () => {
      renderWithProviders(<RegisterPage />);
      expect(screen.getByText('Formulaire d\'enregistrement')).toBeInTheDocument();
      expect(document.getElementById('nom')).toBeInTheDocument();
      expect(document.getElementById('prenom')).toBeInTheDocument();
      expect(document.getElementById('email')).toBeInTheDocument();
      expect(document.getElementById('dateNaissance')).toBeInTheDocument();
      expect(document.getElementById('ville')).toBeInTheDocument();
      expect(document.getElementById('codePostal')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /S'enregistrer/i })).toBeInTheDocument();
    });

    test('should have empty form fields initially', () => {
      renderWithProviders(<RegisterPage />);
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
      renderWithProviders(<RegisterPage />);
      const nomInput = document.getElementById('nom');
      await userEvent.type(nomInput, 'Dupont');
      expect(nomInput).toHaveValue('Dupont');
    });

    test('should clear error message when field is changed', async () => {
      renderWithProviders(<RegisterPage />);
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
      renderWithProviders(<RegisterPage />);
      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);
      expect(screen.getByText('Le nom doit contenir uniquement des lettres')).toBeInTheDocument();
    });

    test('should show error for invalid email', async () => {
      renderWithProviders(<RegisterPage />);
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
      renderWithProviders(<RegisterPage />);
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
    test('should not submit form with validation errors', async () => {
      renderWithProviders(<RegisterPage />);
      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);
      expect(localStorage.getItem('users')).toBeNull();
    });

    test('should save valid form data and show success message', async () => {
      renderWithProviders(<RegisterPage />);
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

      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);

      expect(screen.getByText('Enregistrement réussi!')).toBeInTheDocument();
      const users = JSON.parse(localStorage.getItem('users'));
      expect(users).toHaveLength(1);
      expect(users[0]).toEqual({
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean@example.com',
        dateNaissance: dateString,
        ville: 'Paris',
        codePostal: '75001'
      });
    });

    test('should clear form after successful submission', async () => {
      renderWithProviders(<RegisterPage />);
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

      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);

      expect(nomInput).toHaveValue('');
      expect(prenomInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
      expect(dateInput).toHaveValue('');
      expect(villeInput).toHaveValue('');
      expect(codePostalInput).toHaveValue('');
    });
  });

  describe('API Integration Tests - Form Submission', () => {
    test('should send valid form data to API on successful submission', async () => {
      axios.get.mockResolvedValueOnce({ data: [] });
      axios.post.mockResolvedValueOnce({
        data: { id: 1, name: 'Dupont Jean', email: 'jean@example.com' }
      });

      renderWithProviders(<RegisterPage />);
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

      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);

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

      renderWithProviders(<RegisterPage />);
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

      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);

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

      renderWithProviders(<RegisterPage />);
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

      renderWithProviders(<RegisterPage />);
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

      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    test('should not clear form when API call fails', async () => {
      axios.get.mockResolvedValueOnce({ data: [] });
      axios.post.mockRejectedValueOnce(new Error('Network error'));

      renderWithProviders(<RegisterPage />);
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

      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);

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

      renderWithProviders(<RegisterPage />);
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

      let submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);

      // First submission fails
      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });

      // Try again - should succeed
      submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Enregistrement réussi!')).toBeInTheDocument();
      });

      expect(axios.post).toHaveBeenCalledTimes(2);
    });

    test('should not call API when validation fails', async () => {
      axios.get.mockResolvedValueOnce({ data: [] });

      renderWithProviders(<RegisterPage />);
      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(axios.post).not.toHaveBeenCalled();
      });
    });

    test('should handle server error (500) from API', async () => {
      axios.get.mockResolvedValueOnce({ data: [] });
      axios.post.mockRejectedValueOnce(new Error('Server Error'));

      renderWithProviders(<RegisterPage />);
      const today = new Date();
      const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
      const dateString = twentyYearsAgo.toISOString().split('T')[0];

      const nomInput = document.getElementById('nom');
      const prenomInput = document.getElementById('prenom');
      const emailInput = document.getElementById('email');
      const dateInput = document.getElementById('dateNaissance');
      const villeInput = document.getElementById('ville');
      const codePostalInput = document.getElementById('codePostal');

      await userEvent.type(nomInput, 'Test');
      await userEvent.type(prenomInput, 'User');
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(dateInput, dateString);
      await userEvent.type(villeInput, 'Paris');
      await userEvent.type(codePostalInput, '75001');

      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Server Error')).toBeInTheDocument();
      });

      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    test('should verify API parameters include correct field transformations', async () => {
      axios.get.mockResolvedValueOnce({ data: [] });
      axios.post.mockResolvedValueOnce({ data: { id: 1 } });

      renderWithProviders(<RegisterPage />);
      const today = new Date();
      const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
      const dateString = twentyYearsAgo.toISOString().split('T')[0];

      const nomInput = document.getElementById('nom');
      const prenomInput = document.getElementById('prenom');
      const emailInput = document.getElementById('email');
      const dateInput = document.getElementById('dateNaissance');
      const villeInput = document.getElementById('ville');
      const codePostalInput = document.getElementById('codePostal');

      await userEvent.type(nomInput, 'BERNARD');
      await userEvent.type(prenomInput, 'Claude');
      await userEvent.type(emailInput, 'claude.bernard@example.com');
      await userEvent.type(dateInput, dateString);
      await userEvent.type(villeInput, 'Marseille');
      await userEvent.type(codePostalInput, '13000');

      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);

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

      renderWithProviders(<RegisterPage />);
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
      await userEvent.type(emailInput, 'existing@example.com');
      await userEvent.type(dateInput, dateString);
      await userEvent.type(villeInput, 'Paris');
      await userEvent.type(codePostalInput, '75001');

      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);

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

      renderWithProviders(<RegisterPage />);
      const today = new Date();
      const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
      const dateString = twentyYearsAgo.toISOString().split('T')[0];

      const nomInput = document.getElementById('nom');
      const prenomInput = document.getElementById('prenom');
      const emailInput = document.getElementById('email');
      const dateInput = document.getElementById('dateNaissance');
      const villeInput = document.getElementById('ville');
      const codePostalInput = document.getElementById('codePostal');

      await userEvent.type(nomInput, 'Test');
      await userEvent.type(prenomInput, 'User');
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(dateInput, dateString);
      await userEvent.type(villeInput, 'Paris');
      await userEvent.type(codePostalInput, '75001');

      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);

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

      renderWithProviders(<RegisterPage />);
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

      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Internal Server Error')).toBeInTheDocument();
      });

      expect(screen.queryByText('Enregistrement réussi!')).not.toBeInTheDocument();
    });

    test('should not crash when server is down', async () => {
      axios.get.mockResolvedValueOnce({ data: [] });
      axios.post.mockRejectedValueOnce(new Error('Server Unavailable'));

      renderWithProviders(<RegisterPage />);
      const today = new Date();
      const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
      const dateString = twentyYearsAgo.toISOString().split('T')[0];

      const nomInput = document.getElementById('nom');
      const prenomInput = document.getElementById('prenom');
      const emailInput = document.getElementById('email');
      const dateInput = document.getElementById('dateNaissance');
      const villeInput = document.getElementById('ville');
      const codePostalInput = document.getElementById('codePostal');

      await userEvent.type(nomInput, 'Test');
      await userEvent.type(prenomInput, 'Down');
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(dateInput, dateString);
      await userEvent.type(villeInput, 'Paris');
      await userEvent.type(codePostalInput, '75001');

      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);

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

      renderWithProviders(<RegisterPage />);
      const today = new Date();
      const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
      const dateString = twentyYearsAgo.toISOString().split('T')[0];

      const nomInput = document.getElementById('nom');
      const prenomInput = document.getElementById('prenom');
      const emailInput = document.getElementById('email');
      const dateInput = document.getElementById('dateNaissance');
      const villeInput = document.getElementById('ville');
      const codePostalInput = document.getElementById('codePostal');

      await userEvent.type(nomInput, 'Retry');
      await userEvent.type(prenomInput, 'User');
      await userEvent.type(emailInput, 'retry@example.com');
      await userEvent.type(dateInput, dateString);
      await userEvent.type(villeInput, 'Paris');
      await userEvent.type(codePostalInput, '75001');

      let submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Server Error')).toBeInTheDocument();
      });

      submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Enregistrement réussi!')).toBeInTheDocument();
      });

      expect(axios.post).toHaveBeenCalledTimes(2);
    });
  });
});
