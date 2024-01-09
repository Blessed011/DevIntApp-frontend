import { FC, useEffect, useState, ChangeEvent, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { Card, Row, Navbar, FloatingLabel, InputGroup, Form, Col, Button, ButtonGroup } from 'react-bootstrap';

import { axiosAPI, getModule } from '../api'
import { IModule } from '../models';

import { AppDispatch } from "../store";
import { addToHistory } from "../store/historySlice"

import LoadAnimation from '../components/LoadAnimation';
import CardImage from '../components/CardImage';
import Breadcrumbs from '../components/Breadcrumbs';

const ModuleInfo: FC = () => {
    let { module_id } = useParams()
    const [module, setModule] = useState<IModule | undefined>(undefined)
    const [loaded, setLoaded] = useState<Boolean>(false)
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;
    const [edit, setEdit] = useState<boolean>(false)
    const [image, setImage] = useState<File | undefined>(undefined);
    const inputFile = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate()

    useEffect(() => {
        const getData = async () => {
            setLoaded(false);
            let data: IModule | undefined;
            let name: string;
            try {
                if (module_id == 'new') {
                    data = {
                        uuid: "",
                        name: "",
                        description: "",
                        mass: "",
                        length: "",
                        diameter: "",
                        image_url: "",
                    }
                    name = 'Новый модуль'
                    setEdit(true)
                } else {
                    data = await getModule(module_id);
                    name = data ? data.name : ''
                }
                setModule(data);
                dispatch(addToHistory({ path: location, name: name }));
            } finally {
                setLoaded(true);
            }
        }

        getData();

    }, [dispatch]);

    const changeString = (e: ChangeEvent<HTMLInputElement>) => {
        setModule(module ? { ...module, [e.target.id]: e.target.value } : undefined)
    }

    const deleteModule = () => {
        let accessToken = localStorage.getItem('access_token');
        axiosAPI.delete(`/modules/${module_id}`, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(() => navigate('/modules-edit'))
    }

    const save = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formElement = event.currentTarget;
        if (!formElement.checkValidity()) {
            return
        }
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        setEdit(false);

        const formData = new FormData();
        if (module) {
            Object.keys(module).forEach(key => {
                if ((module as any)[key]) {
                    formData.append(key, (module as any)[key])
                }
            });
        }
        if (image) {
            formData.append('image', image);
        }

        if (module_id == 'new') {
            axiosAPI.post(`/modules`, formData, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
                .then((response) => getModule(response.data).then((data) => setModule(data)))
        } else {
            axiosAPI.put(`/modules/${module?.uuid}`, formData, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
                .then(() => getModule(module_id).then((data) => setModule(data)))
        }
    }

    const cancel = () => {
        setEdit(false)
        setImage(undefined)
        if (inputFile.current) {
            inputFile.current.value = ''
        }
        getModule(module_id)
            .then((data) => setModule(data))
    }

    return (
        <LoadAnimation loaded={loaded}>
            {module ? (
                <>
                    <Navbar>
                        <Breadcrumbs />
                    </Navbar>
                    <Card className='shadow-lg mb-3'>
                        <Row className='m-0'>
                            <Col className='col-12 col-md-8 overflow-hidden p-0'>
                                <CardImage url={module.image_url} />
                            </Col>
                            <Col className='d-flex flex-column col-12 col-md-4 p-0'>
                                <Form noValidate validated={edit} onSubmit={save}>
                                    <Card.Body className='flex-grow-1'>
                                        <InputGroup hasValidation className='mb-1'>
                                            <InputGroup.Text className='c-input-group-text'>Название</InputGroup.Text>
                                            <Form.Control id='name' required type='text' value={module.name} readOnly={!edit} onChange={changeString} />
                                        </InputGroup>
                                        <FloatingLabel
                                            label="Описание"
                                            className="mb-3">
                                            <Form.Control
                                                id='description'
                                                value={module.description}
                                                as="textarea"
                                                className='h-25'
                                                readOnly={!edit}
                                                required
                                                onChange={changeString} />
                                        </FloatingLabel>
                                        <InputGroup className='mb-1'>
                                            <InputGroup.Text className='c-input-group-text'>Масса</InputGroup.Text>
                                            <Form.Control id='mass' required value={module.mass} readOnly={!edit} onChange={changeString} />
                                        </InputGroup>
                                        <InputGroup className='mb-1'>
                                            <InputGroup.Text className='c-input-group-text'>Длина</InputGroup.Text>
                                            <Form.Control id='length' required value={module.length} readOnly={!edit} onChange={changeString} />
                                        </InputGroup>
                                        <InputGroup className='mb-1'>
                                            <InputGroup.Text className='c-input-group-text'>Диаметр</InputGroup.Text>
                                            <Form.Control id='diameter' required value={module.diameter} readOnly={!edit} onChange={changeString} />
                                        </InputGroup>
                                        <Form.Group className="mb-1">
                                            <Form.Label>Выберите изображение</Form.Label>
                                            <Form.Control
                                                disabled={!edit}
                                                type="file"
                                                accept='image/*'
                                                ref={inputFile}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => setImage(e.target.files?.[0])} />
                                        </Form.Group>
                                    </Card.Body>
                                    {edit ? (
                                        <ButtonGroup className='w-100'>
                                            <Button variant='success' type='submit'>Сохранить</Button>
                                            {module_id != 'new' && <Button variant='danger' onClick={cancel}>Отменить</Button>}
                                        </ButtonGroup>
                                    ) : (
                                        <>
                                            <Button
                                                onClick={() => setEdit(true)}>
                                                Изменить
                                            </Button>
                                            <Button variant='danger' onClick={deleteModule}>Удалить</Button>
                                        </>
                                    )}
                                </Form>
                            </Col>
                        </Row>
                    </Card>
                </ >
            ) : (
                <h3 className='text-center'>Такого модуля не существует</h3>
            )}
        </LoadAnimation >
    )
}

export default ModuleInfo