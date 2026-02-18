import './validator.js'

/**
 * @function calculateAge
 */
describe('calculateAge Unit Test Suites', () => {
    let loise
    let person
    let future

    beforeEach(() => {
        loise = { birth: new Date('1991-07-11') }
        person = { birth: new Date('2000-02-29') }
        future = new Date()
        future.setFullYear(future.getFullYear() + 1)
    })

    it('should return the correct age', () => {
        const expected = (() => {
            const now = new Date()
            let age = now.getFullYear() - loise.birth.getFullYear()
            const m = now.getMonth() - loise.birth.getMonth()
            if (m < 0 || (m === 0 && now.getDate() < loise.birth.getDate())) {
                age--
            }
            return age
        })()

        expect(calculateAge(loise)).toBe(expected)
    })
    it('should throw a "missing birth" error when birth is not provided', () => {
        expect(() => calculateAge({})).toThrow('missing birth')
    })

    it('should throw when birth is not a Date', () => {
        expect(() => calculateAge({ birth: '1991-07-11' })).toThrow('birth must be a valid Date')
    })

    it('should throw when birth is an invalid Date', () => {
        expect(() => calculateAge({ birth: new Date('invalid') })).toThrow('birth must be a valid Date')
    })

    it('should throw when birth is in the future', () => {
        expect(() => calculateAge({ birth: future })).toThrow('birth date is in the future')
    })

    it('should handle leap-day birthdays correctly', () => {
        const expected = (() => {
            const now = new Date(²)
            let age = now.getFullYear() - person.birth.getFullYear()
            const m = now.getMonth() - person.birth.getMonth()
            if (m < 0 || (m === 0 && now.getDate() < person.birth.getDate())) {
                age--
            }
            return age
        })()
        expect(calculateAge(person)).toBe(expected)
    })
    it('should throw a "missing param p" error', () => {
        expect(() => calculateAge()).toThrow('missing param p')
    })

    it('should throw a "missing param p" error when param is null', () => {
        expect(() => calculateAge(null)).toThrow('missing param p')
    })

})

/**
 * @function codePostal
 */
describe('codePostal Unit test Suite', () => {
    it('should return true for a valid postal code', () => {
        expect(codePostal('75001')).toBe(true)
    })

    it('should return false for a postal code containing letters', () => {
        expect(codePostal('75A01')).toBe(false)
    })

    it('should return false for a postal code with wrong length', () => {
        expect(codePostal('7500')).toBe(false)
        expect(codePostal('750012')).toBe(false)
    })

    it('should throw a "missing param p" error', () => {
        expect(() => codePostal()).toThrow('missing param p')
    })

    it('should throw a "missing param p" error when param is null', () => {
        expect(() => codePostal(null)).toThrow('missing param p')
    })

    it('should return false for an empty object', () => {
        expect(codePostal({})).toBe(false)
    })

})

/**
 * @function nomPrenom
 * @description Valide le nom et le prénom: lettres, accents, espaces et tirets autorisés. Rejette chiffres, caractères spéciaux et simples injections XSS.
 */
describe('nomPrenom Unit test Suite', () => {
    it('should return true for a valid name', () => {
        expect(nomPrenom('Tony Stark')).toBe(true)
    })

    it('should return true for names with accents and hyphens', () => {
        expect(nomPrenom('Élise Léo-Durand')).toBe(true)
    })

    it('should return false when name contains digits', () => {
        expect(nomPrenom('Tony Stark2')).toBe(false)
        expect(nomPrenom('J3an Stark')).toBe(false)
    })

    it('should return false when name contains disallowed special characters', () => {
        expect(nomPrenom('Tony Stark!')).toBe(false)
        expect(nomPrenom('Jean@Stark')).toBe(false)
    })

    it('should return false for simple XSS injections', () => {
        expect(nomPrenom('<script>alert(1)</script> Stark')).toBe(false)
        expect(nomPrenom('Tony <img src=x onerror=alert(1)>')).toBe(false)
    })

    it('should throw a "missing param p" error when param is missing', () => {
        expect(() => nomPrenom()).toThrow('missing param p')
    })

    it('should throw a "missing param p" error when param is null', () => {
        expect(() => nomPrenom(null)).toThrow('missing param p')
    })

    it('should return false for an empty object', () => {
        expect(nomPrenom({})).toBe(false)
    })

})

/**
 * @function email
 * @description Vérifie le format standard d'une adresse email.
 */
describe('email Unit test Suite', () => {
    it('should return true for a valid email', () => {
        expect(email('Tony.Stark@example.com')).toBe(true)
    })

    it('should return false for an invalid email (missing @)', () => {
        expect(email('Tony.Starkexample.com')).toBe(false)
    })

    it('should return false for an email with spaces', () => {
        expect(email('Tony Stark@example.com')).toBe(false)
    })

    it('should throw a "missing param p" error when param is missing', () => {
        expect(() => email()).toThrow('missing param p')
    })

    it('should throw a "missing param p" error when param is null', () => {
        expect(() => email(null)).toThrow('missing param p')
    })

    it('should return false for an empty object', () => {
        expect(email({})).toBe(false)
    })

})