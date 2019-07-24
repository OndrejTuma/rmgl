import Document, {Head, Main, NextScript} from 'next/document';

export default class MyDocument extends Document {
    render() {
        return (
            <html>
                <Head>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Hind"/>
                    <meta charSet="utf-8" key={'charset'}/>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" key={'viewport'}/>
                </Head>
                <body>
                    <Main/>
                    <NextScript/>
                </body>
            </html>
        )
    }
}