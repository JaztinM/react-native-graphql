import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { ApolloClient, InMemoryCache } from '@apollo/client';

const httpLink = new HttpLink({
    uri: 'https://178.128.61.160.nip.io/graphql',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

const wsLink = new GraphQLWsLink(
    createClient({
        url: 'wss://178.128.61.160.nip.io/graphql',
        retryAttempts: 3,  // Auto-reconnect on failure
    })
);

// Use split() to determine which link to use (HTTP or WebSocket)
const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    httpLink
);

// Apollo Client instance
const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
    connectToDevTools: true, // Enables Apollo DevTools support
});

export default client;
