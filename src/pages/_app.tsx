import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { theme } from '../styles/theme';
import { Fragment } from 'react';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const queryClient = new QueryClient();

  return (
    <ChakraProvider resetCSS theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Fragment>
          <Component {...pageProps} />
        </Fragment>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default MyApp;
