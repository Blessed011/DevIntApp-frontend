import { FC } from 'react'
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import CardImage from './CardImage';

export interface IModuleProps {
    uuid: string
    name: string
    description: string
    mass: string
    length: string
    diameter: string
    image_url: string
}

export const SmallCCard: FC<IModuleProps> = ({ uuid, name, image_url }) => (

    <Card className='w-100 mx-auto px-0 shadow text-center' key={uuid}>
        <div className="ratio ratio-16x9 overflow-hidden">
            <CardImage url={image_url} className='rounded object-fit-cover'/>
            {/* <Card.Img src={`http://${image_url}`} alt='картинка модуля' onError={setPlaceholder} className='rounded object-fit-cover' /> */}
        </div>
        <Card.Body className='flex-grow-1'>
            <Card.Title>{name}</Card.Title>
        </Card.Body>
        <Link to={`/modules/${uuid}`} className="btn btn-outline-primary">Подробнее</Link>
    </Card>
)

export const BigCCard: FC<IModuleProps> = ({ name, description, mass, length, diameter, image_url }) => (
    <Card className='shadow text-center text-md-start'>
        <div className='row'>
            <div className='col-12 col-md-8 overflow-hidden'>
                {/* <Card.Img src={`http://${image_url}`} onError={setPlaceholder}/> */}
                <CardImage url={image_url}/>
            </div>
            <Card.Body className='col-12 col-md-4 ps-md-0'>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <Card.Title>{name}</Card.Title>
                        <Card.Text>Описание: {description}</Card.Text>
                        <Card.Text>Масса: {mass} </Card.Text>
                        <Card.Text>Длина: {length} </Card.Text>
                        <Card.Text>Диаметр: {diameter} </Card.Text>
                    </ListGroup.Item>
                </ListGroup>
            </Card.Body>
        </div>
    </Card>
);