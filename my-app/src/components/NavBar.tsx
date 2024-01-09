import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function NavigationBar() {
    return (
        <Navbar expand="sm" className='bg-custom' data-bs-theme="dark" >
            <div className='container-xl px-2 px-sm-3'>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto flex-grow-1">
                        {/* <Nav.Item> */}
                            <Link to="/modules" className="nav-link ps-0">Модули</Link>
                        {/* </Nav.Item> */}
                        {/* <Nav.Item> */}
                            <Link to="/missions" className="nav-link">Миссии</Link>
                        {/* </Nav.Item> */}
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
}

export default NavigationBar;