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
                    date_approve_start: format(new Date(startDate), 'yyyy-MM-dd HH:mm'),
                }),
                ...(endDate && {
                    date_approve_end: format(new Date(endDate), 'yyyy-MM-dd HH:mm'),
                }),
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        })
        .then((response) =>
            response.data.missions.map((tr: IMission) => ({
                ...tr,
                date_created: formatDate(new Date(tr.date_created)),
                date_approve: tr.date_approve
                    ? formatDate(new Date(tr.date_approve))
                    : null,
                date_end: tr.date_end
                    ? formatDate(new Date(tr.date_end))
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
                date_created: formatDate(new Date(response.data.mission.date_created)),
                date_approve: response.data.mission.date_approve
                    ? formatDate(new Date(response.data.mission.date_approve))
                    : null,
                date_end: response.data.mission.date_end
                    ? formatDate(new Date(response.data.mission.date_end))
                    : null,
            };

            return {
                ...response.data,
                mission: modifiedMission,
            };
        })
}