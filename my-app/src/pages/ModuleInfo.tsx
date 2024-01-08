import { FC, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { Card, Row, Navbar, ListGroup } from 'react-bootstrap';

import { getModule } from '../api'
import { IModule } from '../models';

import { AppDispatch } from "../store";
import { addToHistory } from "../store/historySlice"

import LoadAnimation from '../components/LoadAnimation';
import CardImage from '../components/CardImage';
import Breadcrumbs from '../components/Breadcrumbs';

const ModuleInfo: FC = () => {
    let { module_id } = useParams()
    const [module, setModule] = useState<IModule | undefined>(undefined)
    const [loaded, setLoaded] = useState<boolean>(false)
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;

    console.log()

    useEffect(() => {
        getModule(module_id)
            .then(data => {
                setModule(data);
                dispatch(addToHistory({ path: location, name: data ? data.name : "неизвестно" }));
                setLoaded(true);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, [dispatch]);

    return (
        <LoadAnimation loaded={loaded}>
            {module ? (
                <>
                    <Navbar>
                        <Breadcrumbs />
                    </Navbar>
                    <Card className='shadow-lg text-center text-md-start'>
                        <Row>
                            <div className='col-12 col-md-8 overflow-hidden'>
                                <CardImage url={module.image_url} />
                            </div>
                            <Card.Body className='col-12 col-md-4 ps-md-0'>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <Card.Title>{module.name}</Card.Title>
                                        <Card.Text>Описание: {module.description}</Card.Text>
                                        <Card.Text>Масса: {module.mass}</Card.Text>
                                        <Card.Text>Длина: {module.length}</Card.Text>
                                        <Card.Text>Диаметр: {module.diameter}</Card.Text>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Row>
                    </Card>
                </ >
            ) : (
                <h3 className='text-center'>Такого модуля не существует</h3>
            )}
        </LoadAnimation>
    )

}

export default ModuleInfo