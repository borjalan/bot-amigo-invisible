export interface Session {
  id_grupo: String;
  state: SessionState;
  personas: Number;
  personal_status: { user_id: String; state: String }[];
}

export type SessionState = 'not_initiated' | 'awaiting_start' | 'awaiting_people';
export type UserState =
  | 'awaiting_participation'
  | 'participation_confirmed'
  | 'secret_friend_assigned';
