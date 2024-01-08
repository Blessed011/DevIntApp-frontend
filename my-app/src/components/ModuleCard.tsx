import { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom';
import {Card, ButtonGroup} from 'react-bootstrap';
import CardImage from './CardImage';
import { IModule } from '../models'


// const setPlaceholder = (event: any) => {
//     event.target.src = '/placeholder3.jpg';
// };

interface ModuleCardProps extends IModule {
    children: ReactNode;
}

const ModuleCard: FC<ModuleCardProps> = ({ children, uuid, name, image_url}) => (
    <Card className='w-100 mx-auto px-0 shadow-lg text-center' key={uuid}>
        <div className="ratio ratio-16x9 overflow-hidden">
            <CardImage url={image_url} className='rounded object-fit-cover' />
        </div>
        <Card.Body className='flex-grow-1'>
            <Card.Title>{name}</Card.Title>
        </Card.Body>
        <ButtonGroup vertical>
            <Link to={`/modules/${uuid}`} className="btn btn-outline-primary">Подробнее</Link>
            <>{children}</>
        </ButtonGroup>
    </Card>
)

export default ModuleCard;