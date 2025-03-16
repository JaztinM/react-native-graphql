import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($username: String!) {
    createUser(username: $username) {
      id
      username
    }
  }
`;

export const GET_USERS = gql`
    query Users{
        users{
            id
            username
        }
 }
`;

export const GET_MESSAGES = gql`
  query Messages($senderId: Int!, $receiverId: Int!) {
    messages(sender_id: $senderId, receiver_id: $receiverId) {
      id
      sender_id
      receiver_id
      message
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($senderId: Int!, $receiverId: Int!, $message: String!) {
    sendMessage(sender_id: $senderId, receiver_id: $receiverId, message: $message) {
      id
      sender_id
      receiver_id
      message
    }
  }
`;

export const MESSAGE_SUBSCRIPTION = gql`
  subscription NewMessage($receiverId: Int!) {
    newMessage(receiver_id: $receiverId) {
      id
      sender_id
      receiver_id
      message
    }
  }
`;

