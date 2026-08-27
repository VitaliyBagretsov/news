import { BrowserRouter } from 'react-router-dom';

import { ApiProvider } from './providers';
import { AppRouter } from './router';

const App = () => {
  return (
    <ApiProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ApiProvider>
  );
};

export default App;
