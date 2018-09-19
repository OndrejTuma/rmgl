import {Component} from 'react';
import Head from 'next/head';
import {Provider, inject} from 'mobx-react';
import {DragDropContextProvider} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import RedmineBoard from 'Components/RedmineBoard';
import GitlabBoard from 'Components/GitlabBoard';
import GenerateLogButton from 'Components/GenerateLogButton';
import NewIssueButton from 'Components/NewIssueButton';

import {getStore as getErrorsStore} from 'Data/state/errors';
import {getStore as getGeneralStore} from 'Data/state/general';
import {getStore as getGitlabStore} from 'Data/state/gitlab';
import {getStore as getRedmineStore} from 'Data/state/redmine';
import {getStore as getTeamStore} from 'Data/state/team';
import {getStore as getVisualStore} from 'Data/state/visual';

import {fetchIssues, fetchStatuses} from 'Data/api/redmine';
import {fetchMergeRequestsAssignedToMe, fetchMergeRequestsFrom} from 'Data/api/gitlab';

import {FETCHING} from 'Data/consts';

const errorsStore = getErrorsStore();
const gitlabStore = getGitlabStore();
const generalStore = getGeneralStore();
const redmineStore = getRedmineStore();
const teamStore = getTeamStore();
const visualStore = getVisualStore();

const stores = {
    errorsStore,
    generalStore,
    gitlabStore,
    redmineStore,
    teamStore,
    visualStore,
};

import 'Sass/global.scss';

@inject('generalStore', 'gitlabStore', 'redmineStore', 'teamStore')
class Index extends Component {

    fetchIssuesAndMergeRequests = async () => {
        const {generalStore, gitlabStore, redmineStore, teamStore: {active_member: {gitlab_id, redmine_id}}} = this.props;

        generalStore.setFetching(FETCHING.redmine);

        const issues = await fetchIssues(redmine_id);
        const my_merge_requests = await fetchMergeRequestsFrom(gitlab_id);
        const merge_requests_assigned_to_me = await fetchMergeRequestsAssignedToMe(gitlab_id);

        generalStore.deleteFetching(FETCHING.redmine);

        redmineStore.setIssues(issues.issues);

        gitlabStore.setMyMergeRequests(my_merge_requests);
        gitlabStore.setMergeRequestsAssignedToMe(merge_requests_assigned_to_me);
    };

    componentWillMount() {
        const {gitlabStore, issues, merge_requests_assigned_to_me, my_merge_requests, redmineStore, statuses} = this.props;

        redmineStore.setStatuses(statuses.issue_statuses);
        redmineStore.setIssues(issues.issues);

        gitlabStore.setMyMergeRequests(my_merge_requests);
        gitlabStore.setMergeRequestsAssignedToMe(merge_requests_assigned_to_me);
    }

    componentDidMount() {
        this.refreshInterval = setInterval(this.fetchIssuesAndMergeRequests, 60000);
    }

    componentWillUnmount() {
        clearInterval(this.refreshInterval);
    }

    render() {
        return (
            <div>
                <Head>
                    <title>RMGL | Homepage</title>
                </Head>

                <GitlabBoard/>
                <NewIssueButton/>
                <GenerateLogButton/>
                <RedmineBoard/>
            </div>
        )
    }

}

export default class extends Component {
    static async getInitialProps() {
        const {active_member: {gitlab_id, redmine_id}} = teamStore;

        const statuses = await fetchStatuses();
        const issues = await fetchIssues(redmine_id);
        const my_merge_requests = await fetchMergeRequestsFrom(gitlab_id);
        const merge_requests_assigned_to_me = await fetchMergeRequestsAssignedToMe(gitlab_id);

        return {
            issues,
            merge_requests_assigned_to_me,
            my_merge_requests,
            statuses,
        };
    }

    render() {
        return (
            <Provider {...stores}>
                <DragDropContextProvider backend={HTML5Backend}>
                    <Index {...this.props}/>
                </DragDropContextProvider>
            </Provider>
        )
    }
}