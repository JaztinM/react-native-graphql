import { gql } from '@apollo/client';

export const GET_MESSAGES = gql`
  query Messages($sender_Id: ID!, $receiver_Id: ID!) {
    messages(sender_id: $sender_Id, receiver_id: $receiver_Id) {
      id
      sender_id
      receiver_id
      message
    }
  }
`;
