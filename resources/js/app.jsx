import './bootstrap';
import '../css/app.css';
import './echo';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ThemeProvider } from '@/Components/ThemeProvider';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Get theme from props if user is authenticated
        const userTheme = props.initialPage.props.auth?.user?.theme || 'light';

        root.render(
            <ThemeProvider theme={userTheme}>
                <App {...props} />
            </ThemeProvider>
        );
    },
    progress: {
        color: '#4F46E5',
    },
});