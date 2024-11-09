import {
    CallControls,
    CallingState,
    SpeakerLayout,
    StreamCall,
    StreamTheme,
    StreamVideo,
    StreamVideoClient,
    useCallStateHooks,
} from '@stream-io/video-react-sdk';

import Global from '@/Utils/Global';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './meeting.css';

const apiKey = 'db7pgv2zjwk4';
const userId = 'Asajj_Ventress';

const user = {
    id: userId,
    name: 'Oliver',
    image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
};

export default function Meeting() {
    const [client, setClient] = useState(null);
    const [call, setCall] = useState(null);
    const { meetingId } = useParams();

    useEffect(() => {
        (async () => {
            const { data } = await Global.httpPost('/appointment/getToken', {
                userId
            });
            console.log(data);
            const client = new StreamVideoClient({ apiKey, user, token: data.token });
            setClient(client);
            const call = client.call('default', meetingId);
            call.join({ create: true });
            setCall(call);
        })()
    }, [])
    return (
        client && call &&
        <StreamVideo client={client}>
            <StreamCall call={call}>
                <MyUILayout />
            </StreamCall>
        </StreamVideo>
    );
}

export const MyUILayout = () => {
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();

    if (callingState !== CallingState.JOINED) {
        return <div>Loading...</div>;
    }

    return (
        <StreamTheme>
            <SpeakerLayout participantsBarPosition='bottom' />
            <CallControls />
        </StreamTheme>
    );
};