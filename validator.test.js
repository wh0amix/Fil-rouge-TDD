import 'validator.js';

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
            const now = new Date()
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

})