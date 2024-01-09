import { useEffect, useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from 'react-router-dom';

import { getAllModules, axiosAPI } from '../api'
import { IModule } from '../models'

import { AppDispatch, RootState } from "../store";
import { setName } from "../store/searchSlice"                            ////   setName oder setType ?????
import { clearHistory, addToHistory } from "../store/historySlice"

import { SmallCCard } from '../components/ModuleCard';
import LoadAnimation from '../components/LoadAnimation';

const AllModules = () => {
    const searchText = useSelector((state: RootState) => state.search.name);
    const [modules, setModules] = useState<IModule[]>([])
    const [draft, setDraft] = useState<string | null>(null)
    const role = useSelector((state: RootState) => state.user.role);
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;

    const getModules = () =>
        getAllModules(searchText)
            .then(data => {
                setModules(data.modules)
                setDraft(data.draft_mission)
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });


    const handleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
        getModules();
    }

    useEffect(() => {
        dispatch(clearHistory())
        dispatch(addToHistory({ path: location, name: "Модули" }))
        getModules();
    }, [dispatch]);

    const addToMission = (id: string) => () => {
        let accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }

        axiosAPI.post(`/modules/${id}/add_to_mission`, null, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(() => {
                getModules();
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    console.log(draft)

    return (
        <>
            <Navbar>
                <Form className="d-flex flex-row flex-grow-1 gap-2" onSubmit={handleSearch}>
                    <Form.Control
                        type="text"
                        placeholder="Поиск"
                        className="form-control-sm flex-grow-1 shadow"
                        data-bs-theme="light"
                        value={searchText}
                        onChange={(e) => dispatch(setName(e.target.value))}             ///setName oder setType ????
                    />
                    <Button
                        variant="primary"
                        size="sm"
                        type="submit"
                        className="shadow-lg">
                        Поиск
                    </Button>
                </Form>
            </Navbar>
            <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 px-1'>
                <LoadAnimation loaded={modules.length > 0}>
                    {modules.map((module) => (
                        <div className='d-flex p-2 justify-content-center' key={module.uuid}>
                            <SmallCCard  {...module}>
                                {role != 0 &&
                                    <Button
                                        variant='outline-primary'
                                        className='mt-0 rounded-bottom'
                                        onClick={addToMission(module.uuid)}>
                                        Добавить
                                    </Button>
                                }
                            </SmallCCard>
                        </div>
                    ))}
                </LoadAnimation>
            </div>
            {!!role && <Link to={`/missions/${draft}`}>
                <Button
                    style={{ position: 'fixed', bottom: '16px', right: '16px', zIndex: '10' }}
                    className="btn btn-primary"
                    disabled={!draft}>
                    Корзина
                </Button>
            </Link>}
        </>
    )
}

export default AllModules