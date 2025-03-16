import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
// HTTP link for queries & mutations
const httpLink = new HttpLink({
    uri: 'http://178.128.61.160:4000/graphql',
    headers: {
        'Content-Type': 'application/json',
    },
    credentials: 'include',
});

// WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(
    createClient({
        url: 'wss://178.128.61.160:4000/graphql', // WebSocket URL
        connectionParams: {
            // Optional: Pass authentication tokens here
            /*headers: {
                Authorization: `Bearer YOUR_ACCESS_TOKEN`, // Replace if needed
            },
            */
        },
    })
);

// Split the link: queries/mutations use HTTP, subscriptions use WebSockets
const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink
);

const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
});

export default client;
