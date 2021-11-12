// Packages
const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 4000;

// IBM Packages
const DiscoveryV2 = require('ibm-watson/discovery/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

// DOTENV configuration
// If no .env file exists, you will need to create one and add the API_KEY
require('dotenv').config();

// EXPRESS setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// IBM DISCOVERY setup
const discovery = new DiscoveryV2({
	version: '2020-08-30',
	authenticator: new IamAuthenticator({
		apikey: process.env.API_KEY,
	}),
	serviceUrl: 'https://api.us-south.discovery.watson.cloud.ibm.com',
});

// ENDPOINTS
app.get('/collections', (req, res) => {
	const params = {
		projectId: process.env.PROJECT_ID
	}

	discovery.listCollections(params)
	.then(response => {
		res.send(response.result.collections)
		console.log(response)
	})
	.catch(err => {
		console.log('error:', err);
		res.status(400).send(err)
	})
})

app.get('/autocomplete', (req, res) => {
	console.log("Autocomplete prefix: " + req.query.prefix)
	
	const params = {
		projectId: process.env.PROJECT_ID,
		collectionIds: [req.query.collection],
		prefix: req.query.prefix,
		count: 3
	}
	
	discovery.getAutocompletion(params)
		.then(response => res.send(response.result))
		.catch(err => console.log('error:', err));
})

app.get('/search', (req, res) => {
	console.log(req.query.search)
	const params = {
		projectId: process.env.PROJECT_ID,
		collectionIds: [req.query.collection],
		query: req.query.search,
		count: 6
	}

	discovery.query(params)
	.then(response => res.send(response.result))
	.catch(err => console.log('error:', err));
})

app.listen(PORT, () => console.log("server running on port: " + PORT))