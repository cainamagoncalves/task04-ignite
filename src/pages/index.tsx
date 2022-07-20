import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface ImagesQueryResponse {
  data: {
    title: string;
    description: string;
    url: string;
    ts: number;
    id: string;
  }[];
  after: string;
}


export default function Home(): JSX.Element {

  async function fetchImages({ pageParam = null }): Promise<ImagesQueryResponse> {
    const { data } = await api.get("/api/images");

    return data;
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery("images", fetchImages, {
    getNextPageParam: lastPage => lastPage.after ?? null,
  }
    // TODO GET AND RETURN NEXT PAGE PARAM
  );

  const formattedData = useMemo(() => {
    return data?.pages.flatMap(page => page.data) || [];
  }, [data]);

  if (isLoading) {
    return (
      <Loading />
    );
  };

  if (isError) {
    return (
      <Error />
    );
  };

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button mt="40px" borderRadius="6px" bg="orange.500" onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? "Carregando..." : "Carregar mais"}
          </Button>
        )}
      </Box>
    </>
  );
}
