import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App Component', () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    test('should render the form with all fields', () => {
      render(<App />);

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
      render(<App />);

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
      render(<App />);
      const nomInput = document.getElementById('nom');
      await userEvent.type(nomInput, 'Dupont');
      expect(nomInput).toHaveValue('Dupont');
    });

    test('should clear error message when field is changed', async () => {
      render(<App />);
      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);
      expect(screen.getByText('Le nom doit contenir uniquement des lettres')).toBeInTheDocument();

      const nomInput = document.getElementById('nom');
      await userEvent.type(nomInput, 'Dupont');
      expect(screen.queryByText('Le nom doit contenir uniquement des lettres')).not.toBeInTheDocument();
    });

    test('should handle multiple field inputs', async () => {
      render(<App />);
      const nomInput = document.getElementById('nom');
      const prenomInput = document.getElementById('prenom');
      const emailInput = document.getElementById('email');

      await userEvent.type(nomInput, 'Dupont');
      await userEvent.type(prenomInput, 'Jean');
      await userEvent.type(emailInput, 'jean@example.com');

      expect(nomInput).toHaveValue('Dupont');
      expect(prenomInput).toHaveValue('Jean');
      expect(emailInput).toHaveValue('jean@example.com');
    });
  });

  describe('Form Validation', () => {
    test('should show error for empty nom', async () => {
      render(<App />);
      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);
      expect(screen.getByText('Le nom doit contenir uniquement des lettres')).toBeInTheDocument();
    });

    test('should show error for nom with numbers', async () => {
      render(<App />);
      const nomInput = document.getElementById('nom');
      await userEvent.type(nomInput, 'Dupont123');

      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);
      expect(screen.getByText('Le nom doit contenir uniquement des lettres')).toBeInTheDocument();
    });

    test('should show error for empty prenom', async () => {
      render(<App />);
      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);
      expect(screen.getByText('Le prénom doit contenir uniquement des lettres')).toBeInTheDocument();
    });

    test('should show error for prenom with numbers', async () => {
      render(<App />);
      const prenomInput = document.getElementById('prenom');
      await userEvent.type(prenomInput, 'Jean123');

      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);
      expect(screen.getByText('Le prénom doit contenir uniquement des lettres')).toBeInTheDocument();
    });

    test('should show error for invalid email', async () => {
      render(<App />);
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

    test('should show error for missing date de naissance', async () => {
      render(<App />);
      const nomInput = document.getElementById('nom');
      const prenomInput = document.getElementById('prenom');
      const emailInput = document.getElementById('email');

      await userEvent.type(nomInput, 'Dupont');
      await userEvent.type(prenomInput, 'Jean');
      await userEvent.type(emailInput, 'jean@example.com');

      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);
      expect(screen.getByText('La date de naissance est requise')).toBeInTheDocument();
    });

    test('should show error for age under 18', async () => {
      render(<App />);
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

    test('should show error for empty ville', async () => {
      render(<App />);
      const today = new Date();
      const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
      const dateString = twentyYearsAgo.toISOString().split('T')[0];

      const nomInput = document.getElementById('nom');
      const prenomInput = document.getElementById('prenom');
      const emailInput = document.getElementById('email');
      const dateInput = document.getElementById('dateNaissance');
      const codePostalInput = document.getElementById('codePostal');

      await userEvent.type(nomInput, 'Dupont');
      await userEvent.type(prenomInput, 'Jean');
      await userEvent.type(emailInput, 'jean@example.com');
      await userEvent.type(dateInput, dateString);
      await userEvent.type(codePostalInput, '75001');

      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);
      expect(screen.getByText('La ville est requise')).toBeInTheDocument();
    });

    test('should show error for invalid code postal', async () => {
      render(<App />);
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
      await userEvent.type(codePostalInput, '750');

      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);
      expect(screen.getByText('Code postal invalide (5 chiffres)')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    test('should not submit form with validation errors', async () => {
      render(<App />);
      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);
      expect(localStorage.getItem('users')).toBeNull();
    });

    test('should save valid form data to localStorage', async () => {
      render(<App />);
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
      render(<App />);
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

    test('should show success message after submission', async () => {
      render(<App />);
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
    });

    test('should display success message after valid submission', async () => {
      render(<App />);
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
    });

    test('should append multiple users to localStorage', async () => {
      render(<App />);
      const today = new Date();
      const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
      const dateString = twentyYearsAgo.toISOString().split('T')[0];

      const inputs = screen.getAllByDisplayValue('');
      await userEvent.type(inputs[0], 'Dupont');
      await userEvent.type(inputs[1], 'Jean');
      await userEvent.type(inputs[2], 'jean@example.com');
      await userEvent.type(inputs[3], dateString);
      await userEvent.type(inputs[4], 'Paris');
      await userEvent.type(inputs[5], '75001');

      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);

      const users1 = JSON.parse(localStorage.getItem('users'));
      expect(users1).toHaveLength(1);

      const inputs2 = screen.getAllByDisplayValue('');
      await userEvent.type(inputs2[0], 'Martin');
      await userEvent.type(inputs2[1], 'Pierre');
      await userEvent.type(inputs2[2], 'pierre@example.com');
      await userEvent.type(inputs2[3], dateString);
      await userEvent.type(inputs2[4], 'Lyon');
      await userEvent.type(inputs2[5], '69000');

      const submitButton2 = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton2);

      const users2 = JSON.parse(localStorage.getItem('users'));
      expect(users2).toHaveLength(2);
    });
  });

  describe('Integration Tests', () => {
    test('should handle complete user registration flow', async () => {
      render(<App />);
      const today = new Date();
      const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
      const dateString = twentyYearsAgo.toISOString().split('T')[0];

      const nomInput = document.getElementById('nom');
      const prenomInput = document.getElementById('prenom');
      const emailInput = document.getElementById('email');
      const dateInput = document.getElementById('dateNaissance');
      const villeInput = document.getElementById('ville');
      const codePostalInput = document.getElementById('codePostal');

      await userEvent.type(nomInput, 'Bernard');
      await userEvent.type(prenomInput, 'Claude');
      await userEvent.type(emailInput, 'claude.bernard@example.com');
      await userEvent.type(dateInput, dateString);
      await userEvent.type(villeInput, 'Marseille');
      await userEvent.type(codePostalInput, '13000');

      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);

      expect(screen.getByText('Enregistrement réussi!')).toBeInTheDocument();
      expect(nomInput).toHaveValue('');

      const users = JSON.parse(localStorage.getItem('users'));
      expect(users[0]).toEqual({
        nom: 'Bernard',
        prenom: 'Claude',
        email: 'claude.bernard@example.com',
        dateNaissance: dateString,
        ville: 'Marseille',
        codePostal: '13000'
      });
    });

    test('should prevent submission and show all errors for completely empty form', async () => {
      render(<App />);
      const submitButton = screen.getByRole('button', { name: /S'enregistrer/i });
      await userEvent.click(submitButton);

      expect(screen.getByText('Le nom doit contenir uniquement des lettres')).toBeInTheDocument();
      expect(screen.getByText('Le prénom doit contenir uniquement des lettres')).toBeInTheDocument();
      expect(screen.getByText('Email invalide')).toBeInTheDocument();
      expect(screen.getByText('La date de naissance est requise')).toBeInTheDocument();
      expect(screen.getByText('La ville est requise')).toBeInTheDocument();
      expect(screen.getByText('Code postal invalide (5 chiffres)')).toBeInTheDocument();

      expect(localStorage.getItem('users')).toBeNull();
    });
  });
});
