'use strict';

module.exports = {
	db: 'mongodb://localhost/datamanager-03-test',
	port: 3001,
	app: {
		title: 'DataManager_0.3 - Test Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '1492072424416081',
		clientSecret: process.env.FACEBOOK_SECRET || 'da49ffda648ea025b84511f26ac1dd43',
		callbackURL: 'http://dctool-lnx.cloudapp.net:3001/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'jCdUgoKBbWEtDmqJ8vmfoUNW2',
		clientSecret: process.env.TWITTER_SECRET || '3kmnAtUTo1mZ3nAT1qLsLLnhvNvXMoa2rTMIrqTa9q0eRboSuI',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || '952292389860-k6fjm7fo4pab5a08o57njo6md7fb1dq6.apps.googleusercontent.com',
		clientSecret: process.env.GOOGLE_SECRET || 'bz0nv9kpqPfXUZiIrZZurKaD',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
