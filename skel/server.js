import express from 'express';
import jade from 'jade';

let production = process.env.NODE_ENV === 'production';

let app = express();
let router = express.Router();

if (production) {
	console.log('[pro]');
	app.use(require('compression')());
}
else {
	console.log('[dev]');
}

import { makeHTMLDriver } from '@cycle/dom';
let renderer = makeHTMLDriver();
import view from './src/js/view';

let template = jade.compileFile('./src/html/index.jade');

router.get('/', (req, res) => {
	renderer(view().first())
		.first()
		.forEach(DOM => {
			res.end(template({ ssr: DOM }));
		});
});

app
	.use(router)
	.use(express.static('./public'));

const port = process.env.PORT || 3000;

app.listen(port, 'localhost', err => {
	if (err) {
		return console.err(err);
	}
	console.log(`listening on http://localhost:${ port }`);
});
