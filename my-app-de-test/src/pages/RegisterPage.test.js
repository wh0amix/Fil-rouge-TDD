import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import { UsersProvider } from '../UsersContext';
import RegisterPage from './RegisterPage';

const renderWithProviders = (component) => {
  return render(
    <UsersProvider>
      <Router>
        {component}
      </Router>
    </UsersProvider>
  );
};

describe('RegisterPage Component', () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
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
});
