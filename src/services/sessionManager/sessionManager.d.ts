export interface Session {
  id_grupo: String;
  state: SessionState;
  personas: Number;
  personal_status: Map<String, UserState>;
}

export type SessionState = 'awaiting_start' | 'awaiting_people';
export type UserState =
  | 'awaiting_participation'
  | 'participation_confirmed'
  | 'secret_friend_assigned';
