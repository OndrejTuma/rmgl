import {Component} from 'react';
import Head from 'next/head';
import {Provider, inject} from 'mobx-react';
import {DragDropContextProvider} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Board from 'Components/Board';

import {getStore as getBoardStore} from 'Data/state/board';
import {getStore as getErrorsStore} from 'Data/state/errors';
import {getStore as getGeneralStore} from 'Data/state/general';
import {getStore as getTeamStore} from 'Data/state/team';
import {getStore as getVisualStore} from 'Data/state/visual';

import {fetchIssues, fetchStatuses} from 'Data/api/redmine';

const boardStore = getBoardStore();
const errorsStore = getErrorsStore();
const generalStore = getGeneralStore();
const teamStore = getTeamStore();
const visualStore = getVisualStore();

const stores = {
    boardStore,
    errorsStore,
    generalStore,
    teamStore,
    visualStore,
};

@inject('boardStore')
class Index extends Component {
    componentWillMount() {
        const {boardStore, issues, statuses} = this.props;

        boardStore.setStatuses(statuses.issue_statuses);
        boardStore.setIssues(issues.issues);
    }

    render() {
        return (
            <div>
                <Head>
                    <title>RMGL | Homepage</title>
                </Head>

                <Board/>
            </div>
        )
    }

}

export default class extends Component {
    static async getInitialProps() {
        const statuses = await fetchStatuses();
        const issues = await fetchIssues(teamStore.active_member_redmine_id);

        return {
            issues,
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