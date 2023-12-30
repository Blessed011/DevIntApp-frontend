import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Card, Row, Col, Navbar, Nav, InputGroup, Form, Button, ButtonGroup } from 'react-bootstrap';

import { axiosAPI } from "../api";
import { getMission } from '../api/Missions';
import { IModule, IMission } from "../models";

import { AppDispatch } from "../store";
import { addToHistory } from "../store/historySlice";

import LoadAnimation from '../components/LoadAnimation';
import { SmallCCard } from '../components/ModuleCard';
import Breadcrumbs from '../components/Breadcrumbs';

//????????????????????????????????????????????????????????????????????????????
const MissionInfo = () => {
    let { mission_id } = useParams()
    const [mission, setMission] = useState<IMission | null>(null)
    const [flight, setFlight] = useState<IModule[] | null>([])
    const [loaded, setLoaded] = useState(false)
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;
    const [edit, setEdit] = useState(false)
    const [startMission, setStartMission] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const navigate = useNavigate()

    const getData = () => {
        setLoaded(false)
        getMission(mission_id)
            .then(data => {
                if (data === null) {
                    setMission(null)
                    setFlight([])
                } else {
                    setMission(data.mission);
                    setStartMission(data.mission.date_start_mission ? data.mission.date_start_mission : '')
                    setFlight(data.modules);
                    setDescription(data.mission.description ? data.mission.description : '')

                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
        setLoaded(true)
    }

    const update = () => {
        let accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        axiosAPI.put(`/missions`,
            { startMission: startMission },
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
        getData()
        dispatch(addToHistory({ path: location, name: "Миссия" }))
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

    const deleteT = () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        axiosAPI.delete('/missions', { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(_ => {
                navigate('/modules')
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    return loaded ? (
        mission ? (
            <>
                <Navbar>
                    <Nav>
                        <Breadcrumbs />
                    </Nav>
                </Navbar>
                <Col className='p-3'>
                    <Card className='shadow text center text-md-start'>
                        <Card.Body>
                            <InputGroup className='mb-1'>
                                <InputGroup.Text>Статус</InputGroup.Text>
                                <Form.Control readOnly value={mission.status} />
                            </InputGroup>
                            <InputGroup className='mb-1'>
                                <InputGroup.Text>Создана</InputGroup.Text>
                                <Form.Control readOnly value={mission.date_created} />
                            </InputGroup>
                            <InputGroup className='mb-1'>
                                <InputGroup.Text>Сформирована</InputGroup.Text>
                                <Form.Control readOnly value={mission.date_approve ? mission.date_approve : ''} />
                            </InputGroup>
                            <InputGroup className='mb-1'>
                                <InputGroup.Text>{mission.status === 'отклонена' ? 'Отклонена' : 'Подтверждена'}</InputGroup.Text>
                                <Form.Control readOnly value={mission.date_end ? mission.date_end : ''} />
                            </InputGroup>
                            <InputGroup className='mb-1'>
                                <InputGroup.Text>Название</InputGroup.Text>
                                <Form.Control
                                    readOnly={!edit}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                {!edit && mission.status === 'черновик' && <Button onClick={() => setEdit(true)}>Изменить</Button>}
                                {edit && <Button variant='success' onClick={update}>Сохранить</Button>}
                                {edit && <Button
                                    variant='danger'
                                    onClick={() => {
                                        setDescription(mission.description ? mission.description : '');
                                        setEdit(false)
                                    }}>
                                    Отменить
                                </Button>}
                            </InputGroup>
                            {mission.status != 'черновик' &&
                                <InputGroup className='mb-1'>
                                    <InputGroup.Text>Статус финансирования</InputGroup.Text>
                                    <Form.Control readOnly value={mission.funding_status ? mission.funding_status : ''} />
                                </InputGroup>}
                            {mission.status == 'черновик' &&
                                <ButtonGroup className='flex-grow-1 w-100'>
                                    <Button variant='success' onClick={confirm}>Сформировать</Button>
                                    <Button variant='danger' onClick={deleteT}>Удалить</Button>
                                </ButtonGroup>}
                        </Card.Body>
                    </Card>
                    {flight && <Row className='row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 px-1 mt-2'>
                        {flight.map((module) => (
                            <div className='d-flex p-2 justify-content-center' key={module.uuid}>
                                <SmallCCard  {...module}>
                                    {mission.status == 'черновик' &&
                                        <Button
                                            variant='outline-danger'
                                            className='mt-0 rounded-bottom'
                                            onClick={delFromMission(module.uuid)}>
                                            Удалить
                                        </Button>}
                                </SmallCCard>
                            </div>
                        ))}
                    </Row>}
                </Col>
            </>
        ) : (
            <h4 className='text-center'>Такой миссии не существует</h4>
        )
    ) : (
        <LoadAnimation />
    )
}

export default MissionInfo