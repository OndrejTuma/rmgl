import {action, observable} from 'mobx';

import {CURRENT_MEMBER_REDMINE_ID} from '../consts';

class TeamStore {
    @observable
    active_member = {};

    constructor() {
        const active_member = this.getMemberByRedmineId(CURRENT_MEMBER_REDMINE_ID);

        this.setActiveMember(active_member);
    }

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
            firstname: 'Vlad',
            lastname: 'Opaets',
            redmine_id: 294,
            gitlab_id: 27,
        },
        {
            firstname: 'Katarzyna',
            lastname: 'Gorska',
            redmine_id: 371,
            gitlab_id: 0,
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
    setActiveMember(member) {
        this.active_member = member;
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