import { gql } from '@apollo/client';

export const SEND_MESSAGE = gql`
  mutation SendMessage($senderId: ID!, $receiverId: ID!, $message: String!) {
    sendMessage(sender_id: $senderId, receiver_id: $receiverId, message: $message) {
      id
      sender_id
      receiver_id
      message
    }
  }
`;
