import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// HTTP link for all operations (queries, mutations, subscriptions)
const httpLink = new HttpLink({
    uri: 'https://cors-anywhere.herokuapp.com/http://178.128.61.160:4000/graphql',
    headers: {
        "Origin": "http://localhost:8081",
    },
});

const client = new ApolloClient({
    link: httpLink, // Use only HTTP
    cache: new InMemoryCache(),
});

export default client;