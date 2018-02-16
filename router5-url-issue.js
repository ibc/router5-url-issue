// Sorry for this but I don't want to pollute the code snippet with import+babel stuff.
const createRouter = require('router5').createRouter;
const loggerPlugin = require('router5/plugins/logger').default;
const listenersPlugin = require('router5/plugins/listeners').default;
const browserPlugin = require('router5/plugins/browser').default;

const router = createRouter(
	// routes
	[
		{
			name     : 'company',
			path     : '/:company',
			children :
			[
				{
					name : 'login',
					path : '/login'
				}
			]
		}
	],
	// options
	{
		defaultRoute  : 'company',
		defaultParams :
		{
			company : 'default-route-company'
		},
		trailingSlash     : true,
		useTrailingSlash  : false,
		strictQueryParams : false
	});

router.usePlugin(loggerPlugin);

router.usePlugin(listenersPlugin());

router.usePlugin(browserPlugin({ useHash: false }));

router.addListener(function(toState, fromState)
{
	console.warn('router5 state change: [fromState:%o, toState:%o]', fromState, toState);
});

router.start(function()
{

});

// Expose router as window.ROUTER variable.
window.ROUTER = router;
