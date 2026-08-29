import { BrowserRouter } from 'react-router-dom';

import { ApiProvider, AuthRedirectProvider } from './providers';
import { AppRouter } from './router';

const App = () => {
  return (
    <ApiProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AuthRedirectProvider>
          <AppRouter />
        </AuthRedirectProvider>
      </BrowserRouter>
    </ApiProvider>
  );
};

export default App;
