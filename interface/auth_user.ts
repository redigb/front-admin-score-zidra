export type State = {
    token: string;
    profile: any;
    isAuth: boolean;
}

export type Actions = {
    setToken: (token: string) => void;
    setProfile: (profile: any) => void;
    logout: () => void;
}