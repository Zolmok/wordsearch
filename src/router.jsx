import {
  createRouter,
  createRootRoute,
  createRoute,
} from '@tanstack/react-router';
import App from './app.jsx';
import Home from './routes/index.jsx';
import Game from './routes/game.jsx';
import Scores from './routes/scores.jsx';

const rootRoute = createRootRoute({
  component: App,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const gameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/game',
  validateSearch: (search) => ({
    category: search.category || 'animals',
    difficulty: search.difficulty || 'medium',
  }),
  component: Game,
});

const scoresRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/scores',
  component: Scores,
});

const routeTree = rootRoute.addChildren([homeRoute, gameRoute, scoresRoute]);

export const router = createRouter({ routeTree });
