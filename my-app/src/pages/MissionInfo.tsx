import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Card, Row, Col, Navbar, InputGroup, Form, Button, ButtonGroup } from 'react-bootstrap';

import { axiosAPI } from "../api";
import { getMission } from '../api/Missions';
import { IModule, IMission } from "../models";

import { AppDispatch, RootState } from "../store";
import { addToHistory } from "../store/historySlice";

import LoadAnimation from '../components/LoadAnimation';
import ModuleCard from '../components/ModuleCard';
import Breadcrumbs from '../components/Breadcrumbs';
import { MODERATOR } from '../components/AuthCheck';

const MissionInfo = () => {
    let { mission_id } = useParams()
    const [mission, setMission] = useState<IMission | null>(null)
    const [flight, setFlight] = useState<IModule[] | null>([])
    const [loaded, setLoaded] = useState(false)
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;
    const role = useSelector((state: RootState) => state.user.role);
    const [edit, setEdit] = useState(false)
    const [name, setName] = useState<string>('')
    const navigate = useNavigate()

    const getData = () => {
        getMission(mission_id)
            .then(data => {
                if (data === null) {
                    setMission(null)
                    setFlight([])
                } else {
                    setMission(data.mission);
                    setName(data.mission.name ? data.mission.name : '');
                    setFlight(data.modules)

                }
            })
    }

    const update = () => {
        let accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        axiosAPI.put(`/missions`,
            { name: name },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                }
            })
            .then(() => getData())
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
        setEdit(false);
    }

    useEffect(() => {
        dispatch(addToHistory({ path: location, name: "Миссия" }))
        getData()
        setLoaded(true)
    }, [dispatch]);

    const delFromMission = (id: string) => () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        axiosAPI.delete(`/missions/delete_module/${id}`, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(() => getData())
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    const confirm = () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        axiosAPI.put('/missions/user_confirm', null, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(_ => {
                getData()
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    const deleteM = () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        axiosAPI.delete('/missions', { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(_ => {
                navigate('/modules')
            })
    }

    const moderator_confirm = (confirm: boolean) => () => {
        const accessToken = localStorage.getItem('access_token');
        axiosAPI.put(`/missions/${mission?.uuid}/moderator_confirm`,
            { confirm: confirm },
            { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(() => getData())
    }

    return (
        <LoadAnimation loaded={loaded}>
            {mission ? (
                <>
                    <Navbar>
                            <Breadcrumbs />
                    </Navbar>
                    <Col className='p-3 pt-1'>
                        <Card className='shadow text center text-md-start'>
                            <Card.Body>
                                <InputGroup className='mb-1'>
                                    <InputGroup.Text className='t-input-group-text'>Статус</InputGroup.Text>
                                    <Form.Control readOnly value={mission.status} />
                                </InputGroup>
                                <InputGroup className='mb-1'>
                                    <InputGroup.Text className='t-input-group-text'>Создана</InputGroup.Text>
                                    <Form.Control readOnly value={mission.creation_date} />
                                </InputGroup>
                                <InputGroup className='mb-1'>
                                    <InputGroup.Text className='t-input-group-text'>Сформирована</InputGroup.Text>
                                    <Form.Control readOnly value={mission.formation_date ? mission.formation_date : ''} />
                                </InputGroup>
                                {(mission.status == 'отклонена' || mission.status == 'завершена') && <InputGroup className='mb-1'>
                                    <InputGroup.Text className='t-input-group-text'>{mission.status === 'отклонена' ? 'Отклонена' : 'Завершена'}</InputGroup.Text>
                                    <Form.Control readOnly value={mission.completion_date ? mission.completion_date : ''} />
                                </InputGroup>}
                                <InputGroup className='mb-1'>
                                    <InputGroup.Text className='t-input-group-text'>Название</InputGroup.Text>
                                    <Form.Control
                                        readOnly={!edit}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    {!edit && mission.status === 'черновик' && <Button onClick={() => setEdit(true)}>Изменить</Button>}
                                    {edit && <Button variant='success' onClick={update}>Сохранить</Button>}
                                    {edit && <Button
                                        variant='danger'
                                        onClick={() => {
                                            setName(mission.name ? mission.name : '');
                                            setEdit(false)
                                        }}>
                                        Отменить
                                    </Button>}
                                </InputGroup>
                                {mission.status != 'черновик' &&
                                    <InputGroup className='mb-1'>
                                        <InputGroup.Text className='t-input-group-text'>Статус финанс-я</InputGroup.Text>
                                        <Form.Control readOnly value={mission.funding_status ? mission.funding_status : ''} />
                                    </InputGroup>
                                }
                                {mission.status == 'сформирована' && role == MODERATOR &&
                                    <ButtonGroup className='flex-grow-1 w-100'>
                                        <Button variant='success' onClick={moderator_confirm(true)}>Подтвердить</Button>
                                        <Button variant='danger' onClick={moderator_confirm(false)}>Отменить</Button>
                                    </ButtonGroup>
                                }
                                {mission.status == 'черновик' &&
                                    <ButtonGroup className='flex-grow-1 w-100'>
                                        <Button variant='success' onClick={confirm}>Сформировать</Button>
                                        <Button variant='danger' onClick={deleteM}>Удалить</Button>
                                    </ButtonGroup>}
                            </Card.Body>
                        </Card>
                        {flight && <Row className='row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 px-1 mt-2'>
                            {flight.map((module) => (
                                <div className='d-flex p-2 justify-content-center' key={module.uuid}>
                                    <ModuleCard  {...module}>
                                        {mission.status == 'черновик' &&
                                            <Button
                                                variant='outline-danger'
                                                className='mt-0 rounded-bottom'
                                                onClick={delFromMission(module.uuid)}>
                                                Удалить
                                            </Button>}
                                    </ModuleCard>
                                </div>
                            ))}
                        </Row>}
                    </Col>
                </>
            ) : (
                <h4 className='text-center'>Такой миссии не существует</h4>
            )}
        </LoadAnimation>
    )
}

export default MissionInfo