import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from 'react-router-dom';
import { Navbar, Form, Button, Table, InputGroup, ButtonGroup } from 'react-bootstrap';

import { getMissions } from '../api/Missions';
import { IMission } from "../models";
import { axiosAPI } from '../api'

import { AppDispatch, RootState } from "../store";
import { setUser, setStatus, setDateStart, setDateEnd } from "../store/searchSlice";
import { clearHistory, addToHistory } from "../store/historySlice";

import LoadAnimation from '../components/LoadAnimation';
import { MODERATOR } from '../components/AuthCheck'
import DateTimePicker from '../components/DatePicker';

const AllMissions = () => {
    const [missions, setMissions] = useState<IMission[]>([])
    const userFilter = useSelector((state: RootState) => state.search.user);
    const missionStatusFilter = useSelector((state: RootState) => state.search.status);
    const startDate = useSelector((state: RootState) => state.search.formationDateStart);
    const endDate = useSelector((state: RootState) => state.search.formationDateEnd);
    const role = useSelector((state: RootState) => state.user.role);
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;
    const [loaded, setLoaded] = useState(false)

    console.log(startDate)

    const getData = () => {
        getMissions(userFilter, missionStatusFilter, startDate, endDate)
            .then((data) => {
                setLoaded(true);
                setMissions(data)
            })
    };

    const handleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
    }

    useEffect(() => {
        dispatch(clearHistory())
        dispatch(addToHistory({ path: location, name: "Миссии" }))
        getData()
        const intervalId = setInterval(() => {
            getData();
        }, 2000);
        return () => clearInterval(intervalId);
    }, [dispatch, userFilter, missionStatusFilter, startDate, endDate]);

    const moderator_confirm = (id: string, confirm: boolean) => () => {
        const accessToken = localStorage.getItem('access_token');
        axiosAPI.put(`/missions/${id}/moderator_confirm`,
            { confirm: confirm },
            { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(() => setMissions(prevMissions => [...prevMissions]))
    }


    return (
        <>
            <Navbar>
                <Form className="d-flex flex-row align-items-stretch flex-grow-1 gap-2" onSubmit={handleSearch}>
                    {role == MODERATOR && <InputGroup size='sm' className='shadow-sm'>
                        <InputGroup.Text>Пользователь</InputGroup.Text>
                        <Form.Control value={userFilter} onChange={(e) => dispatch(setUser(e.target.value))} />
                    </InputGroup>}
                    <InputGroup size='sm' className='shadow-sm'>
                        <InputGroup.Text >Статус</InputGroup.Text>
                        <Form.Select
                            defaultValue={missionStatusFilter}
                            onChange={(status) => dispatch(setStatus(status.target.value))}
                        >
                            <option value="">Любой</option>
                            <option value="сформирована">Сформирована</option>
                            <option value="завершена">Завершена</option>
                            <option value="отклонена">Отклонена</option>
                        </Form.Select>
                    </InputGroup>
                    <DateTimePicker
                        selected={startDate ? new Date(startDate) : null}
                        onChange={(date: Date) => dispatch(setDateStart(date ? date.toISOString() : null))}
                    />
                    <DateTimePicker
                        selected={endDate ? new Date(endDate) : null}
                        onChange={(date: Date) => dispatch(setDateEnd(date ? date.toISOString() : null))}
                    />
                    {/* <Button
                        variant="primary"
                        size="sm"
                        type="submit"
                        className="shadow-lg">
                        Поиск
                    </Button> */}
                </Form>
            </Navbar>
            < LoadAnimation loaded={loaded}>
                <Table bordered hover>
                    <thead>
                        <tr>
                            {role == MODERATOR && <th className='text-center'>Создатель</th>}
                            <th className='text-center'>Статус</th>
                            <th className='text-center'>Статус финанс-я</th>
                            <th className='text-center'>Дата создания</th>
                            <th className='text-center'>Дата формирования</th>
                            <th className='text-center'>Дата завершения</th>
                            <th className='text-center'>Название</th>
                            <th className='text-center'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {missions.map((mission) => (
                            <tr key={mission.uuid}>
                                {role == MODERATOR && <td className='text-center'>{mission.customer}</td>}
                                <td className='text-center'>{mission.status}</td>
                                <td className='text-center'>{mission.funding_status}</td>
                                <td className='text-center'>{mission.creation_date}</td>
                                <td className='text-center'>{mission.formation_date}</td>
                                <td className='text-center'>{mission.completion_date}</td>
                                <td className='text-center'>{mission.name}</td>
                                <td className='p-0 text-center align-middle'>
                                    <Table className='m-0'>
                                        <tbody>
                                            <tr>
                                                <td className='py-1 border-0' style={{ background: 'transparent' }}>
                                                    <Link to={`/missions/${mission.uuid}`}
                                                        className='btn btn-sm btn-outline-secondary text-decoration-none w-100' >
                                                        Подробнее
                                                    </Link>
                                                </td>
                                            </tr>
                                            {mission.status == 'сформирована' && role == MODERATOR && <tr>
                                                <td className='py-1 border-0' style={{ background: 'transparent' }}>
                                                    <ButtonGroup className='flex-grow-1 w-100'>
                                                        <Button variant='outline-success' size='sm' onClick={moderator_confirm(mission.uuid, true)}>Подтвердить</Button>
                                                        <Button variant='outline-danger' size='sm' onClick={moderator_confirm(mission.uuid, false)}>Отклонить</Button>
                                                    </ButtonGroup>
                                                </td>
                                            </tr>}
                                        </tbody>
                                    </Table>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </LoadAnimation >
        </>
    )
}

export default AllMissions