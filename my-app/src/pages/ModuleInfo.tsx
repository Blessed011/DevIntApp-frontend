import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BigRCard, IModuleProps } from '../components/ModuleCard';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import LoadAnimation from '../components/LoadAnimation';


const ModuleInfo: FC = () => {
    let { module_id } = useParams()
    const [module, setModule] = useState<IModuleProps>()
    const [loaded, setLoaded] = useState<boolean>(false)

    useEffect(() => {
        fetch(`/api/modules/${module_id}`)
            .then(response => {
                setLoaded(true)
                if (!response.ok) {
                    throw new Error(response.statusText)
                }
                return response.json() as Promise<IModuleProps>
            })
            .then(data => {
                setModule(data)
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    return (
        <>
        <Navbar>
                <Nav>
                <Link to="/modules" className="nav-link p-0 text-dark" data-bs-theme="dark">
                    Модули
                </Link>
                <Nav.Item className='mx-1'>{">"}</Nav.Item>
                <Nav.Item className="nav-link p-0 text-dark">
                    {`${module ? module.name : 'неизвестно'}`}
                </Nav.Item>
                </Nav>
            </Navbar>
            {loaded ? (
                 module ? (
                    <BigRCard {...module} />
                 ) : (
                     <h3 className='text-center'>Такого модуля не существует</h3>
                 )
             ) : (
                <LoadAnimation />
            )
            }
        </>
    )
}

export { ModuleInfo }