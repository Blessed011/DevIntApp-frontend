import { FC, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch } from "react-redux";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import { getModule } from '../api'
import { IModule } from '../models';

import { AppDispatch } from "../store";
import { addToHistory } from "../store/historySlice"

import LoadAnimation from '../components/LoadAnimation';
import { BigCCard } from '../components/ModuleCard';
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

    return loaded ? (
        module ? (
            <>
                <Navbar>
                    <Nav>
                        <Breadcrumbs />
                    </Nav>
                </Navbar>
                <BigCCard {...module} />
            </ >
        ) : (
            <h3 className='text-center'>Такого модуля не существует</h3>
        )
    ) : (
        <LoadAnimation children={undefined} loaded={true} />
    )
}

export default ModuleInfo