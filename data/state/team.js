import {action, observable} from 'mobx';

class TeamStore {
    @observable
    active_member_redmine_id = 129;

    members = [
        {
            firstname: 'Andrej',
            lastname: 'Baran',
            redmine_id: 241,
            gitlab_id: 13,
        },
        {
            firstname: 'Radek',
            lastname: 'Perdok',
            redmine_id: 168,
            gitlab_id: 8,
        },
        {
            firstname: 'Jan',
            lastname: 'Kosco',
            redmine_id: 5,
            gitlab_id: 14,
        },
        {
            firstname: 'Ondrej',
            lastname: 'Tuma',
            redmine_id: 129,
            gitlab_id: 3,
        },
        {
            firstname: 'Daniel',
            lastname: 'Urban',
            redmine_id: 217,
            gitlab_id: 17,
        },
        {
            firstname: 'Tomas',
            lastname: 'Mitana',
            redmine_id: 149,
            gitlab_id: 4,
        },
        {
            firstname: 'Peter',
            lastname: 'Topor',
            redmine_id: 193,
            gitlab_id: 6,
        },
        {
            firstname: 'Marek',
            lastname: 'Kundrat',
            redmine_id: 219,
            gitlab_id: 9,
        },
        {
            firstname: 'Milan',
            lastname: 'Donef',
            redmine_id: 229,
            gitlab_id: 11,
        },
    ];

    getMemberByRedmineId(id) {
        for (const member of this.members) {
            if (member.redmine_id === id) {
                return member;
            }
        }
    }

    getMemberByGitlabId(id) {
        for (const member of this.members) {
            if (member.gitlab_id === id) {
                return member;
            }
        }
    }

    @action
    setActiveMember(redmine_id) {
        this.active_member_redmine_id = redmine_id;
    }
}

/**
 * @type TeamStore
 */
let store;

/**
 * @returns {TeamStore}
 */
export const getStore = () => {
    if (!store) {
        store = new TeamStore();
    }

    return store;
};