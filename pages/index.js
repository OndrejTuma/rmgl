import {Component} from 'react';
import Head from 'next/head';
import Router from 'next/router';
import {Provider} from 'mobx-react';

import Login from 'Components/Login';

import {getStore as getAuthStore} from 'Data/state/auth';
import {getStore as getErrorsStore} from 'Data/state/errors';
import {getUser} from 'Data/api';

const authStore = getAuthStore();
const errorsStore = getErrorsStore();

const stores = {
    authStore,
    errorsStore,
};

export default class Index extends Component {
    static async getInitialProps({ req, res }) {
        const user = await getUser(req);

        if (user) {
            if (res) {
                res.writeHead(302, {
                    Location: '/events'
                });
                res.end();
                res.finished = true;
            }
            else {
                Router.push('/events');
            }
        }

        return {};
    }

    render() {
        return (
            <Provider {...stores}>
                <div>
                    <Head>
                        <title>Eventio | Homepage</title>
                    </Head>
                    <Login/>
                </div>
            </Provider>
        )
    }
}