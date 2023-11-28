import { useEffect, useState, FC } from 'react';
import { SmallRCard, IModuleProps } from '../components/ModuleCard';
import LoadAnimation from '../components/LoadAnimation';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


type Response = {
    draft_mission: string;
    modules: IModuleProps[];
}

interface ISearchProps {
    setModules: React.Dispatch<React.SetStateAction<IModuleProps[]>>
}

async function getModules(filter?: string): Promise<Response> {
    let api = '/api/modules'
    if (filter !== undefined) {
        api += `?name=${filter}`
    }
    return fetch(api)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            return response.json() as Promise<Response>
        })
}

const Search: FC<ISearchProps> = ({ setModules }) => {
    const [searchText, setSearchText] = useState<string>('');

    const handleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
        console.log(searchText);
        getModules(searchText)
            .then(data => {
                console.log(data)
                setModules(data.modules)
            })
    }
    return (
        <Navbar>
            <Form className="d-flex flex-row flex grow-1 gap-2" onSubmit={handleSearch}>
                <Form.Control
                    type="text"
                    placeholder="Поиск"
                    className="form-control-sm flex-grow-1 shadow shadow-sm"
                    data-bs-theme="primary"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                 <Button
                    variant="primary"
                    size="sm"
                    type="submit"
                    className="shadow">
                    Поиск
                </Button>
            </Form>
        </Navbar>)
}

const AllModules = () => {
        const [loaded, setLoaded] = useState<boolean>(false)
        const [modules, setModules] = useState<IModuleProps[]>([]);
        const [_, setDraftMission] = useState('');
    
        useEffect(() => {
            getModules()
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
            <Search  setModules={setModules} />
            <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 px-1'>
            {loaded ? (
                    modules.map((module) => (
                    <div className='d-flex py-1 p-2 justify-content-center' key={module.uuid}>
                        <SmallRCard {...module} />
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