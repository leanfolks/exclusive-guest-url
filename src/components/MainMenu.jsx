import { Link } from "react-router-dom";


import { useLocation } from "react-router-dom";


const MainMenu = ({ style = "", userId, slug }) => {
  const { pathname } = useLocation();


  return (
    <nav className="menu js-navList">
      {!userId ?
      <ul className={`menu__nav ${style} -is-active`}>
        <li className={pathname === "/events" ? "current" : ""}>
          <Link to="/events">Events</Link>
        </li>
        <li className={pathname === "/results" ? "current" : ""}>
          <Link to="/results">Results</Link>
        </li>
        <li className={pathname === "/services" ? "current" : ""}>
          <Link to="/services">Services</Link>
        </li>
        
        <li className={pathname === "/photos" ? "current" : ""}>
        <Link to="/photos">Photos</Link>
         </li>
        <li className={pathname === "/contact" ? "current" : ""}>
          <Link to="/contact">Contact Us</Link>
        </li>
      </ul>
      : 
      
      <ul className={`menu__nav ${style} -is-active`}>
        {slug ? 
      <li className={pathname === "/organizer-dashboard" ? "current" : ""}>
        <Link to={`/organizer-dashboard?userId=${userId}`}>Events</Link>
      </li>
      : 
      <li className={pathname === "/events" ? "current" : ""}>
        <Link to={`/events`}>Events</Link>
      </li>  
}
    </ul>
}
    </nav>
  );
};

export default MainMenu;
