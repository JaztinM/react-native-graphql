import { gql } from '@apollo/client';

export const MESSAGE_SUBSCRIPTION = gql`
  subscription NewMessage($receiverId: ID!) {
    newMessage(receiver_id: $receiverId) {
      id
      sender_id
      receiver_id
      message
    }
  }
`;


