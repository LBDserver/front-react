import React, { useState } from 'react';
import AppContext, { firstContext } from '@context';
import Routes from '@routes';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { theme as themeProps } from '@styles'
import {QueryClient, QueryClientProvider} from 'react-query'

const queryClient = new QueryClient()
const theme = createMuiTheme(themeProps)

const App: React.FC = () => {
  const [context, setContext] = useState(firstContext)

  return (
    <MuiThemeProvider theme={theme}>
      <AppContext.Provider value={{ context, setContext }}>
        <QueryClientProvider client={queryClient}>
          <Routes />
        </QueryClientProvider>
      </AppContext.Provider>
    </MuiThemeProvider>
  );
}

export default App;
