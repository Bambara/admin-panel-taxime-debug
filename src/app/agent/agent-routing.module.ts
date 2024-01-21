import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AgentListComponent} from './agent-list/agent-list.component';
import {AgentRegistrationComponent} from './agent-registration/agent-registration.component';
import {AgentProfileComponent} from './agent-profile/agent-profile.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'agent-list',
                component: AgentListComponent,
                data: {
                    title: 'Agent List',
                    urls: [
                        {title: 'Agents'},
                        {title: 'Agent List', url: '/agent/agent-list'}
                    ]
                }
            },
            {
                path: 'agent-registration',
                component: AgentRegistrationComponent,
                data: {
                    title: 'Agent Registration',
                    urls: [
                        {title: 'Agents'},
                        {title: 'Agent Registration', url: '/agent/agent-registration'}
                    ]
                }
            },
            {
                path: 'profile-agent/:id',
                component: AgentProfileComponent,
                data: {
                    title: 'Agent Profile',
                    urls: [
                        {title: 'Agents'},
                        {title: 'Agent Profile', url: '/agent/profile-agent/:id'}
                    ]
                }
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AgentRoutingModule {
}
