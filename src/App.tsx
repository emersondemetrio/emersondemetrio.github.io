import 'react';
import './index.css';
import { Route, Routes, Navigate, HashRouter } from 'react-router-dom';
import { Footer } from './components/footer/footer';
import { Home } from '@/pages/home/home';
import { Blog } from '@/pages/blog/blog';
import { RemoveBackground } from '@/pages/remove-background/remove-background';
import { CanvasGame } from '@/pages/canvas-game/canvas-game';
import { Labs } from '@/pages/labs/labs';
import { Resume } from '@/pages/resume/resume';
import { Navbar } from './components/navbar/Navbar';
import { WeatherApp } from './pages/weather-app/weather-app';
import { CodePen } from './pages/code-pen/code-pen';
import { Countdown } from './pages/countdown/countdown';

const oldRoutes = [
  {
    from: ['/bg', 'experiment/bg'],
    to: '/labs/bg',
  },
  {
    from: ['/game', '/experiment/game'],
    to: '/labs/game',
  },
  {
    from: '/experiments/timezones',
    to: '/labs/timezones',
  },
]
  .map(({ from, to }) => {
    if (typeof from === 'string') return { from, to };

    return from.map(path => ({ from: path, to }));
  })
  .flat();

export const App = () => {
  return (
    <HashRouter basename={'/'}>
      <div className="grid min-h-[100dvh] grid-rows-[auto_1fr_auto]">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<Resume />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/blog" element={<Blog />} />

            {/* Experiments */}
            <Route path="/labs" element={<Labs />} />
            <Route path="/labs/background" element={<RemoveBackground />} />
            <Route path="/labs/game" element={<CanvasGame />} />
            <Route path="/labs/timezones" element={<WeatherApp />} />
            <Route path="/labs/weather" element={<WeatherApp />} />
            <Route path="/labs/code-pen" element={<CodePen />} />
            <Route path="/labs/countdown" element={<Countdown />} />
            <Route
              path="/labs/countdown/:id/:countdownName?"
              element={<Countdown />}
            />

            {/* Old routes */}
            {oldRoutes.map(({ from, to }) => (
              <Route
                key={`${from}-${to}`}
                path={from}
                element={<Navigate to={to} />}
              />
            ))}

            {/* Defaults */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};
