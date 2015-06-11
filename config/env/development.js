'use strict';

module.exports = {
	db: 'mongodb://localhost/datamanager-03-test',
	app: {
		title: 'Collector_0.1 - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '1492213777735279',
		clientSecret: process.env.FACEBOOK_SECRET || '4639ccca2dfbbced735934f40d9f32dd',
		callbackURL: '/auth/facebook/callback'
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
		clientID: process.env.GITHUB_ID || 'b832df484c6dad233c92',
		clientSecret: process.env.GITHUB_SECRET || '804c3d972d4a76fb6612cc0848666ec92fbfe2d0',
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
