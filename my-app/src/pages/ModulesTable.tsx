import { useEffect, useState } from 'react';
import { Navbar, Form, Button, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from 'react-router-dom';

import { getAllModules, axiosAPI } from '../api'
import { IModule } from '../models'

import { AppDispatch, RootState } from "../store";
import { setName } from "../store/searchSlice"
import { clearHistory, addToHistory } from "../store/historySlice"

import LoadAnimation from '../components/LoadAnimation';
import CardImage from '../components/CardImage';


const ContainerTable = () => {
    const searchText = useSelector((state: RootState) => state.search.name);
    const [modules, setModules] = useState<IModule[]>([])
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;

    const getModules = () =>
        getAllModules(searchText)
            .then(data => {
                setModules(data.modules)
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });


    const handleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
        setModules([])
        getModules();
    }

    useEffect(() => {
        dispatch(clearHistory())
        dispatch(addToHistory({ path: location, name: "Управление модулями" }))
        getModules();
    }, [dispatch]);

    const deleteModule = (uuid: string) => () => {
        let accessToken = localStorage.getItem('access_token');
        axiosAPI.delete(`/modules/${uuid}`, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(() => getModules())
    }

    return (
        <>
            <Navbar>
                <Form className="d-flex flex-row flex-grow-1 gap-2" onSubmit={handleSearch}>
                    <Form.Control
                        type="text"
                        placeholder="Поиск"
                        className="form-control-sm flex-grow-1 shadow"
                        data-bs-theme="dark"
                        value={searchText}
                        onChange={(e) => dispatch(setName(e.target.value))}
                    />
                    <Button
                        variant="primary"
                        size="sm"
                        type="submit"
                        className="shadow-lg">
                        Поиск
                    </Button>
                    <Link to='new' className='btn btn-sm btn-success shadow ms-sm-2'>Создать</Link>
                </Form>
            </Navbar>
            < LoadAnimation loaded={modules.length > 0}>
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th className='text-center'>Изображение</th>
                            <th className='text-center'>Название</th>
                            <th className=''></th>
                        </tr>
                    </thead>
                    <tbody>
                        {modules.map((module) => (
                            <tr key={module.uuid}>
                                <td style={{ width: '15%' }} className='p-0'>
                                    <CardImage url={module.image_url} />
                                </td>
                                <td className='text-center'>{module.name}</td>
                                <td className='text-center align-middle p-0'>
                                    <Table className='m-0'>
                                        <tbody>
                                            <tr>
                                                <td className='py-1 border-0' style={{ background: 'transparent' }}>
                                                    <Link
                                                        to={`/modules-edit/${module.uuid}`}
                                                        className='btn btn-sm btn-outline-secondary text-decoration-none w-100' >
                                                        Редактировать
                                                    </Link>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='py-1 border-0' style={{ background: 'transparent' }}>
                                                    <Button
                                                        variant='outline-danger'
                                                        size='sm'
                                                        className='w-100'
                                                        onClick={deleteModule(module.uuid)}>
                                                        Удалить
                                                    </Button>
                                                </td>
                                            </tr>
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

export default ContainerTable