export const CURRENT_MEMBER_REDMINE_ID = 129;

export const TOMAS_REDMINE_ID = 149;
export const MAREK_GITLAB_ID = 9;

export const GITLAB_PROJECT_ID = 2;
export const REDMINE_PROJECT_ID = 15;
export const REDMINE_STATUS_ID_CLOSED = 5;
export const REDMINE_STATUS_ID_CODE_REVIEW = 11;
export const REDMINE_STATUS_ID_NEW = 1;
export const REDMINE_STATUS_ID_READY_TO_RELEASE = 9;
export const REDMINE_STATUS_ID_TESTING = 8;
export const REDMINE_STATUS_ID_SOLVED = 3;

export const FETCHING = {
    gitlab: 'gitlab-board',
    redmine: 'redmine-board',
};

export const STATUS_DONE_RATIOS = new Map([
    [REDMINE_STATUS_ID_CODE_REVIEW, 60],
    [REDMINE_STATUS_ID_TESTING, 80],
    [REDMINE_STATUS_ID_READY_TO_RELEASE, 100],
]);

export const GITLAB_LABELS = new Map([
    ['frontend', 'Frontend'],
    ['squashAndMerge', 'Squash and merge'],
]);

export const GIT_MASTER_BRANCH = 'master';