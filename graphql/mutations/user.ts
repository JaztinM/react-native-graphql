import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($username: String!) {
    createUser(username: $username) {
      id
      username
    }
  }
`;
