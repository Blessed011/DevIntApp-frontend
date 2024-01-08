import { format } from 'date-fns';

import { axiosAPI } from ".";
import { IModule, IMission } from "../models";

interface MissionsResponse {
    missions: IMission[]
}

function formatDate(date: Date | null): string {
    if (!date) {
        return ""
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes} ${day}.${month}.${year}`;
}

export async function getMissions(
    user: string,
    status: string,
    startDate: string | null,
    endDate: string | null
): Promise<IMission[]> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        return [];
    }
    return axiosAPI
        .get<MissionsResponse>('/missions', {
            params: {
                ...(status && { status: status }),
                ...(startDate && {
                    formation_date_start: format(new Date(startDate), 'yyyy-MM-dd HH:mm'),
                }),
                ...(endDate && {
                    formation_date_end: format(new Date(endDate), 'yyyy-MM-dd HH:mm'),
                }),
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        })
        .then((response) => response.data.missions
            .filter((tr: IMission) => tr.customer.toLowerCase().includes(user.toLowerCase()))
            .map((tr: IMission) => ({
                ...tr,
                creation_date: formatDate(new Date(tr.creation_date)),
                formation_date: tr.formation_date
                    ? formatDate(new Date(tr.formation_date))
                    : null,
                completion_date: tr.completion_date
                    ? formatDate(new Date(tr.completion_date))
                    : null,
            }))
        );
}

interface MissionResponse {
    modules: IModule[]
    mission: IMission
}

export async function getMission(id: string | undefined): Promise<MissionResponse | null> {
    if (id === undefined) { return null; }
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        return null;
    }

    return axiosAPI.get<MissionResponse>(`/missions/${id}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            const modifiedMission: IMission = {
                ...response.data.mission,
                creation_date: formatDate(new Date(response.data.mission.creation_date)),
                formation_date: response.data.mission.formation_date
                    ? formatDate(new Date(response.data.mission.formation_date))
                    : null,
                completion_date: response.data.mission.completion_date
                    ? formatDate(new Date(response.data.mission.completion_date))
                    : null,
            };

            return {
                ...response.data,
                mission: modifiedMission,
            };
        })
}