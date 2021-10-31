import Main from '../Components/Main';
import Limbo from '../Components/Limbo/Index';
import Dice from '../Components/Dice/Index';
import Crash from '../Components/Crash/Index';
import { GiCrackedBallDunk } from 'react-icons/gi';
import { GiAmplitude } from 'react-icons/gi';
import { GiDiceSixFacesSix } from 'react-icons/gi';

const Routes = [
    {
        path: '/',
        component: Main,
        name: 'Home',
        childRoutes: [
            {
                path: '/limbo',
                component: Limbo,
                name: 'Limbo',
                icon: GiAmplitude
            },
            {
                path: '/dice',
                component: Dice,
                name: 'Dice',
                icon: GiDiceSixFacesSix
            },
            {
                path: '/crash',
                component: Crash,
                name: 'Crash',
                icon: GiCrackedBallDunk
            }
        ]
    }
]

export default Routes;