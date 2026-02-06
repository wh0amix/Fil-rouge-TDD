function calculateAge(p) {
	if (p == null) throw new Error('missing param p')
	if (!p.birth) throw new Error('missing birth')
	const birth = p.birth
	if (!(birth instanceof Date) || isNaN(birth.getTime())) throw new Error('birth must be a valid Date')
	const now = new Date()
	if (birth.getTime() > now.getTime()) throw new Error('birth date is in the future')
	let age = now.getFullYear() - birth.getFullYear()
	const m = now.getMonth() - birth.getMonth()
	if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
		age--
	}
	return age
}

function codePostal(p) {
	if (p == null) throw new Error('missing param p')
	if (typeof p !== 'string') return false
	return /^[0-9]{5}$/.test(p)
}

function nomPrenom(p) {
	if (p == null) throw new Error('missing param p')
	if (typeof p !== 'string') return false
	// reject simple XSS patterns
	if (/[<>]/.test(p)) return false
	// allow unicode letters, spaces and hyphens
	const re = /^[\p{L}\s-]+$/u
	return re.test(p)
}

function email(p) {
	if (p == null) throw new Error('missing param p')
	if (typeof p !== 'string') return false
	const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return re.test(p)
}

// expose functions to global scope so tests can call them via side-effect import
global.calculateAge = calculateAge
global.codePostal = codePostal
global.nomPrenom = nomPrenom
global.email = email
