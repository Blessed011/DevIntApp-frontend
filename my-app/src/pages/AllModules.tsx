import { useEffect, useState, FC } from 'react';
import { SmallCCard, IModuleProps } from '../components/ModuleCard';
import LoadAnimation from '../components/LoadAnimation';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { getAllModules } from '../requests/GetAllModules'

interface ISearchProps {
    setModules: React.Dispatch<React.SetStateAction<IModuleProps[]>>
}

const Search: FC<ISearchProps> = ({ setModules }) => {
    const [searchText, setSearchText] = useState<string>('');

    const handleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
        getAllModules(searchText)
            .then(data => {
                console.log(data)
                setModules(data.modules)
            })
    }
    return (
        <Navbar>
            <Form className="d-flex flex-row flex-grow-1 gap-2" onSubmit={handleSearch}>
                <Form.Control
                    type="text"
                    placeholder="Поиск"
                    className="form-control-sm flex-grow-1 shadow"
                    data-bs-theme="light"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <Button
                    variant="primary"
                    size="sm"
                    type="submit"
                    className="shadow-lg">
                    Поиск
                </Button>
            </Form>
        </Navbar>)
}

const AllModules = () => {
    const [loaded, setLoaded] = useState<boolean>(false)
    const [modules, setModules] = useState<IModuleProps[]>([]);
    const [_, setDraftMission] = useState<string | null>(null);

    useEffect(() => {
        getAllModules()
            .then(data => {
                console.log(data)
                setDraftMission(data.draft_mission)
                setModules(data.modules)
                setLoaded(true)
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    return (
        <>
            <Search setModules={setModules} />
            <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 px-1'>
                {loaded ? (
                    modules.map((module) => (
                        <div className='d-flex p-2 justify-content-center' key={module.uuid}>
                            <SmallCCard  {...module} />
                        </div>
                    ))
                ) : (
                    <LoadAnimation />
                )}
            </div>
        </>
    )
}

export { AllModules }