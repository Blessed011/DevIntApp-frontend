import { FC } from 'react'
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

export interface IModuleProps {
    uuid: string
    name: string
    description: string
    mass: string
    length: string
    diameter: string
    image_url: string
}

export const SmallRCard: FC<IModuleProps> = ({uuid, name, image_url}) => (
    <Card className='card text-center'>
            <Card.Img variant='top' src={`http://${image_url}`} className='rounded object-fit-cover' />
        <Card.Body className='flex-grow-1'>
            <Card.Title>{name}</Card.Title>
        </Card.Body>
        <Link to={`/modules/${uuid}`} className="btn btn-primary">Подробнее</Link>
    </Card>
)

export const BigRCard: FC<IModuleProps> = ({name, description, mass, length, diameter, image_url}) => {
    return (
        <Card className='mx-auto shadow w-50 p-3 text-center text-md-start' >
             <div className='row'>
                <div className='col-12 col-md-8 px-md-0 overflow-hidden'>
                    <Card.Img src={`http://${image_url}`} />
                </div>
                <Card.Body className='col-12 col-md-4 ps-md-0'>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <Card.Title>{name}</Card.Title>
                            <Card.Text>Описание: {description}</Card.Text>
                            <Card.Text>Масса: {mass}</Card.Text>
                            <Card.Text>Длина: {length}</Card.Text>
                            <Card.Text>Диаметр: {diameter}</Card.Text>
                        </ListGroup.Item>
                    </ListGroup>
                    </Card.Body>
            </div>
        </Card>
    );
};