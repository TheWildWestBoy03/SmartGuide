import { Routes } from '@angular/router';
import { RecommendationsList } from './recommendations-list/recommendations-list';
import { SignInPage } from './sign-in-page/sign-in-page';
import { LoginPage } from './login-page/login-page';
import { ItinerariesPage } from './itineraries-page/itineraries-page';
import { HomePage } from './home-page/home-page';
import { OptionsPage } from './options-page/options-page';

export const routes: Routes = [
    {
        path: 'home',
        component: HomePage,
        title: 'Home'
    }, {
        path: 'recommendations',
        component: RecommendationsList,
        title: 'Recommendations'
    }, {
        path: 'sign-in',
        component: SignInPage,
        title: 'Sign In'
    }, {
        path: 'login',
        component: LoginPage,
        title: 'Log in'
    }, {
        path: 'itineraries',
        component: ItinerariesPage,
        title: 'Itineraries'
    }, {
        path: 'options',
        component: OptionsPage,
        title: 'Options'
    }
];