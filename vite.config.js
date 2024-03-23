import {defineConfig, loadEnv } from 'vite'

const cherryPickedKeys = [
	"HUGGINFACE__API_KEY"
  ];



export default defineConfig(({mode}) => {
	const env = loadEnv(mode, process.cwd(), '');
	const processEnv = {};
    cherryPickedKeys.forEach(key => processEnv[key] = env[key]);
return {	
	define: {
		'process.env': processEnv
	  },
	plugins: []	,
	build: {
		target: "ES2022" 
	  }
	}
}) 