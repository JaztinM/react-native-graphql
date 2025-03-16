export interface User {
    id: string;
    username: string;
}
export interface Message {
    id: string;
    sender_id: string;
    receiver_id: string;
    username: string;
    message: string;
}

