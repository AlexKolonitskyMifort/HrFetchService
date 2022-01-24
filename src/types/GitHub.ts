export interface GitHubSearchPage<T> {
    total_count: number,
    incomplete_results: boolean,
    items: T[]
}

export interface GitHubUser {
    login: string;
    id: number,
    node_id: string,
    avatar_url: string,
    gravatar_id: '',
    url: string,
    html_url: string,
    followers_url: string,
    following_url: string,
    gists_url: string,
    starred_url: string,
    subscriptions_url: string,
    organizations_url: string,
    repos_url: string,
    events_url: string,
    received_events_url: string,
    type: string,
    site_admin: false
}

export interface GitHubUserFull extends GitHubUser {
    name: string;
    company: string | null;
    blog: string;
    location: string;
    email: string | null;
    hireable: boolean | null;
    bio: string;
    twitter_username: string | null;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
}