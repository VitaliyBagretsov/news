import { BrowserRouter } from 'react-router-dom';

import { ApiProvider, AuthRedirectProvider } from './providers';
import { AppRouter } from './router';

const App = () => {
  return (
    <ApiProvider>
      <BrowserRouter>
        <AuthRedirectProvider>
          <AppRouter />
        </AuthRedirectProvider>
      </BrowserRouter>
    </ApiProvider>
  );
};

export default App;
